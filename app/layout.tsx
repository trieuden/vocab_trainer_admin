import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import ClientProviders from "./ClientProviders";
import MainLayout from "../libs/vocab/layout/MainLayout";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Vocab Trainer Admin",
    description: "Vocab Trainer Admin Dashboard",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const lang = cookieStore.get("lang")?.value || "vi";

    return (
        <html lang={lang}>
            <body className={inter.className}>
                <ClientProviders>
                    <MainLayout>{children}</MainLayout>
                </ClientProviders>
            </body>
        </html>
    );
}
