import AuthPage from "@/src/section/auth"

export const metadata = {
    title: "Login",
    description: "Auth Page",
    icons: {
        icon: "/images/web-logo-bg.JPG",
    }
}

export const openGraph = {
    title: "Login",
    description: "Login Staff Mie Hoog",
    images: "/images/web-logo-bg.JPG",
}

export default function AuthApp() {
    return <AuthPage />
}