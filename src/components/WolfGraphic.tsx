
import React from 'react';

interface WolfGraphicProps {
  active: boolean;
  size?: number;
  className?: string;
}

const WolfGraphic: React.FC<WolfGraphicProps> = ({ active, size = 120, className = "" }) => {
  return (
    <div 
      className={`relative transition-all duration-1000 ease-in-out pointer-events-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="wolfGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--primary-theme)" stopOpacity="0.8" />
            <stop offset="50%" stopColor="white" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--primary-theme)" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Outer Aura Rays */}
        <g className={active ? 'animate-[spin_120s_linear_infinite]' : ''} style={{ transformOrigin: '50% 50%' }}>
          {[...Array(12)].map((_, i) => (
            <line 
              key={i}
              x1="50" y1="10" x2="50" y2="0"
              stroke="var(--primary-theme)"
              strokeWidth="0.2"
              opacity="0.3"
              transform={`rotate(${i * 30}, 50, 50)`}
            />
          ))}
        </g>

        {/* Geometric Wolf Head Silhouette - Refined and Majestic */}
        <path 
          d="M50 8L32 30L15 25L28 48L10 68L28 62L50 92L72 62L90 68L72 48L85 25L68 30L50 8Z" 
          fill="url(#wolfGradient)" 
          className="transition-all duration-1000"
          style={{ 
            opacity: active ? 0.3 : 0.1,
            filter: 'url(#glow)'
          }}
        />
        
        {/* Detail Lines */}
        <path 
          d="M50 15L38 32L25 28L33 46L20 63L33 58L50 85L67 58L80 63L67 46L75 28L62 32L50 15Z" 
          stroke="var(--primary-theme)" 
          strokeWidth="0.5"
          className="transition-all duration-1000"
          style={{ opacity: active ? 1 : 0.2 }}
        >
          {active && <animate attributeName="stroke-opacity" values="0.3;1;0.3" dur="3s" repeatCount="indefinite" />}
        </path>
        
        {/* Piercing Glowing Eyes */}
        <g style={{ opacity: active ? 1 : 0.4 }}>
          <circle cx="42" cy="45" r="1.2" fill="var(--primary-theme)">
            <animate attributeName="r" values="1.2;1.8;1.2" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="58" cy="45" r="1.2" fill="var(--primary-theme)">
            <animate attributeName="r" values="1.2;1.8;1.2" dur="2s" repeatCount="indefinite" />
          </circle>
          
          {/* Eye Flare */}
          <circle cx="42" cy="45" r="4" fill="var(--primary-theme)" opacity="0.2">
             <animate attributeName="r" values="3;6;3" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="58" cy="45" r="4" fill="var(--primary-theme)" opacity="0.2">
             <animate attributeName="r" values="3;6;3" dur="2s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Breathing Aura Rings */}
        <circle cx="50" cy="50" r="45" stroke="var(--primary-theme)" strokeWidth="0.1" opacity="0.1">
          <animate attributeName="r" values="40;48;40" dur="5s" repeatCount="indefinite" />
        </circle>
        <circle cx="50" cy="50" r="35" stroke="var(--primary-theme)" strokeWidth="0.1" opacity="0.1">
          <animate attributeName="r" values="30;38;30" dur="4s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
};

export default WolfGraphic;
