import { getAccessToken, removeAccessToken, removeRefreshToken } from "@/stores/auth";
import type { IResponse } from "@/types/http/IResponse";
import axios, { type AxiosResponse } from "axios";
import { toast } from "vue3-toastify";

const baseURL: string = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const logout = () => {
  removeAccessToken();
  removeRefreshToken();
};

api.interceptors.response.use(
  (response) => {
    const body = response.data as IResponse<unknown>
    body.messages.forEach(message => {
      toast.info(message)
    })

    return response;
  },
  async (error) => {
    if (error.response) {
      const { status, data } = error.response as AxiosResponse<IResponse<unknown>>;

      if (data?.messages?.length) {
        data.messages.forEach((message) => {
          toast.error(message, {
            autoClose: 10_000
          });
        });
      }

      if (status === 401) {
        logout();
        if (!error.response.request?.responseURL?.includes('login')) {
          window.location.href = '/login?expired=true'
        }
      }
    } else {
      toast.warn("Erro de conexão. Não foi possível se conectar ao servidor.");
    }

    return Promise.reject(error);
  }
);

export default api
