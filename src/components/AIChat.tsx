
import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'langflow-chat': {
        window_title: string;
        flow_id: string;
        host_url: string;
        chat_position?: string;
        chat_window_style?: string;
        height?: string;
        width?: string;
      };
    }
  }
}

const AIChat = () => {
  useEffect(() => {
    // Ensure the langflow script is loaded
    const checkLangflow = () => {
      if (window.customElements && window.customElements.get('langflow-chat')) {
        console.log('Langflow chat widget is ready');
        
        // Add custom styles to make it look more integrated
        const style = document.createElement('style');
        style.textContent = `
          langflow-chat {
            --chat-window-height: 600px !important;
            --chat-window-width: 100% !important;
            border-radius: 12px !important;
            overflow: hidden !important;
          }
          
          langflow-chat iframe {
            border-radius: 12px !important;
            border: none !important;
            width: 100% !important;
            height: 600px !important;
          }
          
          .langflow-chat-container {
            position: static !important;
            width: 100% !important;
            height: 600px !important;
            border-radius: 12px !important;
          }
        `;
        document.head.appendChild(style);
      } else {
        setTimeout(checkLangflow, 100);
      }
    };
    checkLangflow();
  }, []);

  return (
    <section id="chat-section" className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4 gradient-text">Chat With Me</h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Have a conversation with my AI assistant powered by DataStax Astra.
          Ask questions about my experience, skills, projects, or just chat!
        </p>
        
        <Card className="p-4 chat-glow bg-gradient-to-br from-portfolio-purple/30 to-portfolio-light-purple/30 overflow-hidden">
          <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
            <langflow-chat
              window_title="Porti"
              flow_id="903fcb39-a23f-4862-8863-8dc89a34a92f"
              host_url="https://astra.datastax.com"
              chat_position="inline"
              height="600px"
              width="100%"
            />
          </div>
        </Card>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            💡 Try asking about my projects, experience, or technical skills!
          </p>
        </div>
      </div>
    </section>
  );
};

export default AIChat;
