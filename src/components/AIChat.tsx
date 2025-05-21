
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

// Sample responses based on common HR questions
const AI_RESPONSES: Record<string, string> = {
  default: "Hello! I'm John's AI assistant. I can tell you about John's experience, skills, or help you schedule an interview. What would you like to know?",
  skills: "John is proficient in React, Node.js, TypeScript, Python, and has experience with AI/ML integration. His strongest technical skills are in full-stack development and cloud architecture.",
  experience: "John has 5 years of professional experience, including 3 years at TechCorp as a Senior Developer and 2 years at AI Solutions as a Full Stack Engineer.",
  education: "John holds a Bachelor's degree in Computer Science from Tech University, graduating with honors in 2018.",
  projects: "Some of John's notable projects include an AI-powered customer service platform, an e-commerce solution with 99.9% uptime, and a machine learning model for predictive analytics.",
  strengths: "John's key strengths include problem-solving, communication skills, and the ability to quickly adapt to new technologies.",
  interview: "Great! John is available for interviews next week. Would you like me to schedule one for you? Just let me know which day works best.",
  contact: "You can reach John directly at john@portfolio.com or 123-456-7890.",
};

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "assistant", 
      content: AI_RESPONSES.default, 
      timestamp: new Date() 
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    
    // Simulate AI thinking and responding
    setTimeout(() => {
      const lowerInput = input.toLowerCase();
      
      // Simple keyword matching for responses
      let responseContent = AI_RESPONSES.default;
      
      if (lowerInput.includes("skill") || lowerInput.includes("know") || lowerInput.includes("tech")) {
        responseContent = AI_RESPONSES.skills;
      } else if (lowerInput.includes("experience") || lowerInput.includes("work")) {
        responseContent = AI_RESPONSES.experience;
      } else if (lowerInput.includes("education") || lowerInput.includes("degree") || lowerInput.includes("study")) {
        responseContent = AI_RESPONSES.education;
      } else if (lowerInput.includes("project")) {
        responseContent = AI_RESPONSES.projects;
      } else if (lowerInput.includes("strength") || lowerInput.includes("weakness")) {
        responseContent = AI_RESPONSES.strengths;
      } else if (lowerInput.includes("interview") || lowerInput.includes("hire") || lowerInput.includes("meet")) {
        responseContent = AI_RESPONSES.interview;
        toast({
          title: "Interview Request Detected",
          description: "Your interview request has been noted. John will contact you shortly!",
          duration: 5000,
        });
      } else if (lowerInput.includes("contact") || lowerInput.includes("email") || lowerInput.includes("phone")) {
        responseContent = AI_RESPONSES.contact;
      }
      
      const assistantMessage: Message = {
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <section id="chat-section" className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4 gradient-text">Chat With My AI Assistant</h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Have questions about my experience, skills, or want to schedule an interview?
          My AI assistant can help you get the information you need.
        </p>
        
        <Card className="p-1 chat-glow bg-gradient-to-br from-portfolio-purple/30 to-portfolio-light-purple/30">
          <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
            <div className="p-4 h-[400px] overflow-y-auto bg-gray-50 dark:bg-gray-800">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 max-w-[80%] ${
                    message.role === "user"
                      ? "ml-auto text-right"
                      : "mr-auto"
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg inline-block ${
                      message.role === "user"
                        ? "bg-portfolio-purple text-white"
                        : "bg-white dark:bg-gray-700 shadow-sm"
                    }`}
                  >
                    {message.content}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-portfolio-purple animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-portfolio-purple animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 rounded-full bg-portfolio-purple animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="p-4 border-t">
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about my skills, experience, or schedule an interview..."
                  className="flex-grow"
                />
                <Button 
                  type="submit" 
                  className="bg-portfolio-purple hover:bg-portfolio-dark-purple"
                >
                  Send
                </Button>
              </form>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default AIChat;
