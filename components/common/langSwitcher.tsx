"use client"

import { useRouter } from "next/navigation";

const langKey = {
    "zh-HK": "繁",
    "en": "Eng"
}

function LanguageSwitcher(params: { lang: keyof typeof langKey, className?: string }) {
    const router = useRouter();
    return (
        <button className={params.className} onClick={() => {
            router.push(`/${params.lang}`);
            window.location.reload();
        }}>
            {langKey[params.lang]}
        </button>
    );
}

export default LanguageSwitcher;
