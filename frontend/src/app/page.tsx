import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Footer from "@/components/Footer";
import ToothOverlay from "@/components/ToothOverlay";

const Services = dynamic(() => import("@/components/Services"));
const Doctors = dynamic(() => import("@/components/Doctors"));
const Reviews = dynamic(() => import("@/components/Reviews"));
const Promotions = dynamic(() => import("@/components/Promotions"));
const Booking = dynamic(() => import("@/components/Booking"));
const FAQ = dynamic(() => import("@/components/FAQ"));

export default function Home() {
  return (
    <>
      <Header />
      <main className="dark:bg-[#0d0b08] overflow-x-hidden">
        <div className="hero-about-wrapper">
          <Hero />
          <ToothOverlay />
          <About />
        </div>
        <Services />
        <Doctors />
        <Reviews />
        <Promotions />
        <Booking />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
