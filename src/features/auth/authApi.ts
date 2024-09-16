import { instance } from "common/api";
import { BaseResponse, LoginParamsType } from "common/types";

export const authAPI = {
  login(payload: LoginParamsType) {
    return instance.post<BaseResponse<LoginGenericType>>("auth/login", payload).then((data) => data.data);
  },
  me() {
    return instance.get<BaseResponse<AuthMeResponseGeneric>>("auth/me").then((data) => data.data);
  },
  logout() {
    return instance.delete<BaseResponse>("auth/login").then((data) => data.data);
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
