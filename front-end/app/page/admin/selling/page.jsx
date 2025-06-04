// app/order/[id]/page.js
import OrderPage from "@/src/section/selling";

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
            <SellingPage tableId={tableId} />
        </div>
    );
}