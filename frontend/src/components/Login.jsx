import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

import api from "../api/axios";

const loginUser = async (loginData) => (await api.post("login/", loginData)).data;

export const Login = ({ labelClass, inputClass, btnPrimary, getErr }) => {
    const navigate = useNavigate();

    const { mutateAsync: doLogin, isLoading: loadingLogin } = useMutation(loginUser, {
        onSuccess: (data) => {
            const token = data?.token ?? data?.access ?? data?.access_token;
            if (!token) { toast.error("Token não encontrado na resposta."); return; }
            Cookies.set("access_token", token, { expires: 1, sameSite: "Lax" });
            navigate("/dashboard");
        },
        onError: (error) => toast.error("Erro ao entrar: " + getErr(error)),
    });

    const handleSubmitLogin = async (e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const email = form.get("email")?.toString().trim();
        const password = form.get("password")?.toString();
        const remember = form.get("remember") === "on";

        if (!email || !password) return toast.warn("Preencha email e senha.");
        const res = await doLogin({ email, password });

        const token = res?.token ?? res?.access ?? res?.access_token;
        if (remember && token) Cookies.set("access_token", token, { expires: 7, sameSite: "Lax" });
    };

    return (
        <form onSubmit={handleSubmitLogin} className="space-y-4">
            <div>
                <label htmlFor="email" className={labelClass}>Email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    className={inputClass}
                    placeholder="voce@email.com"
                    required
                />
            </div>
            <div>
                <label htmlFor="password" className={labelClass}>Senha</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    className={inputClass}
                    placeholder="••••••••"
                    required
                />
            </div>
            <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-2 select-none">
                    <input
                        type="checkbox"
                        name="remember"
                        className="size-4 accent-white/90"
                    />
                    <span className="text-white/70 text-sm">Lembrar-me</span>
                </label>
                <button
                    type="button"
                    onClick={() => toast.info("Fluxo de recuperação não implementado")}
                    className="text-white/80 hover:text-white text-sm underline underline-offset-4 decoration-white/30"
                >
                    Esqueci minha senha
                </button>
            </div>
            <button type="submit" className={btnPrimary} disabled={loadingLogin}>
                {loadingLogin ? "Entrando..." : "Entrar"}
            </button>
        </form>)
}