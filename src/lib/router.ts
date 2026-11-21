import { useEffect, useState } from 'react';

/** Hash-based routing so every page works on GitHub Pages (no server rewrites needed). */
const read = () => {
  const h = window.location.hash.replace(/^#/, '');
  return h === '' ? '/' : h;
};

export function useHashRoute(): [string, (path: string) => void] {
  const [path, setPath] = useState<string>(read);
  useEffect(() => {
    const onChange = () => {
      setPath(read());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  const go = (p: string) => {
    if (p === path) return;
    window.location.hash = p;
  };
  return [path, go];
}
