"use client";

import { LandingNavbar, LandingHero } from "./components";

export default function LandingPage() {
    return (
        <div className="w-full h-auto min-h-[100dvh]">
            <LandingNavbar />
            <LandingHero />
        </div>
    );
}