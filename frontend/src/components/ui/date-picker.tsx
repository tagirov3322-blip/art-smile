"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const MONTH_NAMES = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

const DAY_NAMES = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function parseDate(s: string): Date | null {
  if (!s) return null;
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function formatDisplay(s: string): string {
  if (!s) return "";
  const [y, m, d] = s.split("-");
  return `${d}.${m}.${y}`;
}

function toYMD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  min?: string;
  className?: string;
  placeholder?: string;
}

export function DatePicker({
  value,
  onChange,
  min,
  className,
  placeholder = "Выберите дату",
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(() => {
    const d = parseDate(value);
    return d ? d.getFullYear() : new Date().getFullYear();
  });
  const [viewMonth, setViewMonth] = useState(() => {
    const d = parseDate(value);
    return d ? d.getMonth() : new Date().getMonth();
  });

  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Sync view when value changes externally
  useEffect(() => {
    const d = parseDate(value);
    if (d) {
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
    }
  }, [value]);

  const minDate = min ? parseDate(min) : null;
  const today = new Date();

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // Build calendar grid
  const firstDay = new Date(viewYear, viewMonth, 1);
  // Monday-based: 0=Mon ... 6=Sun
  const startWeekday = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  // Pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null);

  const selectedDate = parseDate(value);

  function selectDay(day: number) {
    const d = new Date(viewYear, viewMonth, day);
    onChange(toYMD(d));
    setOpen(false);
  }

  function isDayDisabled(day: number): boolean {
    if (!minDate) return false;
    const d = new Date(viewYear, viewMonth, day);
    // Compare date only (strip time)
    const dNorm = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const mNorm = new Date(
      minDate.getFullYear(),
      minDate.getMonth(),
      minDate.getDate()
    );
    return dNorm < mNorm;
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2 text-sm",
          "bg-transparent transition-colors",
          "border-[var(--border)] text-[var(--foreground)]",
          "hover:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30",
          !value && "text-[var(--muted-foreground)]"
        )}
      >
        <span className="font-[var(--font-mono)]">
          {value ? formatDisplay(value) : placeholder}
        </span>
        <Calendar className="h-4 w-4 shrink-0 text-[var(--muted-foreground)]" />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className={cn(
            "absolute left-0 z-50 mt-1 w-72 rounded-2xl border p-3",
            "border-[var(--border)] bg-[var(--background,#fff)] shadow-xl"
          )}
        >
          {/* Month / Year header */}
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={prevMonth}
              className="rounded-lg p-1 transition-colors hover:bg-[var(--muted)]"
            >
              <ChevronLeft className="h-4 w-4 text-[var(--foreground)]" />
            </button>
            <span className="text-sm font-medium text-[var(--foreground)]">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="rounded-lg p-1 transition-colors hover:bg-[var(--muted)]"
            >
              <ChevronRight className="h-4 w-4 text-[var(--foreground)]" />
            </button>
          </div>

          {/* Day names */}
          <div className="mb-1 grid grid-cols-7 gap-0">
            {DAY_NAMES.map((d) => (
              <div
                key={d}
                className="text-center text-xs font-medium text-[var(--muted-foreground)]"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-0">
            {cells.map((day, i) => {
              if (day === null) {
                return <div key={`empty-${i}`} className="h-9 w-full" />;
              }

              const cellDate = new Date(viewYear, viewMonth, day);
              const isToday = isSameDay(cellDate, today);
              const isSelected = selectedDate
                ? isSameDay(cellDate, selectedDate)
                : false;
              const disabled = isDayDisabled(day);

              return (
                <button
                  key={`day-${day}`}
                  type="button"
                  disabled={disabled}
                  onClick={() => selectDay(day)}
                  className={cn(
                    "flex h-9 w-full items-center justify-center rounded-lg text-sm font-[var(--font-mono)] transition-colors",
                    disabled
                      ? "cursor-not-allowed text-[var(--muted-foreground)]/40"
                      : "cursor-pointer hover:bg-[var(--muted)]",
                    isSelected &&
                      !disabled &&
                      "bg-[var(--primary)] text-white hover:bg-[var(--primary)]",
                    isToday &&
                      !isSelected &&
                      !disabled &&
                      "border border-[var(--primary)] text-[var(--primary)]"
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
