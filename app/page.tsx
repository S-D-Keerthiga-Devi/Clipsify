import Image from "next/image";
import NavbarMain from "./components/NavbarMain";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Faq from "./components/Faq";
import CallToAction from "./components/CallToAction";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <NavbarMain />
      <Hero />
      <div id="features">
        <Features />
      </div>
      <div id="faq">
        <Faq />
      </div>
      <CallToAction />
    </div>
  );
}
