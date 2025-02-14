"use client";

const langKey = {
  zh: "繁中",
  en: "English",
};

function LanguageSwitcher(
  params: Readonly<{ lang: keyof typeof langKey; className?: string }>
) {
  function switchLanguage(lang: keyof typeof langKey) {
    let url = window.location.pathname;
    if (Object.keys(langKey).includes(url.split("/")[1])) {
      const newUrl = url.split("/");
      newUrl[1] = lang;
      window.location.pathname = newUrl.join("/");
    } else {
      window.location.pathname = `/${langKey}`;
    }
  }

  return (
    <button
      className={params.className}
      onClick={() => switchLanguage(params.lang)}
    >
      {langKey[params.lang]}
    </button>
  );
}

export default LanguageSwitcher;
