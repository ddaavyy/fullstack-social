import axios from "axios";
import Cookies from "js-cookie";

export const apiNoAuth = axios.create({ baseURL: "http://127.0.0.1:8000/api/", });

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

api.interceptors.request.use((config) => {
  const access = Cookies.get('access_token');
  if (access) config.headers.Authorization = `Bearer ${access}`;
  return config;
});

let refreshingPromise: Promise<string> | null = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { response, config } = error;
    if (!response) throw error;

    if (response.status !== 401 || config._retry) throw error;

    const refresh = Cookies.get('refresh_token');
    if (!refresh) throw error;

    try {
      if (!refreshingPromise) {
        refreshingPromise = apiNoAuth
          .post('token/refresh/', { refresh })
          .then(({ data }) => {
            Cookies.set('access_token', data.access, { sameSite: 'lax' });
            if (data.refresh) {
              Cookies.set('refresh_token', data.refresh, { sameSite: 'lax' });
            }
            return data.access;
          })
          .finally(() => {
            refreshingPromise = null;
          });
      }

      const newAccess = await refreshingPromise;

      config._retry = true;
      config.headers.Authorization = `Bearer ${newAccess}`;
      return api(config);
    } catch (e) {
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');

      console.error(e)
      throw error;
    }
  }
);


export default api;
