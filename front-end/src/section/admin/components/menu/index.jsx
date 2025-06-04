// front-end/src/section/admin/components/menu/index.jsx
"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/src/utils/authContext";
import { useRouter } from "next/navigation";

export default function MenuManagement() {
  const { isLoggedIn, level, id: userId, user } = useAuth();
  const router = useRouter();
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const [formData, setFormData] = useState({
    menu_name: "",
    menu_price: "",
    menu_des: "",
    category: "",
    file: null,
  });

  // Check authentication and authorization
  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/auth');
      return;
    }
    
    if (level !== 'admin') {
      router.push('/');
      return;
    }
    
    // Load data only if user is authenticated
    fetchMenus();
    fetchCategories();
  }, [isLoggedIn, level, router]);

  const fetchMenus = async () => {
    try {
      const response = await fetch(`${API_URL}/menu/all`);
      const data = await response.json();
      if (data.status === "OK") {
        setMenus(data.all_menu || []);
      }
    } catch (error) {
      console.error("Error fetching menus:", error);
      setError("Gagal mengambil data menu");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/kategori/all`);
      const data = await response.json();
      if (data.status === "OK") {
        setCategories(data.kategori || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.name === "file") {
      setFormData({
        ...formData,
        file: e.target.files[0],
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate user authentication
    if (!userId) {
      setError("Anda harus login sebagai admin untuk melakukan aksi ini");
      return;
    }
    
    setLoading(true);
    setError("");
    setSuccess("");
  
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("menu_name", formData.menu_name);
      formDataToSend.append("menu_price", formData.menu_price);
      formDataToSend.append("menu_des", formData.menu_des);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("user_id", userId);
  
      if (formData.file) {
        formDataToSend.append("file", formData.file);
      }
  
      // Tentukan endpoint berdasarkan editMode
      const endpoint = editMode && selectedMenu
        ? `${API_URL}/menu/update`
        : `${API_URL}/menu/add`;
  
      if (editMode && selectedMenu) {
        formDataToSend.append("id", selectedMenu.id);
      }
  
      const response = await fetch(endpoint, {
        method: "POST",
        body: formDataToSend,
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setSuccess(editMode ? "Menu berhasil diupdate!" : "Menu berhasil ditambahkan!");
        resetForm();
        fetchMenus();
        setShowModal(false);
      } else {
        setError(data.message || "Terjadi kesalahan");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Terjadi kesalahan saat menyimpan menu");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (menu) => {
    setSelectedMenu(menu);
    setFormData({
      menu_name: menu.menu_name,
      menu_price: menu.menu_price,
      menu_des: menu.menu_des,
      category: menu.category,
      file: null,
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (menu) => {
    if (!confirm("Apakah Anda yakin ingin menghapus menu ini?")) {
      return;
    }

    // Validate user authentication
    if (!userId) {
      setError("Anda harus login sebagai admin untuk melakukan aksi ini");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/menu/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: menu.id,
          user_id: userId,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setSuccess("Menu berhasil dihapus!");
        fetchMenus();
      } else {
        setError(data.message || "Gagal menghapus menu");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Terjadi kesalahan saat menghapus menu");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      menu_name: "",
      menu_price: "",
      menu_des: "",
      category: "",
      file: null,
    });
    setEditMode(false);
    setSelectedMenu(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  // Show loading state while checking authentication
  if (!isLoggedIn || level !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Kelola Menu</h1>
          <p className="text-gray-600 mt-1">Selamat datang, {user.name} (ID: {userId})</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          Tambah Menu
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
          {success}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gambar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Menu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Harga
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deskripsi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {menus.map((menu) => (
                <tr key={menu.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={menu.menu_img}
                      alt={menu.menu_name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {menu.menu_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: {menu.menu_id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {menu.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rp {parseInt(menu.menu_price).toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {menu.menu_des}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(menu)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(menu)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
              {menus.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    Belum ada menu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-6">
                {editMode ? "Edit Menu" : "Tambah Menu Baru"}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Menu
                  </label>
                  <input
                    type="text"
                    name="menu_name"
                    value={formData.menu_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan nama menu"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Harga
                  </label>
                  <input
                    type="number"
                    name="menu_price"
                    value={formData.menu_price}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan harga menu"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    name="menu_des"
                    value={formData.menu_des}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan deskripsi menu"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gambar Menu
                  </label>
                  <input
                    type="file"
                    name="file"
                    onChange={handleInputChange}
                    accept="image/*"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {editMode && (
                    <p className="text-sm text-gray-500 mt-1">
                      Kosongkan jika tidak ingin mengubah gambar
                    </p>
                  )}
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-500 hover:text-gray-700 transition duration-200"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200 disabled:opacity-50"
                  >
                    {loading ? "Menyimpan..." : editMode ? "Update" : "Tambah"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}