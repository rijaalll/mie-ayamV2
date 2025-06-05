// front-end/src/section/order/index.jsx

"use client";
import { useState, useEffect } from "react";
import { Sidebar, BottomNav } from "./components";
import { ShoppingCart, Home, Clock, Menu, X, User, MapPin, Phone } from "lucide-react";

export default function OrderPage({ tableId }) {
  const [tableData, setTableData] = useState(null);
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeCategory, setActiveCategory] = useState("semua");
  const [activeView, setActiveView] = useState("menu");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [orderId, setOrderId] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  const [orderedItems, setOrderedItems] = useState([]);
  const [orderCustomerName, setOrderCustomerName] = useState(""); // Nama pemesan dari order
  const [orderCustomerPhone, setOrderCustomerPhone] = useState(""); // Nomor WhatsApp dari order
  const [orderTableNumber, setOrderTableNumber] = useState(""); // Nomor meja dari order
  const [pollingId, setPollingId] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

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

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/kategori/all`);
        const data = await res.json();
        if (data.status === "OK" && data.kategori) {
          setCategories(data.kategori);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
  }, [API_URL]);

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
          setOrderCustomerName(data.cust_name || ""); // Ambil nama customer dari response
          setOrderCustomerPhone(data.telephone || ""); // Ambil nomor WhatsApp dari response
          setOrderTableNumber(data.table_number || ""); // Ambil nomor meja dari response
          
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

    return () => clearInterval(intervalId);
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

  // Validasi format nomor WhatsApp
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmitOrder = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    // Validasi input
    if (!customerName.trim()) {
      setError("Nama customer harus diisi");
      setLoading(false);
      return;
    }

    if (!customerPhone.trim()) {
      setError("Nomor WhatsApp harus diisi");
      setLoading(false);
      return;
    }

    if (!validatePhoneNumber(customerPhone.trim())) {
      setError("Format nomor WhatsApp tidak valid. Contoh: 081234567777");
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
        telephone: customerPhone.trim(),
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
        setOrderCustomerName(customerName.trim()); // Set nama customer yang baru saja memesan
        setOrderCustomerPhone(customerPhone.trim()); // Set nomor WhatsApp customer
        setOrderTableNumber(tableData.nomor); // Set nomor meja
        setCart([]);
        setCustomerName("");
        setCustomerPhone("");
        setActiveView("pesanan");
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

  const getFilteredMenus = () => {
    if (activeCategory === "semua") return menus;
    return menus.filter(menu => menu.category === activeCategory);
  };

  const getMenusByCategory = () => {
    const menusByCategory = {};
    categories.forEach(cat => {
      menusByCategory[cat.name] = menus.filter(menu => menu.category === cat.name);
    });
    return menusByCategory;
  };

  const renderOrderStatus = () => {
    if (!orderId) return (
      <div className="text-center py-8 text-gray-500">
        <Clock size={48} className="mx-auto mb-4 text-gray-300" />
        <p>Belum ada pesanan</p>
        <p className="text-sm mt-2">Silakan pilih menu dan buat pesanan terlebih dahulu</p>
      </div>
    );

    let statusText = "";
    let statusColor = "";
    switch (orderStatus) {
      case 0: 
        statusText = "Dipesan"; 
        statusColor = "text-yellow-600 bg-yellow-100";
        break;
      case 1: 
        statusText = "Menunggu Pembayaran"; 
        statusColor = "text-orange-600 bg-orange-100";
        break;
      case 2: 
        statusText = "Dibayar"; 
        statusColor = "text-blue-600 bg-blue-100";
        break;
      case 3: 
        statusText = "Pesanan sedang disiapkan"; 
        statusColor = "text-purple-600 bg-purple-100";
        break;
      case 4: 
        statusText = "Pesanan selesai"; 
        statusColor = "text-green-600 bg-green-100";
        break;
      case 5: 
        statusText = "Pesanan dibatalkan"; 
        statusColor = "text-red-600 bg-red-100";
        break;
      default: 
        statusText = "Status tidak diketahui"; 
        statusColor = "text-gray-600 bg-gray-100";
        break;
    }

    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Status Pesanan</h3>
        
        {/* Info Pesanan */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <User size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Nama Pemesan</p>
                <p className="font-semibold text-gray-800">{orderCustomerName || "Tidak tersedia"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <Phone size={16} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">WhatsApp</p>
                <p className="font-semibold text-gray-800">{orderCustomerPhone || "Tidak tersedia"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-2 rounded-full">
                <MapPin size={16} className="text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Nomor Meja</p>
                <p className="font-semibold text-gray-800">Meja {orderTableNumber || "Tidak tersedia"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="text-center mb-6">
          <div className={`inline-block px-6 py-3 rounded-full font-semibold text-lg ${statusColor}`}>
            {statusText}
          </div>
          <p className="text-sm text-gray-500 mt-2">ID Pesanan: #{orderId}</p>
        </div>

        {/* Detail Item Pesanan */}
        <div className="space-y-3 mb-6">
          <h4 className="font-semibold text-gray-800 mb-3">Detail Pesanan:</h4>
          {orderedItems.map((item, index) => (
            <div key={item.id || index} className="flex justify-between items-center border-b pb-3 last:border-b-0">
              <div className="flex items-center gap-3">
                <img 
                  src={item.menu_img} 
                  alt={item.menu_name} 
                  className="w-12 h-12 object-cover rounded-lg" 
                />
                <div>
                  <p className="font-medium text-gray-800">{item.menu_name}</p>
                  <p className="text-sm text-gray-500">x {item.quantity}</p>
                </div>
              </div>
              <span className="font-semibold text-gray-800">
                Rp {(item.quantity * parseInt(item.menu_price)).toLocaleString('id-ID')}
              </span>
            </div>
          ))}
        </div>

        {/* Total Harga */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center font-bold text-lg">
            <span className="text-gray-800">Total Pembayaran:</span>
            <span className="text-green-700">
              Rp {orderedItems.reduce((sum, i) => sum + i.quantity * parseInt(i.menu_price), 0).toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* Informasi Tambahan */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Info:</strong> Status pesanan akan diperbarui secara otomatis. 
            {orderStatus < 4 && " Harap menunggu hingga pesanan selesai disiapkan."}
          </p>
        </div>
      </div>
    );
  };

  const renderMenuContent = () => {
    const filteredMenus = getFilteredMenus();
    
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {activeCategory === "semua" ? "Semua Menu" : activeCategory}
          </h2>
          <span className="text-gray-500 text-sm">
            {filteredMenus.length} menu tersedia
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenus.map(menu => (
            <div key={menu.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img 
                src={menu.menu_img} 
                alt={menu.menu_name} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{menu.menu_name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{menu.menu_des}</p>
                <div className="flex justify-between items-center">
                  <span className="text-blue-600 font-bold text-lg">
                    Rp {parseInt(menu.menu_price).toLocaleString('id-ID')}
                  </span>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    onClick={() => addToCart(menu)}
                  >
                    Tambah
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCartContent = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Keranjang Belanja</h2>
      
      {cart.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <ShoppingCart size={48} className="mx-auto mb-4 text-gray-300" />
          <p>Keranjang belanja kosong</p>
          <p className="text-sm mt-2">Silakan pilih menu dari halaman menu</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.id} className="flex items-center gap-4 border-b pb-4">
                <img src={item.menu_img} alt={item.menu_name} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1">
                  <h4 className="font-medium">{item.menu_name}</h4>
                  <p className="text-blue-600 font-semibold">Rp {parseInt(item.menu_price).toLocaleString('id-ID')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                    type="button"
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                    type="button"
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                  >
                    +
                  </button>
                  <button 
                    onClick={() => removeFromCart(item.id)} 
                    type="button" 
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-xl font-bold mb-4">
              <span>Total:</span>
              <span className="text-green-600">Rp {getTotalPrice().toLocaleString('id-ID')}</span>
            </div>

            {/* Input Nama Customer */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap *
              </label>
              <input
                type="text"
                placeholder="Masukkan nama lengkap Anda"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Input Nomor WhatsApp */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nomor WhatsApp *
              </label>
              <input
                type="tel"
                placeholder="Contoh: 081234567777"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Format: 08xxxxxxxxxx atau +62xxxxxxxxx
              </p>
            </div>

            <button
              onClick={handleSubmitOrder}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? "Mengirim Pesanan..." : "Pesan Sekarang"}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  if (tableLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!tableData) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-500">
        <div className="text-center">
          <p className="text-xl font-semibold">Meja tidak ditemukan</p>
          <p className="text-gray-600 mt-2">Silakan cek kembali nomor meja Anda</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar for Desktop/Mobile */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        activeView={activeView} 
        setActiveView={setActiveView} 
        categories={categories} 
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory} 
      />
      
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarClose(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <div className="bg-white shadow-sm border-b px-4 py-4 lg:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
              >
                <Menu size={20} />
              </button>
              <div>
                <h1 className="text-xl font-bold">Meja Nomor {tableData.nomor}</h1>
                <p className="text-gray-600 text-sm">Silakan pilih menu favorit Anda</p>
              </div>
            </div>
            
            {/* Cart badge for desktop */}
            <div className="hidden lg:flex items-center gap-4">
              {cart.length > 0 && (
                <button
                  onClick={() => setActiveView("keranjang")}
                  className="flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-lg hover:bg-orange-200 transition-colors"
                >
                  <ShoppingCart size={20} />
                  <span>{cart.length} item</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 lg:p-6 pb-20 lg:pb-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              {success}
            </div>
          )}

          {activeView === "menu" && renderMenuContent()}
          {activeView === "pesanan" && renderOrderStatus()}
          {activeView === "keranjang" && renderCartContent()}
        </div>
      </div>

      {/* Bottom Navigation for Mobile */}
      <BottomNav activeView={activeView} setActiveView={setActiveView} categories={categories} cart={cart} />
    </div>
  );
}