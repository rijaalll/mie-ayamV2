'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/src/utils/authContext'

import NavData from '@/src/data/admin/adminNav.json'
import ManageData from '@/src/data/admin/manageNav.json'

export default function AdminMobileMenu({ setMobileMenuOpen }) {
  const pathname = usePathname()
  const { logout, name } = useAuth()
  const [showSubMenu, setShowSubMenu] = useState(false)

  const toggleSubMenu = () => {
    setShowSubMenu((prev) => !prev)
  }

  const handleLogout = () => {
    logout()
    window.location.href = '/auth'
  }

  return (
    <div className="w-full h-full bg-white shadow-lg flex flex-col rounded-2xl">
      {/* Header */}
      <div className="w-full flex flex-col-reverse justify-between items-center p-5 border-b border-gray-200">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="bi bi-person-gear text-blue-600 text-lg"></span>
          </div>
          <div>
            <h2 className="font-semibold text-gray-800">Admin Panel</h2>
            <p className="text-sm text-gray-600">
              {name ? `Welcome, ${name}` : 'Welcome, Admin'}
            </p>
          </div>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(false)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors self-end"
        >
          <span className="bi bi-x text-2xl text-gray-600"></span>
        </button>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 py-5 px-2 overflow-y-auto">
        <nav className="space-y-2">
          {NavData.map((item, index) =>
            item.sub ? (
              <div key={index} className="mb-2">
                <button
                  onClick={toggleSubMenu}
                  className="w-full flex items-center justify-between px-3 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
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
                        onClick={() => setMobileMenuOpen(false)}
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
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                  pathname === item.path
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setMobileMenuOpen(false)}
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
      <div className="p-5 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          <span className="bi bi-box-arrow-right text-lg"></span>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  )
}