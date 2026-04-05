import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Doctors from "@/components/Doctors";
import Reviews from "@/components/Reviews";
import Promotions from "@/components/Promotions";
import Booking from "@/components/Booking";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="dark:bg-[#0a0f1a]">
        <div className="hero-about-wrapper">
          <Hero />
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
