"use client";
import { useState, useEffect } from "react";

export default function OrderPage({ tableId }) {
  const [tableData, setTableData] = useState(null);
  const [menus, setMenus] = useState([]);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [orderId, setOrderId] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  const [orderedItems, setOrderedItems] = useState([]);
  const [pollingId, setPollingId] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Fetch table data
  useEffect(() => {
    const fetchTableData = async () => {
      try {
        setTableLoading(true);
        const res = await fetch(`${API_URL}/table/${tableId}`);
        const data = await res.json();
        if (res.ok && data && data.nomor) {
          setTableData(data);
        } else {
          setError("Meja tidak ditemukan atau tidak valid");
        }
      } catch (err) {
        console.error(err);
        setError("Gagal mengambil data meja");
      } finally {
        setTableLoading(false);
      }
    };

    if (tableId) fetchTableData();
  }, [tableId, API_URL]);

  // Fetch menu list
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await fetch(`${API_URL}/menu/all`);
        const data = await res.json();
        if (data.status === "OK" && data.all_menu) {
          setMenus(data.all_menu);
        }
      } catch (err) {
        console.error(err);
        setError("Gagal mengambil data menu");
      }
    };

    fetchMenus();
  }, [API_URL]);

  // Poll order status every 5s
  useEffect(() => {
    if (!orderId) return;

    const intervalId = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}/order/id/${orderId}`);
        const data = await res.json();

        if (res.ok && data) {
          setOrderStatus(data.order_status);
          const items = Object.entries(data.order_list).map(([id, quantity]) => {
            const menuItem = menus.find(m => m.id === id);
            return {
              ...menuItem,
              quantity: parseInt(quantity),
            };
          });
          setOrderedItems(items);
        } else {
          console.warn("Order not found or invalid response");
        }
      } catch (err) {
        console.error("Error polling order:", err);
      }
    }, 5000);

    setPollingId(intervalId);

    return () => clearInterval(intervalId); // cleanup
  }, [orderId, menus, API_URL]);

  const addToCart = (menu) => {
    const exist = cart.find(item => item.id === menu.id);
    if (exist) {
      setCart(cart.map(item => item.id === menu.id
        ? { ...item, quantity: item.quantity + 1 }
        : item));
    } else {
      setCart([...cart, { ...menu, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id, qty) => {
    if (qty <= 0) return removeFromCart(id);
    setCart(cart.map(item => item.id === id ? { ...item, quantity: qty } : item));
  };

  const getTotalPrice = () =>
    cart.reduce((sum, item) => sum + parseInt(item.menu_price) * item.quantity, 0);

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!customerName.trim()) {
      setError("Nama customer harus diisi");
      setLoading(false);
      return;
    }

    if (!tableData || cart.length === 0) {
      setError("Data meja tidak valid atau keranjang kosong");
      setLoading(false);
      return;
    }

    try {
      const orderList = {};
      cart.forEach(item => {
        orderList[item.id] = item.quantity;
      });

      const body = {
        cust_name: customerName.trim(),
        table_number: tableData.nomor,
        order_status: 0,
        order_list: orderList
      };

      const res = await fetch(`${API_URL}/order/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(`Pesanan berhasil dikirim. ID: ${data.order.id}`);
        setOrderId(data.order.id);
        setCart([]);
        setCustomerName("");
      } else {
        setError(data.message || "Gagal membuat pesanan");
      }
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat mengirim pesanan");
    } finally {
      setLoading(false);
    }
  };

  // UI for polling status
  const renderOrderStatus = () => {
    if (!orderId) return null;

    let statusText = "";
    switch (orderStatus) {
      case 0: statusText = "Menunggu konfirmasi"; break;
      case 1: statusText = "Selesaikan pembayaran"; break;
      case 2: statusText = "Pesanan dikonfirmasi"; break;
      case 3: statusText = "Pesanan sedang disiapkan"; break;
      case 4: statusText = "Pesanan selesai"; break;
      default: statusText = "Status tidak diketahui"; break;
    }

    return (
      <div className="bg-white shadow-md rounded-lg p-6 mt-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Status Pesanan</h3>
        <p className="text-blue-700 font-semibold mb-2">{statusText}</p>

        <ul className="mt-4 space-y-2">
          {orderedItems.map((item) => (
            <li key={item.id} className="flex justify-between border-b pb-2">
              <span>{item.menu_name} x {item.quantity}</span>
              <span>Rp {(item.quantity * parseInt(item.menu_price)).toLocaleString('id-ID')}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 font-bold text-right text-green-700">
          Total: Rp {orderedItems.reduce((sum, i) => sum + i.quantity * parseInt(i.menu_price), 0).toLocaleString('id-ID')}
        </div>
      </div>
    );
  };

  if (tableLoading) {
    return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
  }

  if (!tableData) {
    return <div className="min-h-screen flex justify-center items-center text-red-500">Meja tidak ditemukan</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6">
      <h1 className="text-2xl font-bold mb-2">Meja Nomor {tableData.nomor}</h1>

      {error && <div className="bg-red-100 text-red-700 p-4 mb-4 rounded">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-4 mb-4 rounded">{success}</div>}

      {!orderId && (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Menu */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold mb-4">Menu</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {menus.map(menu => (
                <div key={menu.id} className="bg-white p-4 rounded-lg shadow">
                  <img src={menu.menu_img} alt={menu.menu_name} className="w-full h-40 object-cover mb-2 rounded" />
                  <h3 className="font-semibold">{menu.menu_name}</h3>
                  <p className="text-sm text-gray-600">{menu.menu_des}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-blue-600 font-bold">
                      Rp {parseInt(menu.menu_price).toLocaleString('id-ID')}
                    </span>
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                      onClick={() => addToCart(menu)}
                    >
                      Tambah
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart */}
          <div>
            <h2 className="text-xl font-bold mb-4">Keranjang</h2>
            <form onSubmit={handleSubmitOrder} className="bg-white p-4 rounded-lg shadow space-y-4">
              {cart.length === 0 ? (
                <p className="text-gray-500 text-sm">Belum ada item</p>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.menu_name}</p>
                      <p className="text-sm text-gray-500">Rp {parseInt(item.menu_price).toLocaleString('id-ID')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} type="button">-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} type="button">+</button>
                      <button onClick={() => removeFromCart(item.id)} type="button" className="text-red-500">🗑️</button>
                    </div>
                  </div>
                ))
              )}

              <input
                type="text"
                placeholder="Nama Anda"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded"
              >
                {loading ? "Mengirim..." : "Pesan Sekarang"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Render status polling */}
      {renderOrderStatus()}
    </div>
  );
}
