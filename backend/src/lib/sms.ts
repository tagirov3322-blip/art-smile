import axios from "axios";
import logger from "./logger";

const SMS_API_KEY = process.env.SMS_API_KEY;
const SMS_SENDER = process.env.SMS_SENDER || "Art Smile";

async function sendSms(phone: string, message: string): Promise<boolean> {
  if (!SMS_API_KEY) {
    logger.warn("SMS_API_KEY не задан, SMS не отправлена");
    return false;
  }

  try {
    const response = await axios.get("https://sms.ru/sms/send", {
      params: {
        api_id: SMS_API_KEY,
        to: phone.replace("+", ""),
        msg: message,
        json: 1,
        from: SMS_SENDER,
      },
    });

    if (response.data?.status === "OK") {
      logger.info({ phone }, "SMS отправлена");
      return true;
    }

    logger.error({ phone, response: response.data }, "SMS ошибка");
    return false;
  } catch (error) {
    logger.error({ phone, error }, "SMS сбой отправки");
    return false;
  }
}

export function sendBookingCreatedSms(phone: string, patientName: string): Promise<boolean> {
  return sendSms(
    phone,
    `${patientName}, ваша запись в Art Smile принята! Мы свяжемся с вами для подтверждения. Тел: ${process.env.CLINIC_PHONE || ""}`
  );
}

export function sendBookingConfirmedSms(
  phone: string,
  patientName: string,
  date: string,
  time: string
): Promise<boolean> {
  return sendSms(
    phone,
    `${patientName}, ваша запись в Art Smile подтверждена на ${date} в ${time}. Адрес: ${process.env.CLINIC_ADDRESS || ""}. Тел: ${process.env.CLINIC_PHONE || ""}`
  );
}

export function sendBookingCancelledSms(phone: string, patientName: string): Promise<boolean> {
  return sendSms(
    phone,
    `${patientName}, ваша запись в Art Smile отменена. Для перезаписи позвоните: ${process.env.CLINIC_PHONE || ""}`
  );
}
