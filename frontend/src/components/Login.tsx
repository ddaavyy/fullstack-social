import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { loginUser } from "@/api/auth/auth";
import type { LoginProps, LoginRequest, LoginResponse } from "@/types/auth";
import { getAccessToken } from "@/types/auth";

export const Login: React.FC<LoginProps> = ({
  labelClass,
  inputClass,
  btnPrimary,
  getErr,
}) => {
  const navigate = useNavigate();

  const { mutateAsync: doLogin, isPending } = useMutation<
    LoginResponse,
    unknown,
    LoginRequest
  >({
    mutationFn: loginUser,
    onSuccess: (data: LoginResponse) => {
      const token = getAccessToken(data);
      if (!token) {
        toast.error("Token não encontrado na resposta.");
        return;
      }
      Cookies.set("access_token", token, { expires: 1, sameSite: "lax" });
      if (data?.refresh) {
        Cookies.set("refresh_token", data.refresh, { sameSite: "lax" });
      }
      navigate("/dashboard");
    },
    onError: (error: unknown) =>
      toast.error("Erro ao entrar: " + getErr(error)),
  });

  const handleSubmitLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = (form.get("email") as string | null)?.trim();
    const password = (form.get("password") as string | null)?.toString();
    const remember = form.get("remember") === "on";

    if (!email || !password) {
      toast.warn("Preencha email e senha.");
      return;
    }

    const res: LoginResponse = await doLogin({ email, password }); // <- opcional: anotar aqui também

    const token = getAccessToken(res);
    if (remember && token) {
      Cookies.set("access_token", token, { expires: 7, sameSite: "lax" });
    }
  };
  return (
    <form onSubmit={handleSubmitLogin} className="space-y-4">
      <div>
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
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
        <label htmlFor="password" className={labelClass}>
          Senha
        </label>
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

      <button type="submit" className={btnPrimary} disabled={isPending}>
        {isPending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
};
