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
    <div className="flex flex-col flex-grow h-full max-h-[calc(100vh-160px)] md:max-h-[calc(100vh-180px)]">
      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 py-6 px-4">
        <ChatColumn title="DM 1 (Gemini 2.5 Flash)" messages={historyDM1} isLoading={isLoading} />
        <ChatColumn title="DM 2 (Gemini 2.5 Pro)" messages={historyDM2} isLoading={isLoading} />
      </div>
      <div className="mt-4 md:mt-6">
        <PlayerInput onSend={onSendAction} isLoading={isLoading} />
      </div>
    </div>
  );
}