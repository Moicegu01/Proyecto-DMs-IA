import React, { useState, useRef, useEffect } from 'react';

interface PlayerInputProps {
  onSend: (action: string) => void;
  isLoading: boolean;
}

const DICE_TYPES = [4, 6, 8, 10, 12, 20];

export function PlayerInput({ onSend, isLoading }: PlayerInputProps) {
  const [action, setAction] = useState('');
  const [showDiceMenu, setShowDiceMenu] = useState(false);
  const diceMenuRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (action.trim() && !isLoading) {
      onSend(action.trim());
      setAction('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const rollDie = (sides: number) => {
    const result = Math.floor(Math.random() * sides) + 1;
    const rollText = ` [Tirada d${sides}: ${result}]`;
    setAction((prev) => prev + rollText);
    setShowDiceMenu(false);
  };

  // Close dice menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (diceMenuRef.current && !diceMenuRef.current.contains(event.target as Node)) {
        setShowDiceMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="pt-2 border-t border-gray-800 flex items-center gap-4 bg-black/40 p-4 rounded-lg relative">
      <input
        type="text"
        value={action}
        onChange={(e) => setAction(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Describe tu acción heroica..."
        className="flex-grow bg-[#0f0f0f] border border-gray-700 rounded-md p-3 text-gray-200 focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059] focus:outline-none transition-colors placeholder-gray-600"
        disabled={isLoading}
      />
      
      <button
        onClick={handleSend}
        disabled={isLoading || !action.trim()}
        className="action-btn font-bold py-3 px-6 rounded-md shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm md:text-base whitespace-nowrap"
      >
        {isLoading ? '...' : 'Actuar'}
      </button>

      <div className="h-8 w-px bg-gray-700 mx-1"></div>

      {/* Dice Button & Menu */}
      <div className="relative" ref={diceMenuRef}>
        <button 
            onClick={() => setShowDiceMenu(!showDiceMenu)}
            disabled={isLoading}
            className="p-3 rounded-md bg-[#1a1a1a] border border-gray-700 text-[#c5a059] hover:bg-[#2a2a2a] hover:border-[#c5a059] transition-all"
            title="Lanzar Dados"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l-9.5 5.5v11L12 24l9.5-5.5v-11L12 2zm0 2.3l6.5 3.7-6.5 3.8-6.5-3.8L12 4.3zM4.5 9.2l6.5 3.8v7.6l-6.5-3.8V9.2zm8.5 11.4v-7.6l6.5-3.8v7.6l-6.5 3.8z" />
            </svg>
        </button>

        {showDiceMenu && (
            <div className="absolute bottom-full right-0 mb-4 bg-[#141414] border border-[#c5a059] rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.8)] p-2 grid grid-cols-3 gap-2 w-48 z-50">
                {DICE_TYPES.map(sides => (
                    <button
                        key={sides}
                        onClick={() => rollDie(sides)}
                        className="p-2 text-center hover:bg-[#8a0000] rounded text-gray-200 font-bold font-serif border border-gray-800 hover:border-red-500 transition-colors"
                    >
                        d{sides}
                    </button>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}