import { useLogin } from "@/src/utils/authContext";
import Image from "next/image";

import webIcon from "@/public/images/web-logo.png";
import reactLogo from "@/public/logo/reactLogo.png";
import nextLogo from "@/public/logo/nextLogo.png";
import firebaseLogo from "@/public/logo/firebaseLogo.png";
import tailwindLogo from "@/public/logo/tailwindLogo.png";

const logoList = [
    {logoName: 'react js', logoSrc: reactLogo},
    {logoName: 'next js', logoSrc: nextLogo},
    {logoName: 'firebase', logoSrc: firebaseLogo},
    {logoName: 'tailwind css', logoSrc: tailwindLogo},
]

export const LogoElement = ({logoName, logoSrc}) => {
    return (
        <div className="flex fle-row items-center gap-1">
            <div className="w-full max-w-[20px]">
                <Image src={logoSrc} alt={logoName} />
            </div>
            <p className="text-sm">{logoName}</p>
        </div>
    )
}

export default function LandingHero() {
    const { login, id, username, name, setLoginData, logout } = useLogin();

    const handleLogin = () => {
        setLoginData({
            login: true,
            username: 'putri123',
            name: 'Putri Ayu',
            password: '***',
            setLoginData,
        })
    };

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
            <div className="w-full text-center mb-1">
                <div className="w-auto flex flex-col text-center">
                    <p className="text-lg">using :</p>
                    <div className="flex flex-row gap-4 justify-center">
                        {logoList.map((logo, index) => (
                            <LogoElement key={index} logoName={logo.logoName} logoSrc={logo.logoSrc} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}