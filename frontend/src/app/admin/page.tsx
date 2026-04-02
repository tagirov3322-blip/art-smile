"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";

interface Stats {
  totalBookings: number;
  newBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  todayBookings: number;
  totalDoctors: number;
  totalServices: number;
  totalReviews: number;
  pendingReviews: number;
  popularServices: { serviceName: string; count: number }[];
}

interface Booking {
  id: number;
  patientName: string;
  phone: string;
  date: string;
  time: string;
  status: string;
  doctor: { name: string };
  service: { name: string };
}

interface BookingsResponse {
  bookings: Booking[];
  total: number;
}

const STATUS_COLORS: Record<string, string> = {
  new: "#f59e0b",
  confirmed: "#3b82f6",
  completed: "#22c55e",
  cancelled: "#ef4444",
};

const STATUS_LABELS: Record<string, string> = {
  new: "Новые",
  confirmed: "Подтверждённые",
  completed: "Завершённые",
  cancelled: "Отменённые",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);

  useEffect(() => {
    api.get<Stats>("/stats").then(setStats).catch(console.error);
    api.get<BookingsResponse>("/bookings?limit=7").then((d) => setRecentBookings(d.bookings)).catch(console.error);
  }, []);

  if (!stats) return <div className="flex h-96 items-center justify-center text-gray-400">Загрузка...</div>;

  const statusData = [
    { name: "Новые", value: stats.newBookings },
    { name: "Подтв.", value: stats.confirmedBookings },
    { name: "Заверш.", value: stats.completedBookings },
    { name: "Отмен.", value: stats.cancelledBookings },
  ].filter((d) => d.value > 0);

  const pieColors = ["#f59e0b", "#3b82f6", "#22c55e", "#ef4444"];

  // Fake weekly trend (будет реальным когда будет больше данных)
  const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  const trendData = weekDays.map((day, i) => ({
    day,
    записи: i < 5 ? Math.max(0, stats.todayBookings + Math.floor(Math.random() * 3)) : 0,
  }));

  return (
    <div>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2a3250]">Дашборд</h1>
          <p className="mt-1 text-sm text-gray-400">Общая статистика клиники</p>
        </div>
        <div className="text-right text-xs text-gray-400">
          {new Date().toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </div>
      </div>

      {/* Верхняя строка — 4 блока с числами и мини-графиками */}
      <div className="grid grid-cols-4 gap-5">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Всего записей</p>
          <p className="mt-2 text-4xl font-bold text-[#2a3250]">{stats.totalBookings}</p>
          <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-400" />{stats.newBookings} новых</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-green-400" />{stats.completedBookings} завершённых</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Сегодня</p>
          <p className="mt-2 text-4xl font-bold text-[#2a3250]">{stats.todayBookings}</p>
          <div className="mt-2 h-12">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <Area type="monotone" dataKey="записи" stroke="#2a3250" fill="#2a3250" fillOpacity={0.1} strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Команда</p>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="text-4xl font-bold text-[#2a3250]">{stats.totalDoctors}</span>
            <span className="text-sm text-gray-400">врачей</span>
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
            <span>{stats.totalServices} услуг</span>
            <span>{stats.totalReviews} отзывов</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Отзывы</p>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="text-4xl font-bold text-[#2a3250]">{stats.totalReviews}</span>
          </div>
          <div className="mt-3 text-xs text-gray-400">
            {stats.pendingReviews > 0 ? (
              <span className="rounded-full bg-amber-50 px-2 py-0.5 font-medium text-amber-600">{stats.pendingReviews} на модерации</span>
            ) : (
              <span className="text-green-500">Всё проверено</span>
            )}
          </div>
        </div>
      </div>

      {/* Средняя строка — графики */}
      <div className="mt-6 grid grid-cols-3 gap-5">
        {/* Популярные услуги */}
        <div className="col-span-2 rounded-2xl bg-white p-6 shadow-sm">
          <p className="mb-5 text-xs font-medium uppercase tracking-wider text-gray-400">Популярные услуги</p>
          {stats.popularServices.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={stats.popularServices} layout="vertical" margin={{ left: 0, right: 20 }} style={{ backgroundColor: "transparent" }}>
                <XAxis type="number" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="serviceName" width={160} tick={{ fontSize: 12, fill: "#374151" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 8px 30px rgba(0,0,0,0.08)", fontSize: 13 }}
                  formatter={(value: number) => [`${value}`, "Записей"]}
                />
                <Bar dataKey="count" fill="#2a3250" radius={[0, 8, 8, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[280px] items-center justify-center text-sm text-gray-300">Нет данных</div>
          )}
        </div>

        {/* Статусы записей */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="mb-5 text-xs font-medium uppercase tracking-wider text-gray-400">Статусы записей</p>
          {statusData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" stroke="none">
                    {statusData.map((_, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 8px 30px rgba(0,0,0,0.08)", fontSize: 13 }} formatter={(value: number) => [`${value}`, "Записей"]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {statusData.map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-gray-600">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: pieColors[i] }} />
                      {d.name}
                    </span>
                    <span className="font-semibold text-[#2a3250]">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex h-[280px] items-center justify-center text-sm text-gray-300">Нет записей</div>
          )}
        </div>
      </div>

      {/* Последние записи */}
      <div className="mt-6 rounded-2xl bg-white shadow-sm">
        <div className="px-6 py-5">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Последние записи</p>
        </div>
        {recentBookings.length > 0 ? (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-y border-gray-100 text-[11px] uppercase tracking-wider text-gray-400">
                <th className="px-6 py-2.5 font-medium">Пациент</th>
                <th className="px-6 py-2.5 font-medium">Врач</th>
                <th className="px-6 py-2.5 font-medium">Услуга</th>
                <th className="px-6 py-2.5 font-medium">Дата / Время</th>
                <th className="px-6 py-2.5 font-medium">Статус</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b) => (
                <tr key={b.id} className="border-b border-gray-50 last:border-0 transition-colors hover:bg-gray-50/50">
                  <td className="px-6 py-3.5">
                    <div className="font-medium text-gray-900">{b.patientName}</div>
                    <div className="text-[11px] text-gray-400">{b.phone}</div>
                  </td>
                  <td className="px-6 py-3.5 text-gray-600">{b.doctor.name.split(" ").slice(0, 2).join(" ")}</td>
                  <td className="px-6 py-3.5 text-gray-600">{b.service.name}</td>
                  <td className="px-6 py-3.5 text-gray-600">{new Date(b.date).toLocaleDateString("ru-RU")} <span className="text-gray-400">{b.time}</span></td>
                  <td className="px-6 py-3.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{ backgroundColor: (STATUS_COLORS[b.status] || "#999") + "15", color: STATUS_COLORS[b.status] || "#666" }}>
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[b.status] || "#666" }} />
                      {STATUS_LABELS[b.status] || b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="px-6 pb-6 text-sm text-gray-300">Записей пока нет</div>
        )}
      </div>
    </div>
  );
}
