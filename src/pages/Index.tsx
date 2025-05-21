
import React from "react";
import Hero from "@/components/Hero";
import SocialLinks from "@/components/SocialLinks";
import AIChat from "@/components/AIChat";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <SocialLinks />
      <AIChat />
      <Footer />
    </div>
  );
};

export default Index;
