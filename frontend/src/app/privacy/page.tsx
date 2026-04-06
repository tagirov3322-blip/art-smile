import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Link
          href="/"
          className="mb-8 inline-flex items-center text-sm text-amber-700 hover:text-amber-900"
        >
          &larr; На главную
        </Link>

        <h1 className="mb-8 text-3xl font-bold tracking-tight text-slate-900">
          Политика конфиденциальности
        </h1>

        <div className="prose prose-slate max-w-none space-y-6 text-slate-700">
          <p>
            Настоящая Политика конфиденциальности персональных данных (далее —
            Политика) действует в отношении всей информации, которую ООО
            «Арт Смайлс», расположенное по адресу: Республика
            Татарстан, г. Набережные Челны, пр-кт Вахитова, д. 54В, может получить о
            Пользователе во время использования сайта art-smiles.ru.
          </p>

          <h2 className="text-xl font-semibold text-slate-900">
            1. Определение терминов
          </h2>
          <p>
            <strong>Персональные данные</strong> — любая информация, относящаяся
            прямо или косвенно к определённому или определяемому физическому лицу
            (субъекту персональных данных).
          </p>

          <h2 className="text-xl font-semibold text-slate-900">
            2. Какие данные мы собираем
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Имя и фамилия</li>
            <li>Номер телефона</li>
            <li>Дата и время желаемого приёма</li>
            <li>Комментарий к записи</li>
          </ul>

          <h2 className="text-xl font-semibold text-slate-900">
            3. Цели сбора данных
          </h2>
          <p>
            Персональные данные используются исключительно для записи на приём,
            связи с пациентом для подтверждения записи и улучшения качества
            обслуживания.
          </p>

          <h2 className="text-xl font-semibold text-slate-900">
            4. Защита данных
          </h2>
          <p>
            Мы принимаем все необходимые организационные и технические меры для
            защиты персональных данных от неправомерного или случайного доступа,
            уничтожения, изменения, блокирования, копирования, распространения.
          </p>

          <h2 className="text-xl font-semibold text-slate-900">
            5. Передача данных третьим лицам
          </h2>
          <p>
            Мы не передаём персональные данные третьим лицам, за исключением
            случаев, предусмотренных законодательством Российской Федерации.
          </p>

          <h2 className="text-xl font-semibold text-slate-900">
            6. Права пользователя
          </h2>
          <p>
            Пользователь вправе в любое время отозвать своё согласие на обработку
            персональных данных, направив письменное уведомление на адрес
            info@art-smiles.ru.
          </p>

          <h2 className="text-xl font-semibold text-slate-900">
            7. Контактная информация
          </h2>
          <p>
            ООО «Арт Смайлс»
            <br />
            Адрес: пр-кт Вахитова, 54В, г. Набережные Челны, Республика Татарстан
            <br />
            Телефон:{" "}
            <a href="tel:+78552253535" className="text-amber-700 hover:underline">
              +7 (8552) 25-35-35
            </a>
            <br />
            Email:{" "}
            <a
              href="mailto:info@art-smiles.ru"
              className="text-amber-700 hover:underline"
            >
              info@art-smiles.ru
            </a>
          </p>

          <p className="text-sm text-slate-500">
            Дата последнего обновления: 1 апреля 2026 года.
          </p>
        </div>
      </div>
    </div>
  );
}
