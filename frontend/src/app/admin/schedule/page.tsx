"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  schedule: Record<string, { start: string; end: string }> | null;
}

const DAYS = [
  { key: "monday", label: "Понедельник" },
  { key: "tuesday", label: "Вторник" },
  { key: "wednesday", label: "Среда" },
  { key: "thursday", label: "Четверг" },
  { key: "friday", label: "Пятница" },
  { key: "saturday", label: "Суббота" },
  { key: "sunday", label: "Воскресенье" },
];

const HOURS = Array.from({ length: 15 }, (_, i) => {
  const h = i + 7;
  return `${String(h).padStart(2, "0")}:00`;
});

function getMonday(d: Date): Date {
  const date = new Date(d);
  const dow = date.getDay();
  date.setDate(date.getDate() - ((dow + 6) % 7));
  date.setHours(0, 0, 0, 0);
  return date;
}

function formatWeekStart(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatWeekRange(monday: Date): string {
  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 6);
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  return `${monday.toLocaleDateString("ru-RU", opts)} — ${sunday.toLocaleDateString("ru-RU", opts)} ${sunday.getFullYear()}`;
}

function getWeekDayDate(monday: Date, dayIndex: number): string {
  const d = new Date(monday);
  d.setDate(d.getDate() + dayIndex);
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}

