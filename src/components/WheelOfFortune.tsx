import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface WheelSegment {
  id: number;
  question: string;
  color: string;
  textColor: string;
}

interface WheelOfFortuneProps {
  onQuestionSelected: (question: string) => void;
  isSpinning: boolean;
  setIsSpinning: (spinning: boolean) => void;
  customQuestions?: string[];
}

const questions = [
  "What's your biggest fear about the future?",
  "Describe your most embarrassing moment.",
  "What's a secret you've never told anyone?",
  "What's your worst habit?",
  "What's the meanest thing you've ever done?",
  "What's your most irrational fear?",
  "What's the worst advice you've ever given?",
  "What's your most unpopular opinion?"
];

const wheelColors = [
  { color: 'bg-wheel-gold', textColor: 'text-primary-foreground' },
  { color: 'bg-wheel-emerald', textColor: 'text-white' },
  { color: 'bg-wheel-sapphire', textColor: 'text-white' },
  { color: 'bg-wheel-ruby', textColor: 'text-white' },
  { color: 'bg-wheel-purple', textColor: 'text-white' },
  { color: 'bg-wheel-orange', textColor: 'text-white' },
  { color: 'bg-wheel-teal', textColor: 'text-white' },
  { color: 'bg-wheel-magenta', textColor: 'text-white' }
];

export const WheelOfFortune: React.FC<WheelOfFortuneProps> = ({ 
  onQuestionSelected, 
  isSpinning, 
  setIsSpinning,
  customQuestions
}) => {
  const wheelRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);

  const activeQuestions = customQuestions && customQuestions.length >= 4 ? customQuestions : questions;
  
  const segments: WheelSegment[] = activeQuestions.map((question, index) => ({
    id: index,
    question,
    color: wheelColors[index % wheelColors.length].color,
    textColor: wheelColors[index % wheelColors.length].textColor
  }));

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    
    // Generate random spin (minimum 5 full rotations + random amount)
    const minSpins = 5;
    const randomSpin = Math.random() * 360;
    const totalRotation = rotation + (minSpins * 360) + randomSpin;
    
    setRotation(totalRotation);

    // Calculate which segment we land on
    const normalizedRotation = totalRotation % 360;
    const segmentAngle = 360 / segments.length;
    const selectedIndex = Math.floor((360 - normalizedRotation) / segmentAngle) % segments.length;
    
    // Show question after spin completes
    setTimeout(() => {
      setIsSpinning(false);
      onQuestionSelected(segments[selectedIndex].question);
    }, 3000);
  };

  const segmentAngle = 360 / segments.length;

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Wheel Container */}
      <div className="relative">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
          <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-primary animate-glow"></div>
        </div>
        
        {/* Wheel */}
        <div 
          ref={wheelRef}
          className={`relative w-80 h-80 rounded-full border-8 border-primary shadow-2xl transition-transform duration-[3000ms] ease-out ${
            isSpinning ? 'animate-wheel-spin' : ''
          }`}
          style={{ 
            transform: `rotate(${rotation}deg)`,
            boxShadow: '0 0 40px hsl(var(--primary))'
          }}
        >
          {segments.map((segment, index) => {
            const startAngle = index * segmentAngle;
            const endAngle = (index + 1) * segmentAngle;
            const midAngle = (startAngle + endAngle) / 2;
            
            return (
              <div
                key={segment.id}
                className={`absolute inset-0 ${segment.color}`}
                style={{
                  clipPath: `polygon(50% 50%, ${
                    50 + 45 * Math.cos((startAngle - 90) * Math.PI / 180)
                  }% ${
                    50 + 45 * Math.sin((startAngle - 90) * Math.PI / 180)
                  }%, ${
                    50 + 45 * Math.cos((endAngle - 90) * Math.PI / 180)
                  }% ${
                    50 + 45 * Math.sin((endAngle - 90) * Math.PI / 180)
                  }%)`,
                  borderRadius: '50%'
                }}
              >
                <div
                  className={`absolute text-xs font-semibold ${segment.textColor} whitespace-nowrap`}
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `translate(-50%, -50%) rotate(${midAngle}deg) translateY(-60px)`,
                    transformOrigin: 'center'
                  }}
                >
                  <span className="inline-block max-w-16 text-center leading-tight">
                    Q{index + 1}
                  </span>
                </div>
              </div>
            );
          })}
          
          {/* Center Hub */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-primary rounded-full border-4 border-primary-foreground flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
        </div>
      </div>

      {/* Spin Button */}
      <Button
        onClick={spinWheel}
        disabled={isSpinning}
        size="lg"
        className={`relative px-12 py-6 text-xl font-bold bg-gradient-to-r from-primary to-wheel-orange hover:from-wheel-orange hover:to-primary transition-all duration-300 ${
          isSpinning ? 'animate-pulse' : 'hover:scale-105 animate-glow'
        }`}
      >
        {isSpinning ? (
          <>
            <Sparkles className="w-6 h-6 mr-2 animate-spin" />
            Spinning...
          </>
        ) : (
          <>
            <Sparkles className="w-6 h-6 mr-2" />
            SPIN THE WHEEL!
          </>
        )}
      </Button>
    </div>
  );
};