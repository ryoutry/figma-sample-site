import { useEffect, useState } from "react";

export type News = { id: number; date: string; category: string; title: string };
export type Project = {
  id: number;
  title: string;
  location: string;
  category: string;
  year: number;
  image: string;
  summary: string;
};
export type Inquiry = {
  id: number;
  company: string;
  name: string;
  email: string;
  tel: string;
  category: string;
  message: string;
  created_at: string;
};

export class ApiError extends Error {
  constructor(
    public status: number,
    public errors: Record<string, string> = {},
    message = "通信に失敗しました。時間をおいて再度お試しください。",
  ) {
    super(message);
  }
}

export async function api<T>(path: string, init: { method?: string; body?: unknown } = {}) {
  const res = await fetch(`/api${path}`, {
    method: init.method ?? "GET",
    headers: init.body === undefined ? undefined : { "Content-Type": "application/json" },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    credentials: "same-origin",
  }).catch(() => {
    throw new ApiError(0);
  });
  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, data.errors, data.error);
  return data as T;
}

/** GET 用のフック。reload() で再取得する */
export function useApi<T>(path: string) {
  const [data, setData] = useState<T>();
  const [error, setError] = useState(false);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let active = true;
    setError(false);
    api<T>(path)
      .then((d) => active && setData(d))
      .catch(() => active && setError(true));
    return () => {
      active = false;
    };
  }, [path, version]);

  return { data, error, reload: () => setVersion((v) => v + 1) };
}

/** "2025-04-18" → "2025.04.18" */
export const formatDate = (date: string) => date.replace(/-/g, ".");
