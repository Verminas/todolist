import { instance } from "common/api";
import { LoginParamsType } from "common/types";
import { ResponseType } from "../TodolistsList/todolistsApi";

export const authAPI = {
  login(payload: LoginParamsType) {
    return instance.post<ResponseType<LoginGenericType>>("auth/login", payload).then((data) => data.data);
  },
  me() {
    return instance.get<ResponseType<AuthMeResponseGeneric>>("auth/me").then((data) => data.data);
  },
  logout() {
    return instance.delete<ResponseType>("auth/login").then((data) => data.data);
  },
};

type LoginGenericType = {
  userId: number;
};
type AuthMeResponseGeneric = {
  id: number;
  email: string;
  login: string;
};
