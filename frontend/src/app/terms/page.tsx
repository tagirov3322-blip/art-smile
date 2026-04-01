import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Пользовательское соглашение",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Link
          href="/"
          className="mb-8 inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          &larr; На главную
        </Link>

        <h1 className="mb-8 text-3xl font-bold tracking-tight text-slate-900">
          Пользовательское соглашение
        </h1>

        <div className="prose prose-slate max-w-none space-y-6 text-slate-700">
          <p>
            Настоящее Пользовательское соглашение (далее — Соглашение) регулирует
            отношения между ООО «Айкьюдентал» (далее — Клиника) и посетителем
            сайта iq-dental.ru (далее — Пользователь).
          </p>

          <h2 className="text-xl font-semibold text-slate-900">
            1. Общие положения
          </h2>
          <p>
            Использование сайта означает согласие Пользователя с настоящим
            Соглашением и условиями обработки его персональных данных. Сайт
            iq-dental.ru носит исключительно информационный характер и не является
            публичной офертой.
          </p>

          <h2 className="text-xl font-semibold text-slate-900">
            2. Предмет соглашения
          </h2>
          <p>
            Клиника предоставляет Пользователю доступ к информации об услугах,
            специалистах, ценах и возможность записи на приём через форму на сайте.
          </p>

          <h2 className="text-xl font-semibold text-slate-900">
            3. Права и обязанности сторон
          </h2>
          <p>
            <strong>Клиника обязуется:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Предоставлять актуальную информацию об услугах и ценах</li>
            <li>Обрабатывать заявки на приём в разумные сроки</li>
            <li>Обеспечивать конфиденциальность персональных данных</li>
          </ul>
          <p>
            <strong>Пользователь обязуется:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Предоставлять достоверные данные при записи на приём</li>
            <li>Не использовать сайт в противоправных целях</li>
          </ul>

          <h2 className="text-xl font-semibold text-slate-900">
            4. Ограничение ответственности
          </h2>
          <p>
            Информация на сайте, включая цены на услуги, носит справочный характер
            и не является публичной офертой. Точную стоимость лечения определяет
            врач после осмотра.
          </p>

          <h2 className="text-xl font-semibold text-slate-900">
            5. Изменение условий
          </h2>
          <p>
            Клиника оставляет за собой право вносить изменения в настоящее
            Соглашение. Продолжение использования сайта после внесения изменений
            означает согласие с новой редакцией Соглашения.
          </p>

          <h2 className="text-xl font-semibold text-slate-900">
            6. Контактная информация
          </h2>
          <p>
            ООО «Айкьюдентал»
            <br />
            Лицензия № Л041-01181-16/00361643 от 24.09.2019
            <br />
            Адрес: просп. Мира, 34, г. Набережные Челны, Республика Татарстан
            <br />
            Телефон:{" "}
            <a href="tel:+79061232727" className="text-blue-600 hover:underline">
              +7 (906) 123-27-27
            </a>
            <br />
            Email:{" "}
            <a
              href="mailto:info@iq-dental.ru"
              className="text-blue-600 hover:underline"
            >
              info@iq-dental.ru
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
