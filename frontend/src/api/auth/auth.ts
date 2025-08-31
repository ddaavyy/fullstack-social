import api from "@/api/axios";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "@/types/auth";

export const loginUser = async (
  payload: LoginRequest
): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>("login/", payload);
  return data;
};

export const registerUser = async (
  payload: RegisterRequest
): Promise<RegisterResponse> => {
  const { data } = await api.post<RegisterResponse>("register/", payload);
  return data;
};
