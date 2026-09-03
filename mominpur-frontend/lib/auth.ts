"use client";

const getToken = (): string => {
  try {
    const raw = sessionStorage.getItem("user") || localStorage.getItem("user");
    return JSON.parse(raw || "{}").token || "";
  } catch {
    return "";
  }
};

const authHeaders = (headers: Record<string, string> = {}): HeadersInit => {
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

const jsonHeaders = (): HeadersInit => authHeaders({ "Content-Type": "application/json" });

const isAuthenticated = (): boolean => Boolean(getToken());

export { getToken, authHeaders, jsonHeaders, isAuthenticated };
