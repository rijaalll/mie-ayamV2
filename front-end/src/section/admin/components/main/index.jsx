// front-end/src/section/admin/components/dashboard/index.jsx
'use client'

import { useState, useEffect } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function AdminMainPage() {
    const [dashboardData, setDashboardData] = useState({
        totalCategories: 0,
        todayTransactions: 0,
        todayRevenue: 0,
        loading: true
    })

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            setDashboardData(prev => ({ ...prev, loading: true }))
            
            // Fetch categories
            const categoriesRes = await fetch(`${API_URL}/kategori/all`)
            const categoriesData = await categoriesRes.json()
            
            // Get today's date
            const today = new Date()
            const day = today.getDate().toString().padStart(2, '0')
            const month = (today.getMonth() + 1).toString().padStart(2, '0')
            const year = today.getFullYear().toString()
            
            // Fetch today's transactions
            const transactionsRes = await fetch(`${API_URL}/transaction/date/${day}-${month}-${year}`)
            let todayTransactions = 0
            let todayRevenue = 0
            
            if (transactionsRes.ok) {
                const transactionsData = await transactionsRes.json()
                todayTransactions = transactionsData.transactions?.length || 0
                todayRevenue = transactionsData.transactions?.reduce((sum, transaction) => 
                    sum + parseInt(transaction.order_total), 0
                ) || 0
            }
            
            setDashboardData({
                totalCategories: categoriesData.kategori?.length || 0,
                todayTransactions,
                todayRevenue,
                loading: false
            })
        } catch (error) {
            console.error('Error fetching dashboard data:', error)
            setDashboardData(prev => ({ ...prev, loading: false }))
        }
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(amount)
    }

    if (dashboardData.loading) {
        return (
            <div className="w-full h-[50vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    return (
        <div className="w-full p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Admin</h1>
                <p className="text-gray-600">Ringkasan data bisnis Anda</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Total Categories Card */}
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Total Kategori</p>
                            <p className="text-3xl font-bold text-gray-800">{dashboardData.totalCategories}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                            <span className="bi bi-tags text-blue-500 text-2xl"></span>
                        </div>
                    </div>
                </div>

                {/* Today's Transactions Card */}
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Transaksi Hari Ini</p>
                            <p className="text-3xl font-bold text-gray-800">{dashboardData.todayTransactions}</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                            <span className="bi bi-receipt text-green-500 text-2xl"></span>
                        </div>
                    </div>
                </div>

                {/* Today's Revenue Card */}
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Pendapatan Hari Ini</p>
                            <p className="text-2xl font-bold text-gray-800">{formatCurrency(dashboardData.todayRevenue)}</p>
                        </div>
                        <div className="bg-yellow-100 p-3 rounded-full">
                            <span className="bi bi-currency-dollar text-yellow-500 text-2xl"></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Aksi Cepat</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button 
                        onClick={() => window.location.href = '/page/admin/manage/menu'}
                        className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <span className="bi bi-menu-button-wide text-2xl text-blue-500 mb-2"></span>
                        <span className="text-sm font-medium">Kelola Menu</span>
                    </button>
                    
                    <button 
                        onClick={() => window.location.href = '/page/admin/manage/kasir'}
                        className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <span className="bi bi-people text-2xl text-green-500 mb-2"></span>
                        <span className="text-sm font-medium">Kelola Kasir</span>
                    </button>
                    
                    <button 
                        onClick={() => window.location.href = '/page/admin/manage/table'}
                        className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <span className="bi bi-table text-2xl text-purple-500 mb-2"></span>
                        <span className="text-sm font-medium">Kelola Meja</span>
                    </button>
                    
                    <button 
                        onClick={() => window.location.href = '/page/admin/selling'}
                        className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <span className="bi bi-graph-up text-2xl text-red-500 mb-2"></span>
                        <span className="text-sm font-medium">Laporan</span>
                    </button>
                </div>
            </div>
        </div>
    )
}