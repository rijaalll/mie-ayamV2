import Link from "next/link";

import { useLogin } from "@/src/utils/authContext";

export default function LandingNavbar() {
    const { login, name } = useLogin();

    return (
        <div className="w-full h-auto fixed top-0 left-0 z-50 flex justify-center py-4 bg-zinc-100/20 backdrop-blur-xs">
            <div className="w-[88%] h-auto flex flex-row justify-between items-center">
                <div className="w-auto ">
                    <p className="text-2xl">Mie Hoog</p>
                </div>
                <Link href="/auth" className="w-auto flex flex-row gap-2">
                    <span className="bi-person-circle text-lg text-black/60"></span>
                    <p className="text-lg">{login ? name : "login"}</p>
                </Link>  
            </div>
        </div>
    );
}