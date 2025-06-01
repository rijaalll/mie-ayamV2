import AuthPage from "@/src/section/auth"

export const metadata = {
    title: "Auth",
    description: "Auth Page",
    icons: {
        icon: "/images/web-logo-bg.JPG",
    }
}

export default function AuthApp() {
    return <AuthPage />
}