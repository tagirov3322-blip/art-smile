import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin", "cyrillic"],
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "Art Smiles — Стоматология в Набережных Челнах",
    template: "%s | Art Smiles",
  },
  description:
    "Стоматологический комплекс Art Smiles в Набережных Челнах. Имплантация, протезирование, лечение зубов, ортодонтия, лечение под седацией. Лучшая стоматология 2025 по версии 2ГИС.",
  keywords: [
    "стоматология Набережные Челны",
    "Art Smiles",
    "Арт Смайлс",
    "имплантация зубов",
    "протезирование",
    "лечение кариеса",
    "стоматолог Набережные Челны",
    "ортодонтия",
    "лечение под седацией",
    "детская стоматология",
    "брекеты",
  ],
  authors: [{ name: "Art Smiles" }],
  openGraph: {
    title: "Art Smiles — Стоматология в Набережных Челнах",
    description:
      "Стоматологический комплекс с опытными специалистами. Лучшая стоматология 2025. пр-кт Вахитова, 54В.",
    url: "https://art-smiles.ru",
    siteName: "Art Smiles",
    locale: "ru_RU",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
  other: {
    "google-site-verification": "",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Dentist",
  name: "Art Smiles",
  alternateName: "Арт Смайлс",
  url: "https://art-smiles.ru",
  telephone: "+78552253535",
  email: "info@art-smiles.ru",
  address: {
    "@type": "PostalAddress",
    streetAddress: "пр-кт Вахитова, 54В",
    addressLocality: "Набережные Челны",
    addressRegion: "Республика Татарстан",
    postalCode: "423816",
    addressCountry: "RU",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "55.757865",
    longitude: "52.404133",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "20:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday"],
      opens: "08:00",
      closes: "14:00",
    },
  ],
  priceRange: "₽₽",
  medicalSpecialty: "Dentistry",
  availableService: [
    { "@type": "MedicalProcedure", name: "Имплантация зубов" },
    { "@type": "MedicalProcedure", name: "Протезирование" },
    { "@type": "MedicalProcedure", name: "Лечение кариеса" },
    { "@type": "MedicalProcedure", name: "Профессиональная чистка" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
