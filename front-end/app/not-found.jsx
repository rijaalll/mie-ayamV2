import Link from "next/link";

export const metadata = {
    title: "404",
    description: "Not Found",
    icons: {
        icon: "/images/web-logo-bg.JPG",
    }
}

export default function NotFoundApp() {
    return (
        <div className="w-full h-[100dvh]">
            <div className="w-full h-full flex justify-center items-center">
                <div className="flex flex-col w-auto h-auto items-center gap-3">
                    <p className="text-xl">Halaman tidak ditemukan</p>
                    <p>kembali ke 
                        <Link href={"/"}>
                            <span className="text-blue-700">&nbsp;Beranda</span>
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}