import { login } from "@/api/auth/login";
import { logout } from "@/api/auth/logout";
import { refresh } from "@/api/auth/refresh";
import { register } from "@/api/auth/register";
import { fetchUser } from "@/api/user/get-user";
import { updateUser } from "@/api/user/update-user";
import type { ILoginRequest } from "@/types/http/Auth";
import type { IRegisterUserRequest, IUpdateUserRequest } from "@/types/http/User";
import type { IUser } from "@/types/IUser";
import { LocalStorageUtil } from "@/util/LocalStorageUtil";
import { SessionStorageUtil } from "@/util/SessionStorageUtil";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";

export const getAccessToken = () => SessionStorageUtil.get('access_token');
export const setAccessToken = (token: string) => SessionStorageUtil.set('access_token', token);
export const removeAccessToken = () => SessionStorageUtil.remove('access_token');

export const getRefreshToken = () => LocalStorageUtil.get('refresh_token');
export const setRefreshToken = (token: string) => LocalStorageUtil.set('refresh_token', token);
export const removeRefreshToken = () => LocalStorageUtil.remove('refresh_token');

export const getExpiresAt = () => {
  const value = LocalStorageUtil.get('expires_at') || undefined
  if (!value) {
    return undefined
  }

  return new Date(value)
};

export const setExpiresAt = (expiresAt: Date | undefined) => {
  if (!expiresAt) {
    return;
  }

  LocalStorageUtil.set(
    'expires_at',
    new Date(expiresAt).toISOString()
  );
}

export const removeExpiresAt = () => LocalStorageUtil.remove('expires_at');

export const isAccessTokenExpired = () => {
  const expiresAt = getExpiresAt()
  if (!expiresAt) {
    return false
  }

  expiresAt.setMinutes(expiresAt.getMinutes() + 1)
  return expiresAt.getTime() < new Date().getTime()
}

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();

  const user = ref<IUser | undefined>(undefined);
  const isLoadingUser = ref(false);
  const isLoggedIn = () => {
    return !!getAccessToken()
  }

  const doLogin = async (credentials: ILoginRequest) => {
    const { data } = await login(credentials);
    setAccessToken(data.payload.accessToken);
    setRefreshToken(data.payload.refreshToken);
    setExpiresAt(new Date(data.payload.expiresAt));

    user.value = data.payload.user
    startTokenRefresh();
  };

  const localLogout = () => {
    removeAccessToken();
    removeRefreshToken();
    removeExpiresAt();

    user.value = undefined;

    router.push('/login');
  };

  const doLogout = async () => {
    await logout()
    localLogout()
  }

  const refreshAccessToken = async () => {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) return;

      const { data } = await refresh({ refreshToken });
      setAccessToken(data.payload.accessToken);
      setExpiresAt(new Date(data.payload.expiresAt));

      if (!user.value) {
        user.value = data.payload.user
      }
      startTokenRefresh()
    } catch {
      localLogout();
    }
  };

  let refreshTimeout: number | null = null;
  const startTokenRefresh = () => {
    if (refreshTimeout !== null) {
      clearTimeout(refreshTimeout);
    }

    const expiresAt = getExpiresAt();
    if (!expiresAt || !getRefreshToken()) return;
    const oneMinuteInMilliseconds = 60 * 1000
    const timeToRefresh = new Date(expiresAt).getTime()
      - new Date().getTime() - oneMinuteInMilliseconds;

    if (timeToRefresh > 0) {
      refreshTimeout = setTimeout(refreshAccessToken, timeToRefresh);
    } else {
      refreshAccessToken();
    }
  };

  const loadUser = async () => {
    isLoadingUser.value = true
    const { data } = await fetchUser();
    user.value = data.payload;
    isLoadingUser.value = false
  };

  if (getAccessToken() && !isAccessTokenExpired()) {
    loadUser()
  }

  if (isAccessTokenExpired() || !getAccessToken()) {
    refreshAccessToken()
  } else if (getRefreshToken() && getExpiresAt() && refreshTimeout === null) {
    startTokenRefresh()
  }

  const doUpdateUser = async (req: IUpdateUserRequest) => {
    try {
      isLoadingUser.value = true
      const { data } = await updateUser(req)
      user.value = data.payload
      toast.success("Dados atualizados com sucesso!")
      isLoadingUser.value = false
      return true
    } catch {
      isLoadingUser.value = false
      return false
    }
  }

  const doRegisterUser = async (req: IRegisterUserRequest) => {
    const { data } = await register(req)

    if (data.payload) {
      toast.info("Usuário cadastrado com sucesso")
    }
  }

  return { doLogin, doLogout, startTokenRefresh, isLoggedIn, refreshAccessToken, user, isLoadingUser, doUpdateUser, doRegisterUser };
});
