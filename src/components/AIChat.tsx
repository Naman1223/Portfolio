
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Settings, Send } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

type AstraConfig = {
  apiKey: string;
  authToken: string;
  webhookUrl: string;
};

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "assistant", 
      content: "Hello! I'm Naman's AI assistant powered by DataStax Astra. I can help you with questions about Naman's experience, skills, or schedule an interview. What would you like to know?", 
      timestamp: new Date() 
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [astraConfig, setAstraConfig] = useState<AstraConfig>(() => {
    const saved = localStorage.getItem('astra-config');
    return saved ? JSON.parse(saved) : {
      apiKey: '',
      authToken: '',
      webhookUrl: 'https://astra.datastax.com/api/v1/webhook/903fcb39-a23f-4862-8863-8dc89a34a92f'
    };
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const saveConfig = () => {
    localStorage.setItem('astra-config', JSON.stringify(astraConfig));
    setShowConfig(false);
    toast({
      title: "Configuration Saved",
      description: "DataStax Astra configuration has been saved successfully.",
    });
  };

  const sendToAstra = async (message: string) => {
    try {
      const response = await fetch(astraConfig.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': astraConfig.apiKey,
          'Authorization': `Bearer ${astraConfig.authToken}`
        },
        body: JSON.stringify({
          message: message,
          timestamp: new Date().toISOString(),
          context: "portfolio_chat"
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.response || data.message || "I received your message but couldn't generate a proper response. Please try again.";
    } catch (error) {
      console.error('Error calling Astra webhook:', error);
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    if (!astraConfig.apiKey || !astraConfig.authToken) {
      toast({
        title: "Configuration Required",
        description: "Please configure your DataStax Astra API key and auth token first.",
        variant: "destructive",
      });
      setShowConfig(true);
      return;
    }
    
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
      const responseContent = await sendToAstra(currentInput);
      
      const assistantMessage: Message = {
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content: "I'm having trouble connecting to my backend service. Please check the configuration or try again later.",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
      
      toast({
        title: "Connection Error",
        description: "Failed to connect to DataStax Astra. Please check your configuration.",
        variant: "destructive",
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
          Have questions about my experience, skills, or want to schedule an interview?
          My AI assistant powered by DataStax Astra can help you get the information you need.
        </p>
        
        <Card className="p-1 chat-glow bg-gradient-to-br from-portfolio-purple/30 to-portfolio-light-purple/30">
          <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-semibold">AI Assistant</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowConfig(!showConfig)}
                className="text-gray-500 hover:text-gray-700"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>

            {showConfig && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b space-y-4">
                <h4 className="font-medium">DataStax Astra Configuration</h4>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Webhook URL</label>
                  <Input
                    value={astraConfig.webhookUrl}
                    onChange={(e) => setAstraConfig(prev => ({ ...prev, webhookUrl: e.target.value }))}
                    placeholder="https://astra.datastax.com/api/v1/webhook/..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">API Key</label>
                  <Input
                    type="password"
                    value={astraConfig.apiKey}
                    onChange={(e) => setAstraConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                    placeholder="Your x-api-key"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Authorization Token</label>
                  <Input
                    type="password"
                    value={astraConfig.authToken}
                    onChange={(e) => setAstraConfig(prev => ({ ...prev, authToken: e.target.value }))}
                    placeholder="Your Bearer token"
                  />
                </div>
                <Button onClick={saveConfig} className="w-full">
                  Save Configuration
                </Button>
              </div>
            )}
            
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
                  disabled={isTyping}
                >
                  <Send className="h-4 w-4" />
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
