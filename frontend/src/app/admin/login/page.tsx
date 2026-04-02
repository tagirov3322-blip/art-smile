"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function AdminLogin() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.login(login, password);
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка входа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f9fb]">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl bg-white p-8 shadow-lg shadow-black/5">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-[#2a3250]">IQ Dental</h1>
            <p className="mt-2 text-sm text-gray-500">Вход в панель управления</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Логин</label>
              <input
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-[#f8f9fb] px-4 py-3 text-sm outline-none transition focus:border-[#2a3250] focus:ring-2 focus:ring-[#2a3250]/10"
                placeholder="admin"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-[#f8f9fb] px-4 py-3 text-sm outline-none transition focus:border-[#2a3250] focus:ring-2 focus:ring-[#2a3250]/10"
                placeholder="Пароль"
                required
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#2a3250] py-3 text-sm font-semibold text-white transition hover:bg-[#353d5c] disabled:opacity-50"
            >
              {loading ? "Вход..." : "Войти"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
