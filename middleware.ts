import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const AUTH_COOKIE = "vocab_auth";

    // 1. Chuyển hướng các URL cũ có /vi/ hoặc /en/ về URL sạch và lưu cookie lang
    if (pathname.startsWith("/en/") || pathname.startsWith("/vi/") || pathname === "/en" || pathname === "/vi") {
        const segments = pathname.split("/").filter(Boolean);
        const localeInPath = segments[0];
        const remaining = segments.slice(1).join("/");
        const targetPath = remaining ? `/${remaining}/` : "/";
        const response = NextResponse.redirect(new URL(targetPath, request.url));
        response.cookies.set("lang", localeInPath, { maxAge: 365 * 24 * 60 * 60, path: "/" });
        return response;
    }

    const isLoginPage = pathname === "/login" || pathname === "/login/";
    const authRaw = request.cookies.get(AUTH_COOKIE)?.value;
    let hasAccessToken = false;
    if (authRaw) {
        try {
            const auth = JSON.parse(authRaw) as { accessToken?: string };
            hasAccessToken = Boolean(auth.accessToken);
        } catch {
            hasAccessToken = false;
        }
    }

    // Chưa đăng nhập thì luôn về trang login (trừ chính trang login)
    if (!hasAccessToken && !isLoginPage) {
        return NextResponse.redirect(new URL("/login/", request.url));
    }

    // Đã đăng nhập mà vào login thì về dashboard
    if (hasAccessToken && isLoginPage) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|files|images|locales|animatedIcon).*)"],
};
