"use client";

import { useState } from "react";
import { AdminSideNav, AdminMobileNav, AdminMobileMenu } from "@/src/section/admin/components/navbar";

export default function AdminLayout({ children }) {
    const [ mobileMenuOpen, setMobileMenuOpen ] = useState(false);

    return (
        <div className="w-full h-auto min-h-[100dvh] sm:flex sm:flex-row">

            {/* ADMIN SIDEBAR DEKSTOP */}
            <div className="max-sm:hidden">
                <AdminSideNav />
            </div>

            <div className="w-full flex justify-center">

                {/* ADMIN MOBILE NAV */}
                <div className="w-full sm:hidden fixed top-0 z-[10] left-0">
                    <AdminMobileNav setMobileMenuOpen={setMobileMenuOpen} />
                </div>

                {/* ADMIN MOBILE MENU */}
                <div className={`${mobileMenuOpen ? "translate-x-0" : "-translate-x-[200%]"} sm:hidden fixed z-[11] left-4 w-auto h-full flex items-center bg-zinc-100/5 backdrop-blur-xs`}>
                    <div className="w-auto h-[80dvh] bg-zinc-500">
                        <AdminMobileMenu setMobileMenuOpen={setMobileMenuOpen} />
                    </div>
                </div>

                {/* ADMIN PAGE */}
                <div className="w-[90%] mt-[4rem]">
                    {children}
                </div>

            </div>
        </div>
    );
}