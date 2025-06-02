'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

import NavData from '@/src/data/admin/adminNav.json'
import ManageData from '@/src/data/admin/manageNav.json'

export default function AdminMobileMenu({ setMobileMenuOpen }) {
  const pathname = usePathname()
  const [showSubMenu, setShowSubMenu] = useState(false)

  const toggleSubMenu = () => {
    setShowSubMenu((prev) => !prev)
  }

  return (
    <div className="w-full flex flex-col gap-5 py-5 px-5">
      <div className="w-full flex justify-end">
        <button onClick={() => setMobileMenuOpen(false)}>
          <span className="bi bi-x text-2xl"></span>
        </button>
      </div>

      <div className="w-full flex flex-col gap-3 items-start px-1">
        {NavData.map((item, index) =>
          item.sub ? (
            <div key={index} className="w-full">
              <button
                onClick={toggleSubMenu}
                className="text-base flex items-center gap-2"
              >
                <span>{item.name}</span>
                <span className={`bi ${showSubMenu ? 'bi-caret-up-fill' : 'bi-caret-down-fill'}`}></span>
              </button>

              {showSubMenu && (
                <div className="ml-4 mt-2 flex flex-col gap-2">
                  {ManageData.map((subItem, subIndex) => (
                    <Link
                      key={subIndex}
                      href={subItem.path}
                      className={`text-sm ${
                        pathname === subItem.path ? 'text-blue-500' : ''
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Link
              key={index}
              href={item.path}
              className={`text-base ${
                pathname === item.path ? 'text-blue-500' : ''
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          )
        )}
      </div>
    </div>
  )
}
