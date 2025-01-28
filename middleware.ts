import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import acceptLanguage from "accept-language";
import { fallbackLang, languages, cookieName } from "./i18n/settings";

acceptLanguage.languages(languages);

export const config = {
  // matcher: '/:lang*'
  matcher: [
    "/((?!api|_next/static|_next/image|images|assets|favicon.ico|sw.js|site.webmanifest).*)",
  ],
};

export function middleware(req: NextRequest) {
  let lang;
  languages.forEach(language => {
    if (req.nextUrl.pathname.startsWith(`/${language}`)) {
      lang = language;
    }
  });
  if (!lang && req.cookies.has(cookieName)) {
    lang = acceptLanguage.get(req.cookies.get(cookieName)?.value);
  }
  if (!lang) lang = acceptLanguage.get(req.headers.get("Accept-Language"));
  if (!lang) lang = fallbackLang;

  // Redirect if lang in path is not supported
  if (
    !languages.some((loc) => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
    !req.nextUrl.pathname.startsWith("/_next")
  ) {
    return NextResponse.redirect(
      new URL(`/${lang}${req.nextUrl.pathname}`, req.url)
    );
  }

  const response = NextResponse.next();
  response.cookies.set(cookieName, lang, { sameSite: "strict" });
  return response;
}
