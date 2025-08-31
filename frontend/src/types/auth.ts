export type GetErrFn = (error: unknown) => string;

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  access?: string;
  access_token?: string;
  refresh?: string;
  [key: string]: unknown;
}

export interface LoginProps {
  labelClass?: string;
  inputClass?: string;
  btnPrimary?: string;
  getErr: GetErrFn;
}

export const getAccessToken = (d: LoginResponse) =>
  d?.token ?? d?.access ?? d?.access_token ?? null;

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export type RegisterResponse = LoginResponse;

export interface RegisterProps {
  getErr: GetErrFn;
  labelClass?: string;
  inputClass?: string;
  btnPrimary?: string;
  btnGhost?: string;
  setTab: (tab: "login" | "register") => void;
}
