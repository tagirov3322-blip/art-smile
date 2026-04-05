const STORAGE_KEY = "iq_sound_settings";

interface SoundSettings {
  enabled: boolean;
  volume: number; // 0-100
}

function getSettings(): SoundSettings {
  if (typeof window === "undefined") return { enabled: true, volume: 70 };
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { enabled: true, volume: 70 };
}

function saveSettings(s: SoundSettings) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

export function getSoundEnabled(): boolean {
  return getSettings().enabled;
}

export function getSoundVolume(): number {
  return getSettings().volume;
}

export function setSoundEnabled(enabled: boolean) {
  const s = getSettings();
  s.enabled = enabled;
  saveSettings(s);
}

export function setSoundVolume(volume: number) {
  const s = getSettings();
  s.volume = Math.max(0, Math.min(100, volume));
  saveSettings(s);
}

export function playNotification() {
  const s = getSettings();
  if (!s.enabled || s.volume === 0) return;
  try {
    const audio = new Audio("/notification.wav");
    audio.volume = s.volume / 100;
    audio.play();
  } catch {}
}
