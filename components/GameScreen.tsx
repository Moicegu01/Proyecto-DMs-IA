import React from 'react';
import { Message } from '../types';
import { ChatColumn } from './ChatColumn';
import { PlayerInput } from './PlayerInput';

interface GameScreenProps {
  historyDM1: Message[];
  historyDM2: Message[];
  onSendAction: (action: string) => void;
  isLoading: boolean;
}

export function GameScreen({ historyDM1, historyDM2, onSendAction, isLoading }: GameScreenProps) {
  return (
    <div className="flex flex-col w-full h-full max-w-[1920px]">
      {/* Chat Area - Takes available space */}
      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 pb-4 min-h-0">
        <div className="h-full min-h-0">
            <ChatColumn title="DM 1 (Gemini 2.5 Flash)" messages={historyDM1} isLoading={isLoading} />
        </div>
        <div className="h-full min-h-0">
            <ChatColumn title="DM 2 (Gemini 2.5 Pro)" messages={historyDM2} isLoading={isLoading} />
        </div>
      </div>
      
      {/* Input Area - Fixed at bottom */}
      <div className="flex-none mt-2">
        <PlayerInput onSend={onSendAction} isLoading={isLoading} />
      </div>
    </div>
  );
}