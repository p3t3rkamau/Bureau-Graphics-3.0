export const nowIso = () => new Date().toISOString();

export const generateId = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 10)}`;

export const formatKes = (value: number) =>
  new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(value);
