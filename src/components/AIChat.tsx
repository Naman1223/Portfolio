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
  webhookUrl: string;
  apiKey: string;
  authToken: string;
};

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "assistant", 
      content: "Hello! I'm connected to DataStax Astra. Ask me anything!", 
      timestamp: new Date() 
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [astraConfig, setAstraConfig] = useState<AstraConfig>(() => {
    const saved = localStorage.getItem('astra-config');
    return saved ? JSON.parse(saved) : {
      webhookUrl: "https://astra.datastax.com/api/v1/webhook/903fcb39-a23f-4862-8863-8dc89a34a92f",
      apiKey: "astracs:pDLbwvxDpmuXqBQEjXczgFoP:40f6fe10bdc892d8a165c10c3bda",
      authToken: "TwipFtCWWA7ucWxSjyCgSIy4k68X5,lqwnsGUFyzW1QaSB-F49RSZq6BB"
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
      description: "Your Astra configuration has been saved successfully.",
    });
  };

  const sendToAstra = async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch(astraConfig.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': astraConfig.apiKey,
          'Authorization': `Bearer ${astraConfig.authToken}`
        },
        body: JSON.stringify({
          any: "data"
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.response || data.message || "Response received from Astra.";
    } catch (error) {
      console.error('Astra API Error:', error);
      throw new Error('Failed to connect to Astra. Please check your configuration.');
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
      const response = await sendToAstra(currentInput);
      
      const assistantMessage: Message = {
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content: error instanceof Error ? error.message : "An error occurred while processing your request.",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
      
      toast({
        title: "Connection Error",
        description: "Failed to connect to Astra. Please check your configuration.",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <section id="chat-section" className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold gradient-text">Chat With DataStax Astra</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowConfig(!showConfig)}
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Configure
          </Button>
        </div>
        
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Connected to DataStax Astra for intelligent responses and data processing.
        </p>

        {showConfig && (
          <Card className="p-4 mb-6 bg-gray-50 dark:bg-gray-800">
            <h3 className="font-semibold mb-4">Astra Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Webhook URL</label>
                <Input
                  value={astraConfig.webhookUrl}
                  onChange={(e) => setAstraConfig({...astraConfig, webhookUrl: e.target.value})}
                  placeholder="https://astra.datastax.com/api/v1/webhook/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">API Key</label>
                <Input
                  type="password"
                  value={astraConfig.apiKey}
                  onChange={(e) => setAstraConfig({...astraConfig, apiKey: e.target.value})}
                  placeholder="Your Astra API key"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Authorization Token</label>
                <Input
                  type="password"
                  value={astraConfig.authToken}
                  onChange={(e) => setAstraConfig({...astraConfig, authToken: e.target.value})}
                  placeholder="Your Astra auth token"
                />
              </div>
              <Button onClick={saveConfig} className="w-full">
                Save Configuration
              </Button>
            </div>
          </Card>
        )}
        
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
                  placeholder="Ask me anything about the data..."
                  className="flex-grow"
                />
                <Button 
                  type="submit" 
                  className="bg-portfolio-purple hover:bg-portfolio-dark-purple"
                >
                  <Send className="w-4 h-4" />
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
