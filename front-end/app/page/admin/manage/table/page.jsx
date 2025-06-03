// front-end/app/page/admin/manage/table/page.jsx
import TableManagement from '@/src/section/admin/components/table'

export const metadata = {
    title: "Kelola Meja",
    description: "Halaman Kelola Meja",
    icons: {
        icon: "/images/web-logo-bg.JPG",
    }
}

export default function TableManagementPage() {
    return (
        <div>
            <TableManagement />
        </div>
    )
}