import { useEffect } from 'react';

const APP_NAME = 'Sancte Social';

export default function usePageTitle(title?: string) {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `${title} · ${APP_NAME}` : APP_NAME;
    return () => { document.title = prev; };
  }, [title]);
}
