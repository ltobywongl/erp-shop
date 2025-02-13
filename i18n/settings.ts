export const fallbackLang = "zh-Hk";
export const languages = [fallbackLang, "en"];
export const defaultNS = "translation";
export const cookieName = "i18next";

export function getOptions(lng = fallbackLang, ns = defaultNS) {
  return {
    // debug: true,
    supportedLngs: languages,
    fallbackLang,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  };
}
