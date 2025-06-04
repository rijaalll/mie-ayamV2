// app/order/[id]/page.js
import SellingPage from "@/src/section/admin/components/selling";

export const metadata = {
    title: "Penjualan",
    description: "Halaman Penjualan",
    icons: {
        icon: "/images/web-logo-bg.JPG",
    }
}

export default async function SellingApp() {
// ✅ await langsung params

    return (
        <div>
            <SellingPage />
        </div>
    );
}