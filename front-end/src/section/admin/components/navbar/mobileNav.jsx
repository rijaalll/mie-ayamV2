import { useAuth } from '@/src/utils/authContext'

export default function AdminMobileNav({ setMobileMenuOpen }) {
    const { name } = useAuth()

    return (
        <div className="w-full h-auto flex flex-row gap-3 justify-between items-center py-4 px-5 bg-zinc-100/40 backdrop-blur-xs">
            <div className="flex items-center gap-3">
                <button onClick={() => setMobileMenuOpen(true)}>
                    <span className="bi bi-list text-2xl"></span>
                </button>
                <div>
                    <p className="text-xl font-semibold">Admin</p>
                    <p className="text-sm text-gray-600">
                        {name ? `Hi, ${name}` : 'Welcome'}
                    </p>
                </div>
            </div>
        </div>
    );
}