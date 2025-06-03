import KasirManagement from '@/src/section/admin/components/kasir'

export const metadata = {
    title: "Kelola Kasir",
    description: "Halaman Kelola Kasir",
    icons: {
        icon: "/images/web-logo-bg.JPG",
    }
}

export default function KasirManagementPage() {
    return (
        <div>
            <KasirManagement />
        </div>
    )
}