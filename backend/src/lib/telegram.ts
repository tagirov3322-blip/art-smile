import logger from "./logger";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const API_BASE = BOT_TOKEN ? `https://api.telegram.org/bot${BOT_TOKEN}` : null;

async function tgRequest(method: string, body: Record<string, unknown>): Promise<boolean> {
  if (!API_BASE) return false;
  try {
    const res = await fetch(`${API_BASE}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json() as { ok: boolean; description?: string };
    if (!json.ok) {
      logger.error({ method, description: json.description }, "Telegram API error");
      return false;
    }
    return true;
  } catch (error) {
    logger.error({ error }, "Telegram request failed");
    return false;
  }
}

export function initTelegramBot(): void {
  if (!BOT_TOKEN) {
    logger.warn("TELEGRAM_BOT_TOKEN не задан, Telegram уведомления отключены");
    return;
  }
  // Verify token on startup
  tgRequest("getMe", {}).then((ok) => {
    if (ok) logger.info("Telegram бот подключён (HTTP mode)");
    else logger.warn("Telegram бот: токен невалиден");
  });
}

export async function notifyNewBooking(booking: {
  id: number;
  patientName: string;
  phone: string;
  date: Date;
  time: string;
  comment?: string | null;
  doctor: { name: string };
  service: { name: string };
}): Promise<void> {
  if (!CHAT_ID) return;

  const message =
    `🦷 Новая запись #${booking.id}\n\n` +
    `👤 ${booking.patientName}\n` +
    `📱 ${booking.phone}\n` +
    `👨‍⚕️ ${booking.doctor.name}\n` +
    `🔧 ${booking.service.name}\n` +
    `📅 ${booking.date.toLocaleDateString("ru-RU")} в ${booking.time}\n` +
    (booking.comment ? `💬 ${booking.comment}` : "");

  await tgRequest("sendMessage", {
    chat_id: CHAT_ID,
    text: message,
    reply_markup: {
      inline_keyboard: [[
        { text: "✅ Подтвердить", callback_data: `confirm_${booking.id}` },
        { text: "❌ Отклонить", callback_data: `reject_${booking.id}` },
      ]],
    },
  });
}

export async function notifyBookingStatusChange(
  bookingId: number,
  status: string,
  patientName: string,
  doctorName: string,
  date: string,
  time: string,
): Promise<void> {
  if (!CHAT_ID) return;

  const emoji = status === "confirmed" ? "✅" : status === "cancelled" ? "❌" : "📋";
  const statusLabel = status === "confirmed" ? "подтверждена" : status === "cancelled" ? "отменена" : status;

  await tgRequest("sendMessage", {
    chat_id: CHAT_ID,
    text: `${emoji} Запись #${bookingId} ${statusLabel}\n👤 ${patientName}\n👨‍⚕️ ${doctorName}\n📅 ${date} ${time}`,
  });
}
