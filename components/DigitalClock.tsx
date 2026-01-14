
import React, { useState, useEffect } from 'react';

interface DigitalClockProps {
  size?: 'small' | 'normal';
}

const DigitalClock: React.FC<DigitalClockProps> = ({ size = 'normal' }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const containerClasses = size === 'small' 
    ? "bg-gray-950/60 px-3 py-1.5 rounded-xl border border-white/10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] backdrop-blur-3xl"
    : "bg-gray-950/60 px-5 md:px-8 py-2 md:py-4 rounded-2xl border border-white/10 shadow-[inset_0_2px_15px_rgba(0,0,0,0.8)] backdrop-blur-3xl";

  const textClasses = size === 'small'
    ? "text-[#4ade80] font-mono text-lg md:text-xl font-black tracking-tighter drop-shadow-[0_0_10px_rgba(74,222,128,0.6)] whitespace-nowrap"
    : "text-[#4ade80] font-mono text-2xl md:text-4xl lg:text-5xl font-black tracking-tight drop-shadow-[0_0_20px_rgba(74,222,128,0.7)] whitespace-nowrap";

  return (
    <div className={containerClasses}>
      <span className={textClasses}>
        {time.toLocaleTimeString('pt-BR', { hour12: false })}
      </span>
    </div>
  );
};

export default DigitalClock;
