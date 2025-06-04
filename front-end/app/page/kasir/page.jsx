import ProtectedRoute from "@/src/components/protectRoute";
import KasirPage from "@/src/section/kasir";

export const metadata = {
    title: "Kasir",
    description: "Halaman Kasir",
    icons: {
        icon: "/images/web-logo-bg.JPG",
    }
}

export default function KasirApp() {
    return (
        <ProtectedRoute requiredLevel="kasir">
            <KasirPage />
        </ProtectedRoute>
    );
}