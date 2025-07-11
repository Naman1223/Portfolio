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

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "assistant", 
      content: "Hello! I'm Naman's AI assistant. I can help answer questions about his experience, skills, and projects. What would you like to know?", 
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

  const sendToWebhook = async (userMessage: string) => {
    try {
      console.log('Attempting to send message to webhook:', userMessage);
      
      // First try with CORS
      let response;
      try {
        response = await fetch("https://n8nt.sbs/webhook/ead66244-8ec8-441b-aa14-5d592490b6b3", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors',
          body: JSON.stringify({ 
            message: userMessage,
            timestamp: new Date().toISOString(),
            source: 'ai-chat'
          })
        });
      } catch (corsError) {
        console.log('CORS request failed, trying no-cors mode');
        
        // Fallback to no-cors mode
        response = await fetch("https://n8nt.sbs/webhook/ead66244-8ec8-441b-aa14-5d592490b6b3", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'no-cors',
          body: JSON.stringify({ 
            message: userMessage,
            timestamp: new Date().toISOString(),
            source: 'ai-chat'
          })
        });
        
        // With no-cors, we can't read the response, so return a default message
        console.log('Request sent with no-cors mode');
        return "Your message was sent successfully. The AI service should respond shortly.";
      }

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }

      // Try to get response as text first, then parse if it's JSON
      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      // Try to parse as JSON, if it fails, return the text directly
      try {
        const data = JSON.parse(responseText);
        return data.response || data.message || data.reply || responseText;
      } catch (jsonError) {
        // If it's not JSON, return the text response directly
        return responseText || "I received your message but couldn't generate a proper response.";
      }
    } catch (error) {
      console.error('Error calling webhook:', error);
      throw new Error('Unable to connect to the AI service. Please check your network connection and try again.');
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsTyping(true);
    
    try {
      // Call webhook
      const aiResponse = await sendToWebhook(currentInput);
      
      const assistantMessage: Message = {
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      // Fallback response if webhook fails
      const errorMessage: Message = {
        role: "assistant",
        content: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
      
      toast({
        title: "Connection Error",
        description: "Unable to connect to the AI service. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <section id="chat-section" className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4 gradient-text">Chat With My AI Assistant</h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Have a conversation with my AI assistant. Ask questions about my experience, skills, projects, or anything else you'd like to know!
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
                  placeholder="Type your message here..."
                  className="flex-grow"
                  disabled={isTyping}
                />
                <Button 
                  type="submit" 
                  className="bg-portfolio-purple hover:bg-portfolio-dark-purple"
                  disabled={isTyping || !input.trim()}
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