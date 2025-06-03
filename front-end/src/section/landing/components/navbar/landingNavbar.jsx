import Link from "next/link";
import { useEffect } from "react";

import { useAuth } from "@/src/utils/authContext";
import { loginUser } from "@/src/utils/api/auth/authHandle";

export default function LandingNavbar() {
    const { login, setLoginData, name, level, logout } = useAuth();

    useEffect(() => {
        checkExistingSession();
      }, []);
    
      const checkExistingSession = () => {
        const savedUsername = localStorage.getItem("userUsername");
        const savedPassword = localStorage.getItem("userPassword");
    
        if (savedUsername && savedPassword) {
          handleAutoLogin(savedUsername, savedPassword);
        }
      };
    
      const handleAutoLogin = async (username, password) => {
        try {
          const data = await loginUser({ username, password });
    
          setLoginData({
            login: true,
            id: data.user.id,
            username: data.user.username,
            name: data.user.name,
            level: data.user.level,
            password,
          });
        } catch (error) {
          console.error("Auto login error:", error);
          localStorage.removeItem("userUsername");
          localStorage.removeItem("userPassword");
        }
      };

      const HandleLogout = () => {
        logout();
        localStorage.removeItem("userUsername");
        localStorage.removeItem("userPassword");
      }

    return (
        <div className="w-full h-auto fixed top-0 left-0 z-50 flex justify-center py-4 bg-zinc-100/20 backdrop-blur-xs">
            <div className="w-[88%] h-auto flex flex-row justify-between items-center">
                <div className="w-auto ">
                    <p className="text-2xl">Mie Hoog</p>
                </div>
                {login ? (
                    <button onClick={HandleLogout} className="flex flex-row gap-1 items-center will-change-transform hover:scale-110 active:scale-95">
                        <span className="text-base">{name}</span>
                        <span className="bi bi-gear text-base"></span>
                    </button>
                ) : (
                    <Link href="/auth" className="w-auto flex flex-row gap-2">
                        <span className="bi-person-circle text-lg text-black/60"></span>
                        <p className="text-lg">login</p>
                    </Link>  
                )}
            </div>
        </div>
    );
}