import LandingPage from "@/src/section/landing";

export const metadata = {
  title: "Mie Hoog",
  description: "order Mie Hoog disini",
  icons: {
    icon: "/images/web-logo-bg.JPG",
  },
};

export const openGraph = {
  title: "Mie Hoog",
  description: "website management Mie hoog",
  images: "/images/web-logo-bg.JPG",
};

export default function Home() {
  return (
    <>
      <LandingPage />
    </>
  );
}