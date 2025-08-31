import { useState } from "react";
import { isAxiosError } from "axios";

import { Login } from "./Login";
import { Register } from "./Register";

type ApiErrorPayload = { detail?: string; message?: string };

export default function AuthPage() {
  const [tab, setTab] = useState<"login" | "register">("login");

  const getErr = (err: unknown): string =>
    isAxiosError<ApiErrorPayload>(err)
      ? err.response?.data?.detail ??
        err.response?.data?.message ??
        err.message ??
        "Ocorreu um erro."
      : typeof err === "object" &&
        err &&
        "message" in err &&
        typeof (err).message === "string"
      ? (err as { message: string }).message
      : "Ocorreu um erro.";

  const inputClass =
    "w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/60 " +
    "outline-none ring-0 focus:border-white/40 focus:ring-4 focus:ring-white/20 transition";
  const labelClass = "text-white/90 text-sm";
  const btnPrimary =
    "w-full rounded-xl bg-white text-black font-medium py-3 transition hover:bg-white/90 active:scale-[.99]";
  const btnGhost =
    "w-full rounded-xl border border-white/20 text-white py-3 hover:bg-white/10 transition";

  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div
        className="
          w-full max-w-[420px] rounded-2xl border border-white/20
          bg-white/10 backdrop-blur-xl shadow-2xl p-6 sm:p-8
        "
      >
        <div className="text-center mb-6">
          <h1 className="text-white text-2xl font-semibold">Bem-vindo</h1>
          <p className="text-white/70 text-sm mt-1">
            {tab === "login" ? "Acesse sua conta" : "Crie sua conta"}
          </p>
        </div>

        <div className="bg-white/10 rounded-xl p-1 grid grid-cols-2 mb-6">
          <button
            className={`py-2 rounded-lg text-sm font-medium transition ${
              tab === "login"
                ? "bg-white text-black"
                : "text-white/80 hover:text-white"
            }`}
            onClick={() => setTab("login")}
            type="button"
          >
            Entrar
          </button>
          <button
            className={`py-2 rounded-lg text-sm font-medium transition ${
              tab === "register"
                ? "bg-white text-black"
                : "text-white/80 hover:text-white"
            }`}
            onClick={() => setTab("register")}
            type="button"
          >
            Registrar
          </button>
        </div>
        {tab === "login" ? (
          <Login
            labelClass={labelClass}
            inputClass={inputClass}
            btnPrimary={btnPrimary}
            getErr={getErr}
          />
        ) : (
          <Register
            labelClass={labelClass}
            getErr={getErr}
            inputClass={inputClass}
            btnPrimary={btnPrimary}
            btnGhost={btnGhost}
            setTab={setTab}
          />
        )}
        <p className="text-center text-white/60 text-xs mt-6">
          Ao continuar, você concorda com nossos Termos e Política de
          Privacidade.
        </p>
      </div>
    </div>
  );
}
