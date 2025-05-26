
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
      content: "Hello! I'm Naman's AI assistant powered by Langflow. I can tell you about Naman's experience, skills, or help you schedule an interview. What would you like to know?", 
      timestamp: new Date() 
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [langflowUrl, setLangflowUrl] = useState("");
  const [flowId, setFlowId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isConfigured, setIsConfigured] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check if configuration is saved in localStorage
    const savedConfig = localStorage.getItem('langflow-config');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      setLangflowUrl(config.url);
      setFlowId(config.flowId);
      setApiKey(config.apiKey);
      setIsConfigured(true);
    }
  }, []);

  const saveConfiguration = () => {
    if (!langflowUrl || !flowId) {
      toast({
        title: "Configuration Required",
        description: "Please enter both Langflow URL and Flow ID.",
        variant: "destructive",
      });
      return;
    }

    const config = {
      url: langflowUrl,
      flowId: flowId,
      apiKey: apiKey
    };
    
    localStorage.setItem('langflow-config', JSON.stringify(config));
    setIsConfigured(true);
    
    toast({
      title: "Configuration Saved",
      description: "Langflow integration is now configured!",
    });
  };

  const callLangflow = async (userMessage: string): Promise<string> => {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      const response = await fetch(`${langflowUrl}/api/v1/run/${flowId}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          input_value: userMessage,
          output_type: "chat",
          input_type: "chat",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Extract the response from Langflow's response structure
      if (data.outputs && data.outputs.length > 0) {
        const output = data.outputs[0];
        if (output.outputs && output.outputs.length > 0) {
          return output.outputs[0].results.message.text || "Sorry, I couldn't process your request.";
        }
      }
      
      return data.result || data.message || "Sorry, I couldn't process your request.";
    } catch (error) {
      console.error('Langflow API error:', error);
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    if (!isConfigured) {
      toast({
        title: "Configuration Required",
        description: "Please configure Langflow settings first.",
        variant: "destructive",
      });
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
      const response = await callLangflow(currentInput);
      
      const assistantMessage: Message = {
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      
      // Check if response mentions interview to show toast
      if (response.toLowerCase().includes('interview') || response.toLowerCase().includes('schedule') || response.toLowerCase().includes('meet')) {
        toast({
          title: "Interview Interest Detected",
          description: "Your interview request has been noted. Naman will contact you shortly!",
          duration: 5000,
        });
      }
    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I'm having trouble connecting to my AI system right now. Please try again later or contact Naman directly.",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
      
      toast({
        title: "Connection Error",
        description: "Failed to connect to Langflow. Please check your configuration.",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };

  if (!isConfigured) {
    return (
      <section id="chat-section" className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 gradient-text">Configure Langflow Integration</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Please configure your Langflow settings to enable the AI chat assistant.
          </p>
          
          <Card className="p-6 max-w-2xl mx-auto">
            <div className="space-y-4">
              <div>
                <Label htmlFor="langflow-url">Langflow URL</Label>
                <Input
                  id="langflow-url"
                  value={langflowUrl}
                  onChange={(e) => setLangflowUrl(e.target.value)}
                  placeholder="https://your-langflow-instance.com"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="flow-id">Flow ID</Label>
                <Input
                  id="flow-id"
                  value={flowId}
                  onChange={(e) => setFlowId(e.target.value)}
                  placeholder="your-flow-id"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="api-key">API Key (Optional)</Label>
                <Input
                  id="api-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="your-api-key"
                  className="mt-1"
                />
              </div>
              
              <Button 
                onClick={saveConfiguration}
                className="w-full bg-portfolio-purple hover:bg-portfolio-dark-purple"
              >
                Save Configuration
              </Button>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="chat-section" className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold gradient-text">Chat With My AI Assistant</h2>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsConfigured(false)}
            className="text-xs"
          >
            Configure Langflow
          </Button>
        </div>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Have questions about my experience, skills, or want to schedule an interview?
          My AI assistant powered by Langflow can help you get the information you need.
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
                  disabled={isTyping}
                />
                <Button 
                  type="submit" 
                  className="bg-portfolio-purple hover:bg-portfolio-dark-purple"
                  disabled={isTyping}
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
