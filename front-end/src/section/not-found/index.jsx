"use client";

export default function NotFoundPage() {
    return (
        <div className="w-full h-full flex justify-center items-center">
                <div className="flex flex-col w-auto h-auto items-center gap-3">
                    <p className="text-xl">Halaman tidak ditemukan</p>
                    <p>ke halaman 
                        <button onClick={() => window.history.back()}>
                            <span className="text-blue-700">&nbsp;sebelumnya</span>
                        </button>
                    </p>
                </div>
            </div>
    );
}