import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const AUTH_COOKIE = "vocab_auth";

    // Bỏ qua API routes và static/public assets
    if (
        pathname.startsWith("/api/") ||
        pathname.startsWith("/_next/") ||
        pathname.startsWith("/files/") ||
        pathname.startsWith("/images/") ||
        pathname.startsWith("/animatedIcon/") ||
        pathname.startsWith("/locales/") ||
        pathname === "/favicon.ico"
    ) {
        return NextResponse.next();
    }

    // Lấy cookie 'lang' hiện tại
    const lang = request.cookies.get("lang")?.value;
    const localeFromCookie = lang === "en" ? "en" : "vi";

    // 1. Nếu URL đã có locale (/en/... hoặc /vi/...)
    if (pathname.startsWith("/en/") || pathname.startsWith("/vi/") || pathname === "/en" || pathname === "/vi") {
        const localeInPath = pathname.split("/")[1];
        const isLoginPage = pathname === `/${localeInPath}/login` || pathname === `/${localeInPath}/login/`;
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
            return NextResponse.redirect(new URL(`/${localeInPath}/login`, request.url));
        }

        // Đã đăng nhập mà vào login thì về dashboard
        if (hasAccessToken && isLoginPage) {
            return NextResponse.redirect(new URL(`/${localeInPath}`, request.url));
        }
        
        // Nếu locale trong URL khác với Cookie, cập nhật lại Cookie thay vì redirect!
        if (localeInPath !== lang) {
            const response = NextResponse.next();
            response.cookies.set("lang", localeInPath, { maxAge: 365 * 24 * 60 * 60 });
            return response;
        }
        return NextResponse.next();
    }

    // 2. Nếu là root path "/", redirect theo cookie
    if (pathname === "/") {
        return NextResponse.redirect(new URL(`/${localeFromCookie}`, request.url));
    }

    // 3. Với các path chưa có locale, thêm locale từ cookie vào đầu
    return NextResponse.redirect(new URL(`/${localeFromCookie}${pathname}`, request.url));
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|files|images).*)"],
};
