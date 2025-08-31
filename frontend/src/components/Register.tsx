import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { registerUser } from "@/api/auth/auth";
import type {
  RegisterProps,
  RegisterRequest,
  RegisterResponse,
} from "@/types/auth";
import { getAccessToken } from "@/types/auth";

export const Register: React.FC<RegisterProps> = ({
  getErr,
  labelClass,
  inputClass,
  btnPrimary,
  btnGhost,
  setTab,
}) => {
  const navigate = useNavigate();

  const { mutateAsync: doRegister, isPending: loadingRegister } = useMutation<
    RegisterResponse,
    unknown,
    RegisterRequest
  >({
    mutationFn: registerUser,
    onSuccess: (data) => {
      const token = getAccessToken(data);
      if (!token) {
        toast.error("Token não encontrado na resposta.");
        return;
      }
      Cookies.set("access_token", token, { expires: 1, sameSite: "lax" });
      navigate("/dashboard");
    },
    onError: (error) => toast.error("Erro ao registrar: " + getErr(error)),
  });

  const handleSubmitRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const username = (form.get("username") as string | null)?.trim();
    const email = (form.get("email") as string | null)?.trim();
    const password = (form.get("password") as string | null)?.toString();

    if (!username || !email || !password) {
      toast.warn("Preencha todos os campos.");
      return;
    }
    if (password.length < 6) {
      toast.warn("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    await doRegister({ username, email, password });
  };

  return (
    <form onSubmit={handleSubmitRegister} className="space-y-4">
      <div>
        <label htmlFor="username" className={labelClass}>
          Nome de usuário
        </label>
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
        <label htmlFor="email2" className={labelClass}>
          Email
        </label>
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
        <label htmlFor="password2" className={labelClass}>
          Senha
        </label>
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
    </form>
  );
};
