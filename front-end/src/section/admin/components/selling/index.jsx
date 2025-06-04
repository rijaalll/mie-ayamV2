"use client";

import { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement
);

export default function SellingPage() {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [menus, setMenus] = useState([]);
    const [weeklyData, setWeeklyData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalSales, setTotalSales] = useState(0);
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    // Get date in DD-MM-YYYY format
    const formatDateForAPI = (date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();
        return `${day}-${month}-${year}`;
    };

    // Get today's date in DD-MM-YYYY format
    const getTodayDate = () => {
        const today = new Date();
        return formatDateForAPI(today);
    };

    // Get last 7 days including today
    const getLast7Days = () => {
        const dates = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            dates.push({
                date: date,
                formatted: formatDateForAPI(date),
                label: date.toLocaleDateString('id-ID', { 
                    weekday: 'short', 
                    day: 'numeric',
                    month: 'short'
                })
            });
        }
        return dates;
    };

    // Fetch transactions for a specific date
    const fetchTransactionsByDate = async (dateString) => {
        try {
            const response = await fetch(`${API_URL}/api/v1/transaction/date/${dateString}`);
            
            if (response.ok) {
                const data = await response.json();
                return data.transactions || [];
            } else if (response.status === 404) {
                return [];
            } else {
                throw new Error(`Failed to fetch transactions for ${dateString}`);
            }
        } catch (error) {
            console.error(`Error fetching transactions for ${dateString}:`, error);
            return [];
        }
    };

    // Fetch today's transactions
    const fetchTodayTransactions = async () => {
        try {
            const todayDate = getTodayDate();
            const todayTransactions = await fetchTransactionsByDate(todayDate);
            
            setTransactions(todayTransactions);
            
            // Calculate total sales
            const total = todayTransactions.reduce((sum, transaction) => {
                return sum + (transaction.order_total || 0);
            }, 0);
            setTotalSales(total);
        } catch (error) {
            console.error('Error fetching today\'s transactions:', error);
            setError('Failed to fetch today\'s transactions');
        }
    };

    // Fetch 7 days sales data
    const fetch7DaysSalesData = async () => {
        try {
            const last7Days = getLast7Days();
            const salesData = [];
            
            for (const dayData of last7Days) {
                const transactions = await fetchTransactionsByDate(dayData.formatted);
                const totalSales = transactions.reduce((sum, transaction) => {
                    return sum + (transaction.order_total || 0);
                }, 0);
                
                salesData.push({
                    date: dayData.date,
                    label: dayData.label,
                    sales: totalSales,
                    transactionCount: transactions.length
                });
            }
            
            setWeeklyData(salesData);
        } catch (error) {
            console.error('Error fetching 7 days sales data:', error);
        }
    };

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_URL}/api/v1/kategori/all`);
            if (response.ok) {
                const data = await response.json();
                setCategories(data.kategori || []);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // Fetch all menus
    const fetchMenus = async () => {
        try {
            const response = await fetch(`${API_URL}/api/v1/menu/all`);
            if (response.ok) {
                const data = await response.json();
                setMenus(data.all_menu || []);
            }
        } catch (error) {
            console.error('Error fetching menus:', error);
        }
    };

    // Create category sales chart (original pie chart)
    const createCategoryChart = () => {
        if (!transactions.length || !categories.length || !menus.length) return;

        // Calculate sales by category
        const categorySales = {};
        
        // Initialize all categories with 0
        categories.forEach(category => {
            categorySales[category.name] = 0;
        });

        // Calculate sales for each category
        transactions.forEach(transaction => {
            if (transaction.order_menu && Array.isArray(transaction.order_menu)) {
                transaction.order_menu.forEach(orderItem => {
                    // Find the menu item to get its category
                    const menuItem = menus.find(menu => menu.menu_name === orderItem.nama);
                    if (menuItem && menuItem.category) {
                        const totalItemSales = orderItem.harga * orderItem.jumlah;
                        categorySales[menuItem.category] = (categorySales[menuItem.category] || 0) + totalItemSales;
                    }
                });
            }
        });

        // Prepare chart data
        const labels = Object.keys(categorySales);
        const data = Object.values(categorySales);
        const colors = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
            '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
        ];

        // Destroy existing chart if it exists
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        // Create new chart
        const ctx = chartRef.current?.getContext('2d');
        if (ctx) {
            chartInstance.current = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: colors.slice(0, labels.length),
                        borderColor: colors.slice(0, labels.length),
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Penjualan Hari Ini per Kategori',
                            font: {
                                size: 16,
                                weight: 'bold'
                            }
                        },
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 20,
                                usePointStyle: true
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = context.parsed || 0;
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                                    return `${label}: Rp ${value.toLocaleString('id-ID')} (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            });
        }
    };

    // Prepare 7-day chart data
    const prepare7DayChartData = () => {
        if (!weeklyData.length) return null;

        return {
            labels: weeklyData.map(day => day.label),
            datasets: [
                {
                    label: 'Penjualan (Rp)',
                    data: weeklyData.map(day => day.sales),
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: 'rgb(59, 130, 246)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                }
            ]
        };
    };

    // Prepare 7-day transaction count chart data
    const prepare7DayTransactionData = () => {
        if (!weeklyData.length) return null;

        return {
            labels: weeklyData.map(day => day.label),
            datasets: [
                {
                    label: 'Jumlah Transaksi',
                    data: weeklyData.map(day => day.transactionCount),
                    backgroundColor: 'rgba(34, 197, 94, 0.8)',
                    borderColor: 'rgb(34, 197, 94)',
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                }
            ]
        };
    };

    // Chart options for 7-day charts
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 1,
                cornerRadius: 8,
                callbacks: {
                    label: function(context) {
                        if (context.dataset.label === 'Penjualan (Rp)') {
                            return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
                        }
                        return `${context.dataset.label}: ${context.parsed.y}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                },
                ticks: {
                    callback: function(value) {
                        if (this.chart.data.datasets[0].label === 'Penjualan (Rp)') {
                            return formatCurrency(value);
                        }
                        return value;
                    }
                }
            },
            x: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                }
            }
        }
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // Format time
    const formatTime = (transaction) => {
        return `${transaction.trans_hour}:${transaction.trans_minute}:${transaction.trans_second}`;
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([
                fetchTodayTransactions(),
                fetchCategories(),
                fetchMenus(),
                fetch7DaysSalesData()
            ]);
            setLoading(false);
        };

        loadData();
    }, []);

    useEffect(() => {
        if (!loading && transactions.length > 0) {
            createCategoryChart();
        }
    }, [transactions, categories, menus, loading]);

    // Cleanup chart on unmount
    useEffect(() => {
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-12">
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
                            <div className="h-4 bg-gray-300 rounded w-48 mx-auto"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                        <p className="text-red-600">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    const salesChartData = prepare7DayChartData();
    const transactionChartData = prepare7DayTransactionData();

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Penjualan Hari Ini</h1>
                            <p className="text-gray-600 mt-1">
                                {new Date().toLocaleDateString('id-ID', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Total Penjualan</p>
                            <p className="text-3xl font-bold text-green-600">
                                {formatCurrency(totalSales)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-full">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-500">Total Transaksi</p>
                                <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-full">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-500">Rata-rata per Transaksi</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatCurrency(transactions.length > 0 ? totalSales / transactions.length : 0)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-purple-100 rounded-full">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-500">Kategori Aktif</p>
                                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 7-Day Charts */}
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* 7-Day Sales Chart */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Penjualan 7 Hari Terakhir</h2>
                        <div className="h-80">
                            {salesChartData ? (
                                <Line data={salesChartData} options={chartOptions} />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <div className="animate-pulse">
                                        <div className="h-4 bg-gray-300 rounded w-48 mb-2"></div>
                                        <div className="h-4 bg-gray-300 rounded w-32"></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 7-Day Transaction Count Chart */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Jumlah Transaksi 7 Hari Terakhir</h2>
                        <div className="h-80">
                            {transactionChartData ? (
                                <Bar data={transactionChartData} options={chartOptions} />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <div className="animate-pulse">
                                        <div className="h-4 bg-gray-300 rounded w-48 mb-2"></div>
                                        <div className="h-4 bg-gray-300 rounded w-32"></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Chart and Transaction List */}
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Category Chart */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="h-96">
                            {transactions.length > 0 ? (
                                <canvas ref={chartRef}></canvas>
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center">
                                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                        <p className="text-gray-500">Belum ada transaksi hari ini</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Transaksi Terakhir</h2>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {transactions.length > 0 ? (
                                transactions.slice(-10).reverse().map((transaction, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">{transaction.cust_name}</p>
                                            <p className="text-sm text-gray-500">
                                                {formatTime(transaction)} • {transaction.order_menu?.length || 0} item
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-green-600">{formatCurrency(transaction.order_total)}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">Belum ada transaksi hari ini</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Detailed Transaction Table */}
                {transactions.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">Detail Transaksi</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Waktu
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Pelanggan
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Item
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {transactions.map((transaction, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatTime(transaction)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {transaction.cust_name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    ID: {transaction.id}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">
                                                    {transaction.order_menu?.map((item, itemIndex) => (
                                                        <div key={itemIndex} className="flex justify-between items-center">
                                                            <span>{item.nama}</span>
                                                            <span className="text-gray-500">x{item.jumlah}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                                {formatCurrency(transaction.order_total)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}