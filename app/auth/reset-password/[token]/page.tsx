import { ForgotPassword } from "@/components/(auth)/forgot-password";

interface ResetPasswordPageProps {
    params: {
        token: string;
    };
}

export default function ResetPasswordPage({ params }: ResetPasswordPageProps) {
    return (
        <div className="min-h-screen items-center justify-center flex bg-slate-50">
            <ForgotPassword token={params.token} />
        </div>
    );
}
