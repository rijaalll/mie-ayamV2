// front-end/src/section/landing/components/hero/landingHero.jsx
import { useState } from "react";
import Image from "next/image";
import { EmptyModal } from "@/src/components/modal";
import { InfoElement } from "./info";

import webIcon from "@/public/images/web-logo.png";

export default function LandingHero() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="w-full min-h-[100dvh] flex flex-col bg-gradient-to-br from-orange-50 via-white to-red-50">
            <div className="w-full flex-1 flex justify-center items-center p-6 pt-24">
                <div className="w-full max-w-4xl h-auto flex flex-col items-center gap-8 sm:flex-row sm:gap-12">
                    
                    <div className="w-full max-w-[200px] sm:max-w-[240px] lg:max-w-[280px] drop-shadow-2xl">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
                            <Image 
                                src={webIcon} 
                                alt="web-icon" 
                                priority 
                                className="relative z-10 rounded-full shadow-2xl hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                    </div>

                    <div className="w-full text-center flex flex-col gap-6 sm:text-start">
                        <div className="space-y-2">
                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-orange-600 via-red-500 to-red-600 bg-clip-text text-transparent">
                                Mie Hoog
                            </h1>
                            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto sm:mx-0 rounded-full"></div>
                        </div>
                        
                        <div className="space-y-3">
                            <div className="flex items-center justify-center sm:justify-start gap-3 p-4 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-red-100">
                                <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                                <p className="text-xl font-semibold text-gray-800">
                                    Bakso <span className="px-3 py-1 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-full text-lg font-bold shadow-lg">HAMA</span>
                                </p>
                            </div>
                            
                            <div className="flex items-center justify-center sm:justify-start gap-3 p-4 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-green-100">
                                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                <p className="text-xl font-semibold text-gray-800">
                                    Mie Ayam <span className="px-3 py-1 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-full text-lg font-bold shadow-lg">MABAR</span>
                                </p>
                            </div>
                        </div>

                        <p className="text-lg text-gray-600 max-w-md mx-auto sm:mx-0 leading-relaxed">
                            Nikmati kelezatan mie dan bakso terbaik dengan cita rasa yang tak terlupakan
                        </p>
                    </div>
                </div>
            </div>
            
            <div className="w-full text-center pb-8">
                <button 
                    onClick={() => setIsOpen(true)}
                    className="group relative px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
                >
                    <span className="flex items-center gap-2">
                        <span className="bi bi-info-circle text-lg"></span>
                        <span>Info Website</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </button>
            </div>
            
            {isOpen && (
                <EmptyModal children={<InfoElement />} setIsOpen={setIsOpen} />
            )}
        </div>
    );
}