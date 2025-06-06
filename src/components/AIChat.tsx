
import React, { useEffect, useState } from "react";
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
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max wait time

    const checkLangflow = () => {
      attempts++;
      console.log(`Checking for Langflow widget... Attempt ${attempts}`);

      if (window.customElements && window.customElements.get('langflow-chat')) {
        console.log('Langflow chat widget is ready');
        setIsLoaded(true);
        
        // Add comprehensive custom styles
        const style = document.createElement('style');
        style.id = 'langflow-custom-styles';
        style.textContent = `
          langflow-chat {
            display: block !important;
            width: 100% !important;
            height: 600px !important;
            border-radius: 12px !important;
            overflow: hidden !important;
            background: transparent !important;
          }
          
          langflow-chat iframe {
            border-radius: 12px !important;
            border: none !important;
            width: 100% !important;
            height: 600px !important;
            background: white !important;
          }
          
          langflow-chat .chat-container,
          langflow-chat .langflow-chat-container {
            position: static !important;
            width: 100% !important;
            height: 600px !important;
            border-radius: 12px !important;
            box-shadow: none !important;
          }

          langflow-chat .chat-widget {
            position: static !important;
            transform: none !important;
            width: 100% !important;
            height: 600px !important;
            border-radius: 12px !important;
          }
        `;
        
        // Remove existing style if present
        const existingStyle = document.getElementById('langflow-custom-styles');
        if (existingStyle) {
          existingStyle.remove();
        }
        
        document.head.appendChild(style);
      } else if (attempts < maxAttempts) {
        setTimeout(checkLangflow, 100);
      } else {
        console.error('Langflow widget failed to load after maximum attempts');
        setError('Chat widget failed to load. Please refresh the page and try again.');
      }
    };

    // Start checking immediately
    checkLangflow();

    return () => {
      // Cleanup
      const style = document.getElementById('langflow-custom-styles');
      if (style) {
        style.remove();
      }
    };
  }, []);

  if (error) {
    return (
      <section id="chat-section" className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 gradient-text">Chat With Me</h2>
          <Card className="p-8 text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-portfolio-purple text-white rounded-lg hover:bg-portfolio-dark-purple transition-colors"
            >
              Refresh Page
            </button>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="chat-section" className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4 gradient-text">Chat With Me</h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Have a conversation with my AI assistant powered by DataStax Astra.
          Ask questions about my experience, skills, projects, or just chat!
        </p>
        
        <Card className="relative overflow-hidden chat-glow bg-gradient-to-br from-portfolio-purple/20 to-portfolio-light-purple/20">
          <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
            {!isLoaded && (
              <div className="flex items-center justify-center h-[600px] bg-gray-50 dark:bg-gray-800">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-portfolio-purple mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading chat assistant...</p>
                </div>
              </div>
            )}
            
            <div className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
              <langflow-chat
                window_title="Porti"
                flow_id="903fcb39-a23f-4862-8863-8dc89a34a92f"
                host_url="https://astra.datastax.com"
                chat_position="inline"
                height="600px"
                width="100%"
              />
            </div>
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
