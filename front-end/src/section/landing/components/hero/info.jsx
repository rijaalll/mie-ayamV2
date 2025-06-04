import Image from "next/image";

import reactLogo from "@/public/logo/reactLogo.png";
import nextLogo from "@/public/logo/nextLogo.png";
import firebaseLogo from "@/public/logo/firebaseLogo.png";
import tailwindLogo from "@/public/logo/tailwindLogo.png";

const stackInfo = [
    { logoName: "React JS", logoSrc: reactLogo, Url: "https://react.dev/" },
    { logoName: "Next JS", logoSrc: nextLogo, Url: "https://nextjs.org/" },
    { logoName: "Firebase", logoSrc: firebaseLogo, Url: "https://firebase.google.com/" },
    { logoName: "Tailwind CSS", logoSrc: tailwindLogo, Url: "https://tailwindcss.com/" },
  ];

import infoJson from "@/src/info.json";

export const InfoElement = () => {
    const websiteInfo = infoJson;

    return (
        <div className="w-full h-auto flex justify-center">
            <div className="w-8/10 h-auto flex flex-col items-start gap-5">
                <div className="flex flex-col gap-2">
                    <div>
                        <p className="text-xl font-bold underline">Website info</p>
                    </div>
                    <div className="flex flex-col items-start">
                        <p>Nama: <span className="text-blue-700">{websiteInfo.website_info.name}</span></p>
                        <p>Versi: <span className="text-blue-700">{websiteInfo.website_info.version}</span></p>
                        <p>Deskripsi: <span className="text-blue-700">{websiteInfo.website_info.description}</span></p>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div>
                        <p className="text-xl font-bold underline">Stack info</p>
                    </div>
                    <div className="flex flex-col items-start gap-1">
                        {stackInfo.map((stack, index) => (
                            <div onClick={() => window.open(stack.Url, "_blank")} key={index} className="flex flex-row gap-2 items-center">
                                <div className="w-full max-w-[21px]">
                                    <Image src={stack.logoSrc} alt={stack.logoName} />
                                </div>
                                <p className="text-blue-700">{stack.logoName}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div>
                        <p className="text-xl font-bold underline">Developer info</p>
                    </div>
                    <div className="flex flex-col items-start gap-2">
                        {websiteInfo.developer_info.map((developer, index) => (
                            <div key={index} className="flex flex-col">
                                <p className="capitalize text-lg font-bold">{developer.name}</p>
                                <div className="flex flex-col items-start ml-3 gap-1">
                                    <button className="flex flex-row gap-1" onClick={() => window.open(developer.instagram, "_blank")}>
                                        <span className="bi bi-instagram"></span>
                                        <p className="text-blue-700 underline">Instagram</p>    
                                    </button>
                                    <button className="flex flex-row gap-1" onClick={() => window.open(developer.github, "_blank")}>
                                        <span className="bi bi-github"></span>
                                        <p className="underline text-blue-700">Github</p>
                                    </button>
                                </div>
                            </div>     
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}