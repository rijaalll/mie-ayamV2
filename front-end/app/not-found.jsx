import NotFoundPage from "@/src/section/not-found";

export const metadata = {
    title: "404",
    description: "Not Found",
    icons: {
        icon: "/images/web-logo-bg.JPG",
    }
}

export default function NotFoundApp() {
    return (
        <div className="w-full h-[100dvh]">
            <NotFoundPage /> 
        </div>
    );
}