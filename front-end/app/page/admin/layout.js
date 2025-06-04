"use client";

import { useState } from "react";
import { AdminSideNav, AdminMobileNav, AdminMobileMenu } from "@/src/section/admin/components/navbar";
import ProtectedRoute from "@/src/components/protectRoute";

export default function AdminLayout({ children }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <ProtectedRoute requiredLevel="admin">
            <div className="w-full h-auto min-h-[100dvh] sm:flex sm:flex-row">

                {/* ADMIN SIDEBAR DEKSTOP */}
                <div className="max-sm:hidden sm:fixed top-0 z-[10] left-0">
                    <AdminSideNav />
                </div>

                <div className="w-full flex justify-center">

                    {/* ADMIN MOBILE NAV */}
                    <div className="w-full sm:hidden fixed top-0 z-[10] left-0">
                        <AdminMobileNav setMobileMenuOpen={setMobileMenuOpen} />
                    </div>

                    {/* ADMIN MOBILE MENU */}
                    <div className={`${mobileMenuOpen ? "translate-x-0" : "-translate-x-[200%]"} sm:hidden fixed z-[11] left-0 px-5 w-[70%] h-full flex items-center bg-zinc-100/5 backdrop-blur-xs`}>
                        <div className="w-full h-[80dvh] bg-zinc-200 rounded-2xl">
                            <AdminMobileMenu setMobileMenuOpen={setMobileMenuOpen} />
                        </div>
                    </div>

                    {/* ADMIN PAGE */}
                    <div className="w-[90%] mt-[4rem] sm:w-[calc(100%-260px)] sm:ml-[260px]">
                        {children}
                    </div>

                </div>
            </div>
        </ProtectedRoute>
    );
}