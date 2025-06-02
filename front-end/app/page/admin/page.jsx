import AdminMainPage from "@/src/section/admin/components/main"

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
            <AdminMainPage />
        </div>
    )
}