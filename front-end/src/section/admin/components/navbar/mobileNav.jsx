export default function AdminMobileNav({ setMobileMenuOpen }) {
    return (
        <div className="w-full h-auto flex flex-row gap-3 justify-start items-center py-4 px-5 bg-zinc-100/40 backdrop-blur-xs">
            <div>
                <button onClick={() => setMobileMenuOpen(true)}>
                    <span className="bi bi-list text-2xl"></span>
                </button>
            </div>
            <div>
                <p className="text-xl">Admin</p>
            </div>
        </div>
    );
}