
import React from "react";
import Hero from "@/components/Hero";
import SocialLinks from "@/components/SocialLinks";
import AIChat from "@/components/AIChat";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";

const Index = () => {
  return (
    <div className="min-h-screen">
      <ThemeToggle />
      <Hero />
      <SocialLinks />
      <AIChat />
      <Footer />
    </div>
  );
};

export default Index;
