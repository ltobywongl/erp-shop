"use client"

const langKey = {
    "zh": "繁中",
    "en": "English"
}

function LanguageSwitcher(params: Readonly<{ lang: keyof typeof langKey, className?: string }>) {
    return (
        <button className={params.className} onClick={() => {
            window.location.href = `/${params.lang}`;
        }}>
            {langKey[params.lang]}
        </button>
    );
}

export default LanguageSwitcher;
