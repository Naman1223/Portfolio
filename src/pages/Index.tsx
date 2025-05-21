
import React, { useEffect, useRef } from "react";
import Hero from "@/components/Hero";
import SocialLinks from "@/components/SocialLinks";
import AIChat from "@/components/AIChat";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";
import AnimatedBackground from "@/components/AnimatedBackground";

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Force dark mode on load
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
    
    // Initialize parallax effect for 3D scroll
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const elements = document.querySelectorAll('.parallax-element');
      
      elements.forEach((element, index) => {
        const speed = index % 2 === 0 ? 0.05 : 0.07;
        const el = element as HTMLElement;
        el.style.transform = `translateY(${scrollY * speed}px) rotate3d(1, 1, 1, ${scrollY * 0.02}deg)`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative perspective-1000" ref={containerRef}>
      <AnimatedBackground particleCount={40} />
      <ThemeToggle />
      
      {/* 3D floating elements */}
      <div className="fixed top-[10%] left-[5%] w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full opacity-50 animate-floating parallax-element"></div>
      <div className="fixed top-[30%] right-[8%] w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-full opacity-40 animate-floating delay-200 parallax-element"></div>
      <div className="fixed bottom-[15%] left-[12%] w-20 h-20 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full opacity-30 animate-floating delay-700 parallax-element"></div>
      <div className="fixed top-[50%] right-[15%] w-24 h-24 bg-gradient-to-r from-yellow-500 to-green-500 rounded-full opacity-20 animate-floating delay-1000 parallax-element"></div>
      
      <div className="relative z-10">
        <Hero />
        <SocialLinks />
        <AIChat />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
