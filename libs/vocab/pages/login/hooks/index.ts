import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/core/components/base-toast/base-toast";
import { login } from "@/core/api/auth";
import { setAuthCookies } from "@/core/auth/authCookies";
import axios from "axios";
import { LoginRequestDto } from "@/core/api/auth/dtos";

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const locale = useParams().locale;
    const toast = useToast();

    const handleSubmit = async (body: LoginRequestDto) => {
        try {
            const data = await login(body);
            setAuthCookies({
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
                user: data.user,
            });
            toast.success("Đăng nhập thành công");
            router.push(`/${locale}/`);
            router.refresh();
        } catch (err) {
            let message = "Đăng nhập thất bại";
            if (axios.isAxiosError(err)) {
                const d = err.response?.data as { message?: string | string[] } | undefined;
                if (typeof d?.message === "string") message = d.message;
                else if (Array.isArray(d?.message)) message = d.message.join(", ");
            } else if (err instanceof Error) message = err.message;
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };
    return { handleSubmit, loading };
};
