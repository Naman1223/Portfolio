
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

const Hero = () => {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 py-20 md:px-8 text-center relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-portfolio-purple/10 blur-3xl animate-pulse-slow" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-portfolio-light-purple/10 blur-3xl animate-pulse-slow" />
      
      <div className="relative z-10 max-w-3xl mx-auto opacity-0 animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <div className="w-32 h-32 rounded-full mx-auto mb-8 bg-gradient-to-br from-portfolio-purple to-portfolio-light-purple p-1">
          <div className="w-full h-full rounded-full bg-white dark:bg-portfolio-charcoal flex items-center justify-center text-3xl font-bold text-portfolio-purple">
            NP
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          <span className="gradient-text">Naman Portfolio</span>
        </h1>
        
        <h2 className="text-xl md:text-2xl font-medium text-gray-600 dark:text-gray-300 mb-6">
          Full Stack Developer & AI Specialist
        </h2>
        
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          I create elegant solutions to complex problems using modern technologies.
          Specialized in React, Node.js and AI integration.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="bg-gradient-to-r from-portfolio-purple to-portfolio-dark-purple hover:opacity-90 transition-opacity">
            View My Work
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="border-portfolio-purple text-portfolio-purple hover:bg-portfolio-purple/10"
            onClick={() => document.getElementById("chat-section")?.scrollIntoView({ behavior: "smooth" })}
          >
            Chat With My AI
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
