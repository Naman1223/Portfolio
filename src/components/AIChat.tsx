
import React, { useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

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
        'data-retry-count'?: string;
      };
    }
  }
}

const AIChat = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();

  const maxRetries = 3;
  const retryDelay = 2000;

  const resetChat = useCallback(() => {
    console.log('Resetting chat widget...');
    setIsLoaded(false);
    setError(null);
    setIsRetrying(false);
    
    // Remove existing widget
    const existingWidget = document.querySelector('langflow-chat');
    if (existingWidget) {
      existingWidget.remove();
    }
    
    // Remove existing styles
    const existingStyle = document.getElementById('langflow-custom-styles');
    if (existingStyle) {
      existingStyle.remove();
    }
  }, []);

  const handleNetworkError = useCallback((errorEvent: any) => {
    console.error('Network error detected:', errorEvent);
    
    if (retryCount < maxRetries && !isRetrying) {
      setIsRetrying(true);
      setRetryCount(prev => prev + 1);
      
      toast({
        title: "Connection Issue",
        description: `Retrying connection... (${retryCount + 1}/${maxRetries})`,
        variant: "default",
      });
      
      setTimeout(() => {
        resetChat();
        setIsRetrying(false);
      }, retryDelay);
    } else {
      setError('Unable to connect to the chat service. Please check your internet connection and try again.');
      toast({
        title: "Connection Failed",
        description: "Please refresh the page or try again later.",
        variant: "destructive",
      });
    }
  }, [retryCount, isRetrying, toast, resetChat]);

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 50;
    let networkErrorListener: any;

    const checkLangflow = () => {
      attempts++;
      console.log(`Checking for Langflow widget... Attempt ${attempts}`);

      if (window.customElements && window.customElements.get('langflow-chat')) {
        console.log('Langflow chat widget is ready');
        setIsLoaded(true);
        
        // Add network error monitoring
        networkErrorListener = (event: any) => {
          if (event.detail && event.detail.error && event.detail.error.code === 'ERR_NETWORK') {
            handleNetworkError(event.detail.error);
          }
        };
        
        window.addEventListener('langflow-error', networkErrorListener);
        
        // Add comprehensive custom styles with better responsive design
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
            position: relative !important;
          }
          
          langflow-chat iframe {
            border-radius: 12px !important;
            border: none !important;
            width: 100% !important;
            height: 600px !important;
            background: white !important;
            min-height: 500px !important;
          }
          
          langflow-chat .chat-container,
          langflow-chat .langflow-chat-container {
            position: static !important;
            width: 100% !important;
            height: 600px !important;
            border-radius: 12px !important;
            box-shadow: none !important;
            transform: none !important;
          }

          langflow-chat .chat-widget {
            position: static !important;
            transform: none !important;
            width: 100% !important;
            height: 600px !important;
            border-radius: 12px !important;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
          }

          /* Error state styling */
          langflow-chat.error {
            border: 2px solid #ef4444 !important;
            background: rgba(239, 68, 68, 0.05) !important;
          }

          /* Loading state styling */
          langflow-chat.loading {
            background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%) !important;
            background-size: 200% 100% !important;
            animation: loading-shimmer 2s infinite !important;
          }

          @keyframes loading-shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }

          /* Mobile responsiveness */
          @media (max-width: 768px) {
            langflow-chat {
              height: 500px !important;
            }
            
            langflow-chat iframe {
              height: 500px !important;
            }
            
            langflow-chat .chat-container,
            langflow-chat .langflow-chat-container,
            langflow-chat .chat-widget {
              height: 500px !important;
            }
          }
        `;
        
        document.head.appendChild(style);
        
        // Reset retry count on successful load
        setRetryCount(0);
        
      } else if (attempts < maxAttempts) {
        setTimeout(checkLangflow, 100);
      } else {
        console.error('Langflow widget failed to load after maximum attempts');
        setError('Chat widget failed to load. Please refresh the page and try again.');
        toast({
          title: "Loading Failed",
          description: "Unable to initialize chat widget. Please refresh the page.",
          variant: "destructive",
        });
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
      
      if (networkErrorListener) {
        window.removeEventListener('langflow-error', networkErrorListener);
      }
    };
  }, [handleNetworkError, toast]);

  const handleManualRetry = () => {
    setRetryCount(0);
    resetChat();
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  if (error && !isRetrying) {
    return (
      <section id="chat-section" className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 gradient-text">Chat With Me</h2>
          <Card className="p-8">
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            
            <div className="text-center space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                We're experiencing connectivity issues. This might be due to:
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 list-disc list-inside space-y-1">
                <li>Network connectivity problems</li>
                <li>DataStax Astra service temporarily unavailable</li>
                <li>Firewall or browser blocking the connection</li>
              </ul>
              
              <div className="flex gap-4 justify-center mt-6">
                <button 
                  onClick={handleManualRetry}
                  className="px-6 py-2 bg-portfolio-purple text-white rounded-lg hover:bg-portfolio-dark-purple transition-colors"
                >
                  Try Again
                </button>
                <button 
                  onClick={handleRefresh}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Refresh Page
                </button>
              </div>
            </div>
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
        
        {isRetrying && (
          <Alert className="mb-6 max-w-2xl mx-auto">
            <AlertDescription className="text-center">
              Reconnecting... Please wait a moment.
            </AlertDescription>
          </Alert>
        )}
        
        <Card className="relative overflow-hidden chat-glow bg-gradient-to-br from-portfolio-purple/20 to-portfolio-light-purple/20">
          <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
            {!isLoaded && !error && (
              <div className="flex items-center justify-center h-[600px] bg-gray-50 dark:bg-gray-800">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-portfolio-purple mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {isRetrying ? 'Reconnecting...' : 'Loading chat assistant...'}
                  </p>
                  {retryCount > 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Retry attempt {retryCount}/{maxRetries}
                    </p>
                  )}
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
                data-retry-count={retryCount.toString()}
              />
            </div>
          </div>
        </Card>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            💡 Try asking about my projects, experience, or technical skills!
          </p>
          {isLoaded && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              Powered by DataStax Astra • Status: Connected
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default AIChat;
