import OrderPage from "@/src/section/order";

export default function OrderApp({ params }) {
    const tableId = params.id;

    return (
        <div>
            <OrderPage tableId={tableId} />
        </div>
    );
}

export async function generateMetadata({ params }) {
    const tableId = params.id;

    return {
        title: `Meja ${tableId}`,
        description: `Pesan untuk nomor meja ${tableId}`,
        icons: {
            icon: "/images/web-logo-bg.JPG"
        }
    };
}