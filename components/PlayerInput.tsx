
import React, { useState } from 'react';

interface PlayerInputProps {
  onSend: (action: string) => void;
  isLoading: boolean;
}

export function PlayerInput({ onSend, isLoading }: PlayerInputProps) {
  const [action, setAction] = useState('');

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

  return (
    <div className="pt-4 border-t border-gray-800 flex items-center space-x-2 md:space-x-4 bg-black/20 p-4 rounded-lg">
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
        className="action-btn font-bold py-3 px-6 rounded-md shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm md:text-base"
      >
        {isLoading ? '...' : 'Actuar'}
      </button>
    </div>
  );
}
