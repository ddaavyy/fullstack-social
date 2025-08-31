import Cookies from 'js-cookie';

export function clearAuthCookies() {
  try { Cookies.remove('access_token', { path: '/' }); } catch {}
  try { Cookies.remove('refresh_token', { path: '/' }); } catch {}
  try { Cookies.remove('access_token'); } catch {}
  try { Cookies.remove('refresh_token'); } catch {}
}
