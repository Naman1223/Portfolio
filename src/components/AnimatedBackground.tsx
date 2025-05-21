
import React, { useEffect } from 'react';

interface AnimatedBackgroundProps {
  particleCount?: number;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ 
  particleCount = 30 
}) => {
  useEffect(() => {
    const container = document.querySelector('.animated-background');
    if (!container) return;

    // Clear any existing particles
    container.innerHTML = '';

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      
      // Random size between 2px and 10px
      const size = Math.random() * 8 + 2;
      
      // Random position
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      
      // Random animation properties
      const animDuration = Math.random() * 30 + 15;
      const animDelay = Math.random() * 10;
      const opacity = Math.random() * 0.5 + 0.1;
      
      // Apply styles
      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: linear-gradient(135deg, #8B5CF6, #D6BCFA);
        border-radius: 50%;
        left: ${left}%;
        top: ${top}%;
        opacity: ${opacity};
        animation: floatParticle ${animDuration}s infinite ease-in-out ${animDelay}s;
      `;
      
      container.appendChild(particle);
    }
    
    // Add keyframe animation to head
    const styleSheet = document.createElement('style');
    styleSheet.innerText = `
      @keyframes floatParticle {
        0%, 100% { 
          transform: translate3d(0, 0, 0) rotate3d(1, 1, 1, 0deg); 
        }
        25% { 
          transform: translate3d(${Math.random() * 50}px, ${Math.random() * 50}px, ${Math.random() * 100}px) rotate3d(1, 1, 1, 90deg);
        }
        50% { 
          transform: translate3d(${Math.random() * -50}px, ${Math.random() * -50}px, ${Math.random() * 50}px) rotate3d(1, 1, 1, 180deg);
        }
        75% { 
          transform: translate3d(${Math.random() * -30}px, ${Math.random() * 30}px, ${Math.random() * -50}px) rotate3d(1, 1, 1, 270deg);
        }
      }
    `;
    document.head.appendChild(styleSheet);
    
    return () => {
      // Clean up
      document.head.removeChild(styleSheet);
    };
  }, [particleCount]);

  return (
    <div className="animated-background fixed inset-0 pointer-events-none z-0 preserve-3d perspective-1000"></div>
  );
};

export default AnimatedBackground;
