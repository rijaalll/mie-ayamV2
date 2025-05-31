import AdminPage from "@/src/section/admin"

export const metadata = {
    title: "Admin",
    description: "Halaman Admin",
    icons: {
        icon: "/images/web-logo-bg.JPG",
    }
}

export default function AdminApp() {
    return (
        <div>
            <AdminPage />
        </div>
    )
}