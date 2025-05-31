import { useState } from "react";
import Image from "next/image";
import { EmptyModal } from "@/src/components/modal";
import { InfoElement } from "./info";

import webIcon from "@/public/images/web-logo.png";

export default function LandingHero() {
    const [ isOpen, setIsOpen ] = useState(false);

    return (
        <div className="w-full h-[100dvh] flex flex-col">
            <div className="w-full basis-[95%] flex justify-center items-center p-4 mt-5">
                <div className="w-auto h-auto flex flex-col items-center gap-4 sm:flex-row sm:gap-5">

                    <div className="w-full max-w-[140px] sm:max-w-[160px] lg:max-w-[200px]">
                        <Image src={webIcon} alt="web-icon" />
                    </div>

                    <div className="w-full text-center flex flex-col gap-2 sm:text-start">
                        <p className="text-3xl sm:text-4xl">Mie Hoog</p>
                        <div>
                            <p className="text-lg tracking-wide">Bakso <span className="text-bold bg-red-300">HAMA</span></p>
                            <p className="text-lg tracking-wide">Mie Ayam <span className="text-bold underline bg-green-300">MABAR</span></p>
                        </div>
                    </div>

                </div>
            </div>
            <div className="w-full text-center mb-2">
                <button onClick={() => setIsOpen(true)}>
                    <p className="text-blue-500 font-bold">Info</p>
                </button>
            </div>
            {isOpen && (
                <EmptyModal children={<InfoElement />} setIsOpen={setIsOpen} />
            )}
        </div>
    );
}