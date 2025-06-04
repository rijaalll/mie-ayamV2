// front-end/src/section/landing/index.jsx
"use client";

import { LandingNavbar, LandingHero } from "./components";

export default function LandingPage() {
    return (
        <div className="w-full min-h-[100dvh] bg-gradient-to-br from-orange-50 via-white to-red-50">
            <LandingNavbar />
            <LandingHero />
        </div>
    );
}