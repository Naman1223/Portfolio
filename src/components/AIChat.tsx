
import React, { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'langflow-chat': {
        window_title?: string;
        flow_id?: string;
        host_url?: string;
        style?: React.CSSProperties;
      };
    }
  }
}

const AIChat = () => {
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure the Langflow chat is properly initialized
    if (chatRef.current) {
      const langflowChat = chatRef.current.querySelector('langflow-chat');
      if (langflowChat) {
        // Apply custom styling to hide the default Langflow UI and integrate with our design
        const style = document.createElement('style');
        style.textContent = `
          langflow-chat {
            width: 100%;
            height: 100%;
            border: none;
          }
          langflow-chat .langflow-chat-container {
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, []);

  return (
    <section id="chat-section" className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4 gradient-text">Chat With Me</h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Have a conversation with my AI assistant powered by DataStax Astra.
          Ask questions, discuss topics, or just chat!
        </p>
        
        <Card className="p-1 chat-glow bg-gradient-to-br from-portfolio-purple/30 to-portfolio-light-purple/30">
          <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden h-[500px]" ref={chatRef}>
            <langflow-chat
              window_title="Porti"
              flow_id="903fcb39-a23f-4862-8863-8dc89a34a92f"
              host_url="https://astra.datastax.com"
              style={{ width: '100%', height: '100%', border: 'none' }}
            />
          </div>
        </Card>
      </div>
    </section>
  );
};

export default AIChat;
