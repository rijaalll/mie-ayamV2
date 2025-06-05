// app/order/[id]/page.js
import OrderPage from "@/src/section/order";

export default async function OrderApp({ params }) {
    const tableId = (await params).id; // ✅ await langsung params

    return (
        <div>
            <OrderPage tableId={tableId} />
        </div>
    );
}

export async function generateMetadata({ params }) {
    const tableId = (await params).id; // ✅ sama di sini

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    let tableNumber = tableId;

    try {
        const response = await fetch(`${API_URL}/table/${tableId}`, {
            cache: 'no-store'
        });

        if (response.ok) {
            const data = await response.json();
            if (data.table?.nomor) {
                tableNumber = data.table.nomor;
            }
        }
    } catch (error) {
        console.error("Error fetching metadata:", error);
    }

    return {
        title: `Meja ${tableNumber} - Mie Hoog Restaurant`,
        description: `Pesan makanan untuk meja nomor ${tableNumber} di Mie Hoog Restaurant`,
        icons: {
            icon: "/images/web-logo-bg.JPG"
        },
        openGraph: {
            title: `Meja ${tableNumber} - Mie Hoog Restaurant`,
            description: `Pesan makanan untuk meja nomor ${tableNumber}`,
            type: 'website',
        }
    };
}