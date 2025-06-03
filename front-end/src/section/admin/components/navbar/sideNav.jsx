// front-end/src/section/admin/components/navbar/sideNav.jsx
'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useLogin } from '@/src/utils/authContext'

import NavData from '@/src/data/admin/adminNav.json'
import ManageData from '@/src/data/admin/manageNav.json'

export default function AdminSideNav() {
    const pathname = usePathname()
    const { logout, name } = useLogin()
    const [ showSubMenu, setShowSubMenu ] = useState(true)

    const toggleSubMenu = () => {
        setShowSubMenu((prev) => !prev)
    }

    const handleLogout = () => {
        logout()
        window.location.href = '/page/auth/login'
    }

    return (
        <div className="w-64 h-screen bg-white shadow-lg border-r border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="bi bi-person-gear text-blue-600 text-lg"></span>
                    </div>
                    <div>
                        <h2 className="font-semibold text-gray-800">Admin Panel</h2>
                        <p className="text-sm text-gray-600">{name}</p>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <div className="flex-1 py-6">
                <nav className="px-4 space-y-2">
                    {NavData.map((item, index) =>
                        item.sub ? (
                            <div key={index} className="mb-2">
                                <button
                                    onClick={toggleSubMenu}
                                    className="w-full flex items-center justify-between px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="bi bi-folder text-lg"></span>
                                        <span className="font-medium">{item.name}</span>
                                    </div>
                                    <span className={`bi ${showSubMenu ? 'bi-caret-up-fill' : 'bi-caret-down-fill'} text-sm`}></span>
                                </button>

                                {showSubMenu && (
                                    <div className="ml-6 mt-2 space-y-1">
                                        {ManageData.map((subItem, subIndex) => (
                                            <Link
                                                key={subIndex}
                                                href={subItem.path}
                                                className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                                                    pathname === subItem.path 
                                                        ? 'bg-blue-100 text-blue-700' 
                                                        : 'text-gray-600 hover:bg-gray-100'
                                                }`}
                                            >
                                                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                                                <span className="capitalize">{subItem.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                key={index}
                                href={item.path}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                                    pathname === item.path 
                                        ? 'bg-blue-100 text-blue-700' 
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <span className={`bi ${
                                    item.name === 'Dashboard' ? 'bi-speedometer2' : 
                                    item.name === 'Selling' ? 'bi-graph-up' : 'bi-house'
                                } text-lg`}></span>
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        )
                    )}
                </nav>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                    <span className="bi bi-box-arrow-right text-lg"></span>
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    )
}