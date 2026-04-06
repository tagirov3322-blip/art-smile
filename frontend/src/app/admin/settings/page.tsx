"use client";

import { useEffect, useState, useRef } from "react";
import { api } from "@/lib/api";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface Settings {
  clinicName: string;
  phone: string;
  address: string;
  telegramChatId: string;
  smsEnabled: boolean;
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".page-title", { y: -20, opacity: 0, duration: 0.5, ease: "power2.out" });
    gsap.from(".page-content", { y: 30, opacity: 0, duration: 0.6, delay: 0.2, ease: "power3.out" });
  }, { scope: containerRef });

  useEffect(() => {
    api.get<Settings>("/settings").then(setSettings).catch(console.error);
  }, []);

  const handleSmsToggle = (checked: boolean) => {
    if (!settings) return;
    if (settings.smsEnabled && !checked) {
      const confirmed = confirm("Вы уверены, что хотите отключить SMS-уведомления? Пациенты не будут получать напоминания о записи.");
      if (!confirmed) return;
    }
    setSettings({ ...settings, smsEnabled: checked });
  };

  const save = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await api.put("/settings", settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  if (!settings) return <div className="text-muted-foreground">Загрузка...</div>;

  return (
    <div ref={containerRef}>
      <h1 className="page-title text-2xl font-bold text-foreground">Настройки</h1>

      <div className="page-content mt-6 max-w-lg space-y-5 rounded-2xl bg-card p-6 shadow-sm">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Телефон клиники</label>
          <p className="mb-2 text-xs text-muted-foreground">Отображается в шапке сайта и на странице контактов</p>
          <input value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
            placeholder="+7 (8552) 25-35-35"
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary" />
        </div>

        <div className="rounded-xl border border-border p-4">
          <label className="flex items-center gap-3 text-sm font-medium text-foreground cursor-pointer">
            <input type="checkbox" checked={settings.smsEnabled} onChange={(e) => handleSmsToggle(e.target.checked)} className="h-4 w-4 rounded" />
            SMS-уведомления
          </label>
          <p className="mt-1.5 ml-7 text-xs text-muted-foreground">
            {settings.smsEnabled
              ? "Пациенты получают SMS-напоминания о записи"
              : "SMS-уведомления отключены"}
          </p>
        </div>

        <button onClick={save} disabled={saving}
          className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50">
          {saving ? "Сохранение..." : saved ? "Сохранено!" : "Сохранить"}
        </button>
      </div>
    </div>
  );
}
