
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
    ? "bg-gray-950/40 px-2.5 py-1 rounded-lg border border-white/10 shadow-[inset_0_1px_4px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
    : "bg-gray-950/40 px-3 md:px-5 py-1.5 md:py-2 rounded-xl border border-white/10 shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)] backdrop-blur-2xl";

  const textClasses = size === 'small'
    ? "text-[#4ade80] font-mono text-base md:text-lg font-black tracking-tighter drop-shadow-[0_0_8px_rgba(74,222,128,0.4)] whitespace-nowrap animate-pulse-slow"
    : "text-[#4ade80] font-mono text-lg md:text-xl lg:text-2xl font-black tracking-tight drop-shadow-[0_0_12px_rgba(74,222,128,0.5)] whitespace-nowrap animate-pulse-slow";

  return (
    <div className={containerClasses}>
      <span className={textClasses}>
        {time.toLocaleTimeString('pt-BR', { hour12: false })}
      </span>
    </div>
  );
};

export default DigitalClock;
