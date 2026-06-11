const base = import.meta.env.BASE_URL;

export function withBase(path: string): string {
  if (path === '/' || path === '') return base;
  const normalized = path.startsWith('/') ? path.slice(1) : path;
  return `${base}${normalized}`;
}
