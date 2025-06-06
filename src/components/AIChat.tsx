
import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'langflow-chat': {
        window_title: string;
        flow_id: string;
        host_url: string;
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
          Ask questions, discuss topics, or just chat!
        </p>
        
        <Card className="p-1 chat-glow bg-gradient-to-br from-portfolio-purple/30 to-portfolio-light-purple/30">
          <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden min-h-[500px] flex items-center justify-center">
            <langflow-chat
              window_title="Porti"
              flow_id="903fcb39-a23f-4862-8863-8dc89a34a92f"
              host_url="https://astra.datastax.com"
            />
          </div>
        </Card>
      </div>
    </section>
  );
};

export default AIChat;
