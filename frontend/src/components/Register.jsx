import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

import api from "../api/axios";

const registerUser = async (userData) => (await api.post("register/", userData)).data;

export const Register = ({ getErr, labelClass, inputClass, btnPrimary, btnGhost, setTab }) => {
    const navigate = useNavigate();

    const { mutateAsync: doRegister, isLoading: loadingRegister } = useMutation(registerUser, {
        onSuccess: (data) => {
            const token = data?.token ?? data?.access ?? data?.access_token;
            if (!token) { toast.error("Token não encontrado na resposta."); return; }
            Cookies.set("access_token", token, { expires: 1, sameSite: "Lax" });
            navigate("/dashboard");
        },
        onError: (error) => toast.error("Erro ao registrar: " + getErr(error)),
    });

    const handleSubmitRegister = async (e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const username = form.get("username")?.toString().trim();
        const email = form.get("email")?.toString().trim();
        const password = form.get("password")?.toString();

        if (!username || !email || !password) return toast.warn("Preencha todos os campos.");
        if (password.length < 6) return toast.warn("A senha deve ter pelo menos 6 caracteres.");
        await doRegister({ username, email, password });
    };

    return (
        <form onSubmit={handleSubmitRegister} className="space-y-4">
            <div>
                <label htmlFor="username" className={labelClass}>Nome de usuário</label>
                <input
                    id="username"
                    name="username"
                    type="text"
                    className={inputClass}
                    placeholder="seu_usuario"
                    required
                />
            </div>
            <div>
                <label htmlFor="email2" className={labelClass}>Email</label>
                <input
                    id="email2"
                    name="email"
                    type="email"
                    className={inputClass}
                    placeholder="voce@email.com"
                    required
                />
            </div>
            <div>
                <label htmlFor="password2" className={labelClass}>Senha</label>
                <input
                    id="password2"
                    name="password"
                    type="password"
                    className={inputClass}
                    placeholder="mínimo 6 caracteres"
                    required
                />
            </div>
            <button type="submit" className={btnPrimary} disabled={loadingRegister}>
                {loadingRegister ? "Criando conta..." : "Criar conta"}
            </button>
            <button
                type="button"
                className={btnGhost}
                onClick={() => setTab("login")}
            >
                Já possui conta? Entrar
            </button>
        </form>)
}