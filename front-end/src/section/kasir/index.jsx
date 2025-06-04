"use client";
import { useState, useEffect, useRef } from 'react';
// Removed the problematic import for authContext
import { useAuth } from '@/src/utils/authContext'; // This line caused the error

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Status mapping untuk order
const ORDER_STATUS = {
  0: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
  1: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800', icon: '✅' },
  2: { label: 'Preparing', color: 'bg-orange-100 text-orange-800', icon: '🍳' },
  3: { label: 'Ready', color: 'bg-green-100 text-green-800', icon: '🍽️' },
  4: { label: 'Completed', color: 'bg-gray-100 text-gray-800', icon: '✔️' },
  5: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: '❌' }
};

export default function App() {
  const {user, logout} = useAuth(); // Mock user data


  const [orders, setOrders] = useState([]);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'completed'
  
  // Refs untuk long polling
  const pollingRef = useRef(null);
  const lastOrderCountRef = useRef(0);

  // Helper function untuk mendapatkan tanggal hari ini
  const getTodayDate = () => {
    const today = new Date();
    return {
      day: today.getDate(),
      month: today.getMonth() + 1, // getMonth() is 0-indexed
      year: today.getFullYear()
    };
  };

  // Helper function untuk mendapatkan tanggal kemarin
  const getYesterdayDate = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return {
      day: yesterday.getDate(),
      month: yesterday.getMonth() + 1, // getMonth() is 0-indexed
      year: yesterday.getFullYear()
    };
  };

  // Helper function untuk mengecek apakah order adalah hari ini
  const isToday = (order) => {
    const today = getTodayDate();
    // Ensure comparison is between numbers
    return order.order_day === today.day && 
           order.order_month === today.month && 
           order.order_year === today.year;
  };

  // Helper function untuk mengecek apakah order adalah kemarin
  const isYesterday = (order) => {
    const yesterday = getYesterdayDate();
    // Ensure comparison is between numbers
    return order.order_day === yesterday.day && 
           order.order_month === yesterday.month && 
           order.order_year === yesterday.year;
  };

  // Helper function untuk mengelompokkan orders berdasarkan tanggal
  const groupOrdersByDate = (orders) => {
    const todayOrders = orders.filter(order => isToday(order));
    const yesterdayOrders = orders.filter(order => isYesterday(order));
    // Filter older orders that are neither today nor yesterday
    const olderOrders = orders.filter(order => !isToday(order) && !isYesterday(order));

    return {
      today: todayOrders,
      yesterday: yesterdayOrders,
      older: olderOrders
    };
  };

  // Filter orders berdasarkan status untuk hari ini
  const getFilteredTodayOrders = (orders) => {
    const todayOrders = orders.filter(order => isToday(order));
    
    if (activeTab === 'pending') {
      return todayOrders.filter(order => order.order_status < 4); // Status 0-3 (Pending, Confirmed, Preparing, Ready)
    } else {
      return todayOrders.filter(order => order.order_status >= 4); // Status 4-5 (Completed, Cancelled)
    }
  };

  // Fetch orders dari API
  const fetchOrders = async (showLoadingSpinner = true) => {
    try {
      if (showLoadingSpinner) setLoading(true);
      
      const response = await fetch(`${API_URL}/order/all`);
      const data = await response.json();
      
      if (response.ok) {
        const newOrders = data.orders || [];
        
        // BUG FIX: Parse order_day, order_month, order_year to numbers
        const parsedOrders = newOrders.map(order => ({
          ...order,
          order_day: parseInt(order.order_day, 10), // Base 10 for parseInt
          order_month: parseInt(order.order_month, 10),
          order_year: parseInt(order.order_year, 10)
        }));

        // Deteksi pesanan baru
        if (!showLoadingSpinner && parsedOrders.length > lastOrderCountRef.current) {
          const newOrdersCount = parsedOrders.length - lastOrderCountRef.current;
          showNotification(`${newOrdersCount} pesanan baru diterima!`, 'success');
        }
        
        setOrders(parsedOrders); // Use the parsed orders
        lastOrderCountRef.current = parsedOrders.length;
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      if (showLoadingSpinner) {
        showNotification('Error mengambil data pesanan', 'error');
      }
    } finally {
      if (showLoadingSpinner) setLoading(false);
    }
  };

  // Fetch menus untuk detail order
  const fetchMenus = async () => {
    try {
      const response = await fetch(`${API_URL}/menu/all`);
      const data = await response.json();
      if (response.ok) {
        setMenus(data.all_menu || []);
      }
    } catch (error) {
      console.error('Error fetching menus:', error);
    }
  };

  // Start long polling
  const startLongPolling = () => {
    const poll = async () => {
      try {
        await fetchOrders(false); // Tidak tampilkan loading spinner
      } catch (error) {
        console.error('Polling error:', error);
      }
    };

    // Polling setiap 5 detik
    pollingRef.current = setInterval(poll, 5000);
  };

  // Stop long polling
  const stopLongPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/order/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: orderId,
          updates: {
            order_status: newStatus
          }
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Jika status menjadi completed (4), otomatis buat transaksi
        if (newStatus === 4) {
          await createTransaction(selectedOrder);
        }
        
        await fetchOrders(); // Refresh orders
        showNotification(`Status pesanan berhasil diupdate ke ${ORDER_STATUS[newStatus].label}`, 'success');
        
        // Update selected order untuk modal
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({
            ...selectedOrder,
            order_status: newStatus
          });
        }
      } else {
        showNotification(data.message || 'Error updating order status', 'error');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      showNotification('Error updating order status', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Create transaction ketika order completed
  const createTransaction = async (order) => {
    try {
      // Prepare order menu data untuk transaction
      const orderMenu = [];
      
      for (const [menuId, quantity] of Object.entries(order.order_list)) {
        const menu = menus.find(m => m.id === menuId);
        if (menu) {
          orderMenu.push({
            nama: menu.menu_name,
            harga: parseInt(menu.menu_price),
            jumlah: quantity,
            menu_img: menu.menu_img
          });
        }
      }

      const transactionData = {
        cust_name: order.cust_name,
        order_total: order.order_total,
        order_menu: orderMenu
      };

      const response = await fetch(`${API_URL}/transaction/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      if (response.ok) {
        showNotification('Transaksi berhasil dicatat!', 'success');
      }
    } catch (error) {
      console.error('Error creating transaction:', error);
      showNotification('Error membuat transaksi', 'error');
    }
  };

  // Delete order
  const deleteOrder = async (orderId) => {
    // Replaced confirm() with a custom modal/dialog for better UX and consistency
    // For this example, we'll use a simple window.confirm to avoid adding a full modal component
    // In a real application, you'd replace this with a custom confirmation dialog.
    if (!window.confirm('Apakah Anda yakin ingin menghapus pesanan ini?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/order/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: orderId }),
      });

      const data = await response.json();
      
      if (response.ok) {
        await fetchOrders();
        showNotification('Pesanan berhasil dihapus', 'success');
        setShowDetailModal(false);
      } else {
        showNotification(data.message || 'Error menghapus pesanan', 'error');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      showNotification('Error menghapus pesanan', 'error');
    }
  };

  // Show notification
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Get menu details for order
  const getOrderMenuDetails = (orderList) => {
    const menuDetails = [];
    for (const [menuId, quantity] of Object.entries(orderList)) {
      const menu = menus.find(m => m.id === menuId);
      if (menu) {
        menuDetails.push({
          ...menu,
          quantity: quantity,
          subtotal: parseInt(menu.menu_price) * quantity
        });
      }
    }
    return menuDetails;
  };

  // Open detail modal
  const openDetailModal = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  // Render order card
  const renderOrderCard = (order) => (
    <div
      key={order.id}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-indigo-500"
      onClick={() => openDetailModal(order)}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-gray-800">{order.cust_name}</h3>
          <p className="text-sm text-gray-500">Meja {order.table_number}</p>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${ORDER_STATUS[order.order_status].color}`}>
          {ORDER_STATUS[order.order_status].icon} {ORDER_STATUS[order.order_status].label}
        </span>
      </div>
      
      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Total:</span>
          <span className="font-semibold text-lg text-green-600">
            Rp {order.order_total?.toLocaleString('id-ID')}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>Tanggal:</span>
          <span>{order.order_day}/{order.order_month}/{order.order_year}</span>
        </div>
      </div>
    </div>
  );

  // Render date section
  const renderDateSection = (title, orders, showEmpty = true) => {
    if (orders.length === 0 && !showEmpty) return null;
    
    return (
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 bg-white px-4 py-2 rounded-lg shadow-sm border-l-4 border-indigo-500">
            {title}
          </h2>
          <div className="flex-1 h-px bg-gray-300 ml-4"></div>
          <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium ml-4">
            {orders.length} pesanan
          </span>
        </div>
        
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-2">📋</div>
            <p className="text-gray-500">Tidak ada pesanan</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {orders.map(renderOrderCard)}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchOrders(), fetchMenus()]);
      setLoading(false);
      
      // Start long polling setelah data pertama dimuat
      startLongPolling();
    };
    
    loadData();

    // Cleanup function
    return () => {
      stopLongPolling();
    };
  }, []);

  const handleLogout = () => {
    stopLongPolling();
    logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data pesanan...</p>
        </div>
      </div>
    );
  }

  const groupedOrders = groupOrdersByDate(orders);
  const todayFilteredOrders = getFilteredTodayOrders(orders);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Dashboard Kasir</h1>
              <p className="text-gray-600 mt-2">Kelola pesanan dan transaksi</p>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Auto-refresh aktif
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Selamat datang,</p>
              <p className="font-semibold text-gray-800">{user?.name}
                <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full ml-2">
                  {user?.level}
                </span>
              </p>
              <button 
                onClick={handleLogout}
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification.show && (
        <div className={`max-w-7xl mx-auto mb-4 p-4 rounded-lg ${
          notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Tab untuk Hari Ini */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'pending'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pesanan Aktif Hari Ini
              <span className="ml-2 px-2 py-1 text-xs bg-white bg-opacity-20 rounded-full">
                {groupedOrders.today.filter(order => order.order_status < 4).length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'completed'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pesanan Selesai Hari Ini
              <span className="ml-2 px-2 py-1 text-xs bg-white bg-opacity-20 rounded-full">
                {groupedOrders.today.filter(order => order.order_status >= 4).length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Orders Content */}
      <div className="max-w-7xl mx-auto">
        {/* Pesanan Hari Ini (Filtered) */}
        {renderDateSection(
          activeTab === 'pending' ? '🔥 Pesanan Aktif Hari Ini' : '✅ Pesanan Selesai Hari Ini',
          todayFilteredOrders
        )}

        {/* Pesanan Kemarin dan Sebelumnya (hanya tampil di tab completed) */}
        {activeTab === 'completed' && (
          <>
            {renderDateSection('📅 Pesanan Kemarin', groupedOrders.yesterday, false)}
            {renderDateSection('📋 Pesanan Sebelumnya', groupedOrders.older, false)}
          </>
        )}

        {/* Jika tidak ada pesanan sama sekali */}
        {orders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🍜</div>
            <p className="text-gray-500 text-lg">Belum ada pesanan</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Detail Pesanan</h2>
                  <p className="text-gray-600">ID: {selectedOrder.id}</p>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Nama Customer</p>
                    <p className="font-semibold">{selectedOrder.cust_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Nomor Meja</p>
                    <p className="font-semibold">Meja {selectedOrder.table_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tanggal Pesan</p>
                    <p className="font-semibold">
                      {selectedOrder.order_day}/{selectedOrder.order_month}/{selectedOrder.order_year}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${ORDER_STATUS[selectedOrder.order_status].color}`}>
                      {ORDER_STATUS[selectedOrder.order_status].icon} {ORDER_STATUS[selectedOrder.order_status].label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Menu yang Dipesan</h3>
                <div className="space-y-3">
                  {getOrderMenuDetails(selectedOrder.order_list).map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 bg-white border rounded-lg p-3">
                      <img
                        src={item.menu_img}
                        alt={item.menu_name}
                        className="w-12 h-12 object-cover rounded"
                        // Fallback for broken images
                        onError={(e) => {
                          e.target.src = `https://placehold.co/100x100/aabbcc/ffffff?text=No+Image`;
                        }}
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.menu_name}</h4>
                        <p className="text-sm text-gray-600">{item.menu_des}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">x{item.quantity}</p>
                        <p className="text-sm text-gray-600">
                          Rp {item.subtotal.toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="bg-green-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total Pembayaran:</span>
                  <span className="text-2xl font-bold text-green-600">
                    Rp {selectedOrder.order_total?.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Status Update Buttons */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Update Status Pesanan</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.entries(ORDER_STATUS).map(([status, info]) => (
                    <button
                      key={status}
                      onClick={() => updateOrderStatus(selectedOrder.id, parseInt(status))}
                      disabled={selectedOrder.order_status === parseInt(status)}
                      className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                        selectedOrder.order_status === parseInt(status)
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-white border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50'
                      }`}
                    >
                      <div className="text-lg mb-1">{info.icon}</div>
                      {info.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between">
                <button
                  onClick={() => deleteOrder(selectedOrder.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  🗑️ Hapus Pesanan
                </button>
                <div className="space-x-2">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Tutup
                  </button>
                  {selectedOrder.order_status !== 4 && (
                    <button
                      onClick={() => updateOrderStatus(selectedOrder.id, 4)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      ✅ Selesaikan Pesanan
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
