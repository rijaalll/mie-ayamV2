// front-end/app/page/admin/manage/menu/page.jsx
import MenuManagement from '@/src/section/admin/components/menu'

export const metadata = {
    title: "Kelola Menu",
    description: "Halaman Kelola Menu",
    icons: {
        icon: "/images/web-logo-bg.JPG",
    }
}

export default function MenuManagementPage() {
    return (
        <div>
            <MenuManagement />
        </div>
    )
}