export default function AdminSchedule() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [schedule, setSchedule] = useState<Record<string, { start: string; end: string; enabled: boolean }>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [currentMonday, setCurrentMonday] = useState<Date>(() => getMonday(new Date()));
  const [isCustom, setIsCustom] = useState(false);

  useEffect(() => {
    api.get<Doctor[]>("/doctors?active=false").then((data) => {
      setDoctors(data);
      if (data.length > 0) setSelectedId(data[0].id);
    }).catch(console.error);
  }, []);

  const loadWeekSchedule = useCallback(async (doctorId: number, monday: Date) => {
    setSaved(false);
    const weekStart = formatWeekStart(monday);
    try {
      const data = await api.get<{ schedule: Record<string, { start: string; end: string }> | null; isCustom: boolean }>(
        `/doctors/${doctorId}/week-schedule?weekStart=${weekStart}`
      );
      const s: Record<string, { start: string; end: string; enabled: boolean }> = {};
      DAYS.forEach((d) => {
        const existing = data.schedule?.[d.key];
        s[d.key] = existing
          ? { start: existing.start, end: existing.end, enabled: true }
          : { start: "09:00", end: "18:00", enabled: false };
      });
      setSchedule(s);
      setIsCustom(data.isCustom);
    } catch {
      // Fallback to doctor default
      const doc = doctors.find((d) => d.id === doctorId);
      const s: Record<string, { start: string; end: string; enabled: boolean }> = {};
      DAYS.forEach((d) => {
        const existing = doc?.schedule?.[d.key];
        s[d.key] = existing
          ? { start: existing.start, end: existing.end, enabled: true }
          : { start: "09:00", end: "18:00", enabled: false };
      });
      setSchedule(s);
      setIsCustom(false);
    }
  }, [doctors]);

  useEffect(() => {
    if (selectedId) loadWeekSchedule(selectedId, currentMonday);
  }, [selectedId, currentMonday, loadWeekSchedule]);

  const prevWeek = () => {
    setCurrentMonday((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 7);
      return d;
    });
  };

  const nextWeek = () => {
    setCurrentMonday((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7);
      return d;
    });
  };

  const goToCurrentWeek = () => {
    setCurrentMonday(getMonday(new Date()));
  };

  const toggleDay = (key: string) => {
    setSchedule((prev) => ({
      ...prev,
      [key]: { ...prev[key], enabled: !prev[key].enabled },
    }));
  };

  const updateTime = (key: string, field: "start" | "end", value: string) => {
    setSchedule((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  };

  const save = async () => {
    if (!selectedId) return;
    setSaving(true);
    const scheduleData: Record<string, { start: string; end: string }> = {};
    DAYS.forEach((d) => {
      if (schedule[d.key]?.enabled) {
        scheduleData[d.key] = { start: schedule[d.key].start, end: schedule[d.key].end };
      }
    });
    try {
      await api.put(`/doctors/${selectedId}/week-schedule`, {
        weekStart: formatWeekStart(currentMonday),
        schedule: scheduleData,
      });
      setSaved(true);
      setIsCustom(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Ошибка сохранения");
    }
    setSaving(false);
  };

  const resetToDefault = async () => {
    if (!selectedId) return;
    try {
      await api.delete(`/doctors/${selectedId}/week-schedule?weekStart=${formatWeekStart(currentMonday)}`);
      await loadWeekSchedule(selectedId, currentMonday);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Ошибка сброса");
    }
  };

  const selected = doctors.find((d) => d.id === selectedId);
  const isCurrentWeek = formatWeekStart(currentMonday) === formatWeekStart(getMonday(new Date()));

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">График работы</h1>
      <p className="mt-1 text-sm text-muted-foreground">Настройте расписание для каждого врача по неделям</p>

      <div className="mt-6 grid grid-cols-1 items-stretch gap-4 lg:grid-cols-3 lg:gap-6">
        <div className="flex flex-row gap-2 overflow-x-auto pb-2 lg:flex-col lg:justify-between lg:overflow-visible lg:pb-0">
          {doctors.map((doc) => (
            <button
              key={doc.id}
              onClick={() => setSelectedId(doc.id)}
              className={`w-full shrink-0 rounded-xl px-4 py-3 text-left transition-all duration-200 lg:px-5 lg:py-5 ${
                selectedId === doc.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card text-foreground hover:bg-accent"
              }`}
            >
              <p className="text-lg font-semibold">{doc.name.split(" ").slice(0, 2).join(" ")}</p>
              <p className={`mt-1 text-sm ${selectedId === doc.id ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{doc.specialty}</p>
            </button>
          ))}
        </div>

        {selected && (
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground">{selected.name}</h2>
              <p className="text-sm text-muted-foreground">{selected.specialty}</p>

              {/* Week navigation */}
              <div className="mt-5 flex items-center gap-3">
                <button onClick={prevWeek} className="rounded-lg border border-border p-2 transition hover:bg-accent">
                  <ChevronLeft className="h-4 w-4 text-foreground" />
                </button>
                <div className="flex-1 text-center">
                  <p className="text-sm font-semibold text-foreground">{formatWeekRange(currentMonday)}</p>
                  {isCustom && (
                    <span className="text-xs text-primary">Индивидуальное расписание</span>
                  )}
                  {!isCustom && (
                    <span className="text-xs text-muted-foreground">Стандартный график</span>
                  )}
                </div>
                <button onClick={nextWeek} className="rounded-lg border border-border p-2 transition hover:bg-accent">
                  <ChevronRight className="h-4 w-4 text-foreground" />
                </button>
              </div>

              {!isCurrentWeek && (
                <button onClick={goToCurrentWeek} className="mt-2 w-full text-center text-xs text-primary hover:underline">
                  К текущей неделе
                </button>
              )}

              <div className="mt-5 space-y-3">
                {DAYS.map((day, i) => {
                  const s = schedule[day.key];
                  if (!s) return null;
                  return (
                    <div key={day.key} className={`flex items-center gap-4 rounded-xl px-4 py-4 transition-colors ${s.enabled ? "bg-green-50 dark:bg-green-950/30" : "bg-muted"}`}>
                      <button
                        onClick={() => toggleDay(day.key)}
                        className={`h-5 w-5 shrink-0 rounded border-2 transition-colors ${s.enabled ? "border-green-500 bg-green-500" : "border-muted-foreground/30 bg-card"}`}
                      >
                        {s.enabled && <svg className="h-full w-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                      </button>

                      <div className="w-28">
                        <span className={`text-sm font-medium ${s.enabled ? "text-foreground" : "text-muted-foreground"}`}>{day.label}</span>
                        <span className="block text-xs text-muted-foreground">{getWeekDayDate(currentMonday, i)}</span>
                      </div>

                      {s.enabled ? (
                        <div className="flex items-center gap-2">
                          <select value={s.start} onChange={(e) => updateTime(day.key, "start", e.target.value)}
                            className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary">
                            {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
                          </select>
                          <span className="text-muted-foreground">—</span>
                          <select value={s.end} onChange={(e) => updateTime(day.key, "end", e.target.value)}
                            className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary">
                            {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
                          </select>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Выходной</span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button onClick={save} disabled={saving}
                  className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50">
                  {saving ? "Сохранение..." : saved ? "Сохранено!" : "Сохранить график"}
                </button>
                {isCustom && (
                  <button onClick={resetToDefault}
                    className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground">
                    Сбросить к стандартному
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
