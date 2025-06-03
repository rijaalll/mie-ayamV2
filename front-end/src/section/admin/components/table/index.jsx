// front-end/src/section/admin/components/table/index.jsx
"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/src/utils/authContext";
import { QRCodeSVG } from 'qrcode.react';

export default function TableManagement() {
  const { login, level, id: userId } = useAuth();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const [formData, setFormData] = useState({
    nomor: "",
  });

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await fetch(`${API_URL}/table/all`);
      const data = await response.json();
      if (data.status === "OK") {
        setTables(data.tables || []);
      }
    } catch (error) {
      console.error("Error fetching tables:", error);
      setError("Gagal mengambil data meja");
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      let response;
      if (editMode && selectedTable) {
        response = await fetch(`${API_URL}/table/${selectedTable.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nomor: parseInt(formData.nomor),
          }),
        });
      } else {
        response = await fetch(`${API_URL}/table/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nomor: parseInt(formData.nomor),
          }),
        });
      }

      const data = await response.json();
      
      if (response.ok) {
        setSuccess(editMode ? "Meja berhasil diupdate!" : "Meja berhasil ditambahkan!");
        resetForm();
        fetchTables();
        setShowModal(false);
      } else {
        setError(data.message || "Terjadi kesalahan");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Terjadi kesalahan saat menyimpan meja");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (table) => {
    setSelectedTable(table);
    setFormData({
      nomor: table.nomor.toString(),
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (table) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus meja nomor ${table.nomor}?`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/table/${table.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSuccess("Meja berhasil dihapus!");
        fetchTables();
      } else {
        const data = await response.json();
        setError(data.message || "Gagal menghapus meja");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Terjadi kesalahan saat menghapus meja");
    } finally {
      setLoading(false);
    }
  };

  const handleShowQR = (table) => {
    setSelectedTable(table);
    setShowQRModal(true);
  };

  const downloadQR = () => {
    const canvas = document.getElementById(`qr-${selectedTable.id}`);
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `QR-Meja-${selectedTable.nomor}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const printQR = () => {
    const printWindow = window.open('', '_blank');
    const qrCode = document.querySelector(`#qr-container-${selectedTable.id}`).innerHTML;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>QR Code Meja ${selectedTable.nomor}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              text-align: center; 
              margin: 20px;
            }
            .print-container {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 20px;
            }
            .qr-wrapper {
              border: 2px solid #000;
              padding: 20px;
              border-radius: 10px;
            }
            h1 { color: #333; margin-bottom: 10px; }
            p { color: #666; margin: 5px 0; }
          </style>
        </head>
        <body>
          <div class="print-container">
            <h1>Mie Hoog Restaurant</h1>
            <h2>Meja Nomor ${selectedTable.nomor}</h2>
            <div class="qr-wrapper">
              ${qrCode}
            </div>
            <p>Scan QR Code untuk memesan</p>
            <p>Atau kunjungi: ${BASE_URL}/order/${selectedTable.id}</p>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
  };

  const resetForm = () => {
    setFormData({
      nomor: "",
    });
    setEditMode(false);
    setSelectedTable(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const closeQRModal = () => {
    setShowQRModal(false);
    setSelectedTable(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Kelola Meja</h1>
        <button
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          Tambah Meja
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
                  ID Meja
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nomor Meja
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  QR Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Link Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tables.map((table) => (
                <tr key={table.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {table.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-800">
                            {table.nomor}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          Meja {table.nomor}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleShowQR(table)}
                      className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                      </svg>
                      Lihat QR
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                        /order/{table.id}
                      </code>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(table)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(table)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
              {tables.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    Belum ada meja
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/3 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-6">
                {editMode ? "Edit Meja" : "Tambah Meja Baru"}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor Meja
                  </label>
                  <input
                    type="number"
                    name="nomor"
                    value={formData.nomor}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan nomor meja"
                  />
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

      {/* QR Code Modal */}
      {showQRModal && selectedTable && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  QR Code - Meja {selectedTable.nomor}
                </h3>
                <button
                  onClick={closeQRModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="text-center space-y-6">
                <div className="bg-gray-50 p-8 rounded-lg">
                  <div id={`qr-container-${selectedTable.id}`} className="flex justify-center">
                    <QRCodeSVG
                      id={`qr-${selectedTable.id}`}
                      value={`${BASE_URL}/order/${selectedTable.id}`}
                      size={200}
                      level="M"
                      includeMargin={true}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Link Order: 
                    <span className="ml-2 font-mono bg-gray-100 px-2 py-1 rounded">
                      {BASE_URL}/order/{selectedTable.id}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Customer dapat scan QR code ini untuk langsung memesan dari meja {selectedTable.nomor}
                  </p>
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={downloadQR}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download PNG
                  </button>
                  <button
                    onClick={printQR}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}