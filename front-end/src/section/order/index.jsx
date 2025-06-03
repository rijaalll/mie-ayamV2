// front-end/src/section/order/index.jsx
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

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Fetch table data by ID
  useEffect(() => {
    const fetchTableData = async () => {
      try {
        setTableLoading(true);
        const response = await fetch(`${API_URL}/table/${tableId}`);
        const data = await response.json();
        
        // Langsung set data-nya karena tidak ada `data.table`, tapi data sudah benar
        if (response.ok && data && data.nomor) {
            setTableData(data);
        } else {
            setError("Meja tidak ditemukan atau tidak valid");
        }
  
      } catch (error) {
        console.error("Error fetching table data:", error);
        setError("Gagal mengambil data meja");
      } finally {
        setTableLoading(false);
      }
    };

    if (tableId) {
      fetchTableData();
    }
  }, [tableId, API_URL]);

  // Fetch menu data
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await fetch(`${API_URL}/menu/all`);
        const data = await response.json();
        
        if (data.status === "OK" && data.all_menu) {
          setMenus(data.all_menu);
        }
      } catch (error) {
        console.error("Error fetching menus:", error);
        setError("Gagal mengambil data menu");
      }
    };

    fetchMenus();
  }, [API_URL]);

  const addToCart = (menu) => {
    const existingItem = cart.find(item => item.id === menu.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === menu.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...menu, quantity: 1 }]);
    }
  };

  const removeFromCart = (menuId) => {
    setCart(cart.filter(item => item.id !== menuId));
  };

  const updateQuantity = (menuId, quantity) => {
    if (quantity === 0) {
      removeFromCart(menuId);
      return;
    }
    
    setCart(cart.map(item =>
      item.id === menuId 
        ? { ...item, quantity: quantity }
        : item
    ));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => 
      total + (parseInt(item.menu_price) * item.quantity), 0
    );
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    if (!customerName.trim()) {
      setError("Nama customer harus diisi");
      return;
    }

    if (cart.length === 0) {
      setError("Keranjang masih kosong");
      return;
    }

    if (!tableData) {
      setError("Data meja tidak valid");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Prepare order list for API
      const orderList = {};
      cart.forEach(item => {
        orderList[item.id] = item.quantity;
      });

      const orderData = {
        cust_name: customerName.trim(),
        table_number: tableData.nomor, // Use table number from API
        order_status: 0, // Pending status
        order_list: orderList
      };

      console.log("Sending order data:", orderData); // Debug log

      const response = await fetch(`${API_URL}/order/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(`Pesanan berhasil dibuat! ID Pesanan: ${data.order.id}`);
        // Reset form
        setCart([]);
        setCustomerName("");
      } else {
        setError(data.message || "Gagal membuat pesanan");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      setError("Terjadi kesalahan saat membuat pesanan");
    } finally {
      setLoading(false);
    }
  };

  // Show loading while fetching table data
  if (tableLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data meja...</p>
        </div>
      </div>
    );
  }

  // Show error if table not found
  if (!tableData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Meja Tidak Ditemukan</h1>
          <p className="text-gray-600">Meja dengan ID "{tableId}" tidak ditemukan atau tidak valid.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Mie Hoog Restaurant</h1>
              <p className="text-gray-600">Meja Nomor {tableData.nomor}</p>
            </div>
            {cart.length > 0 && (
              <div className="text-right">
                <p className="text-sm text-gray-600">{cart.length} item dalam keranjang</p>
                <p className="text-lg font-bold text-blue-600">
                  Rp {getTotalPrice().toLocaleString('id-ID')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu List */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Menu Tersedia</h2>
            
            {menus.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Memuat menu...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {menus.map((menu) => (
                  <div key={menu.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <img
                      src={menu.menu_img}
                      alt={menu.menu_name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = '/images/default-food.jpg'; // Fallback image
                      }}
                    />
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-gray-800 mb-2">{menu.menu_name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{menu.menu_des}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-blue-600">
                          Rp {parseInt(menu.menu_price).toLocaleString('id-ID')}
                        </span>
                        <button
                          onClick={() => addToCart(menu)}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                        >
                          Tambah
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart & Order Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Keranjang Pesanan</h2>
              
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Keranjang masih kosong</p>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between border-b pb-4">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{item.menu_name}</h4>
                          <p className="text-gray-600 text-sm">
                            Rp {parseInt(item.menu_price).toLocaleString('id-ID')}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-blue-600">
                        Rp {getTotalPrice().toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handleSubmitOrder} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Pemesan
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Masukkan nama Anda"
                      />
                    </div>

                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm text-gray-600">
                        <strong>Meja:</strong> {tableData.nomor}
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50"
                    >
                      {loading ? "Memproses..." : "Pesan Sekarang"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}