import Cookies from 'js-cookie';

export function clearAllClientCookies() {
  if (typeof document === 'undefined') return;

  const cookiesObj = Cookies.get() || {};
  const names = Object.keys(cookiesObj);

  if (!names.length) return;

  const host = window.location.hostname;
  const parts = host.split('.');

  const domains = [undefined];
  for (let i = 0; i <= parts.length - 2; i++) {
    domains.push('.' + parts.slice(i).join('.'));
  }

  const segs = window.location.pathname.split('/').filter(Boolean);
  const paths = ['/', undefined];
  for (let i = 0; i < segs.length; i++) {
    paths.push('/' + segs.slice(0, i + 1).join('/'));
  }

  for (const name of names) {
    try { Cookies.remove(name); } catch { }
    try { Cookies.remove(name, { path: '/' }); } catch { }

    for (const domain of domains) {
      for (const path of paths) {
        try {
          Cookies.remove(name, {
            ...(domain ? { domain } : {}),
            ...(path ? { path } : {}),
          });
        } catch { }
      }
    }
  }
}
