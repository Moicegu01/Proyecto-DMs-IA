
import React, { useRef, useEffect } from 'react';
import { Message as MessageType } from '../types';
import { MessageComponent } from './Message';
import { LoadingSpinner } from './LoadingSpinner';

interface ChatColumnProps {
  title: string;
  messages: MessageType[];
  isLoading: boolean;
}

export function ChatColumn({ title, messages, isLoading }: ChatColumnProps) {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="glass-panel flex flex-col h-full overflow-hidden rounded-lg border-gray-800">
      <h3 className="text-lg md:text-xl font-bold text-[#c5a059] p-4 border-b border-gray-700 sticky top-0 bg-[#141414] z-10 text-center font-['Cinzel_Decorative'] shadow-md">
        {title}
      </h3>
      <div className="flex-grow p-4 overflow-y-auto scroll-smooth">
        <div className="space-y-6">
          {messages.map((msg, index) => (
            <MessageComponent key={index} message={msg} />
          ))}
          {isLoading && messages[messages.length - 1]?.role === 'user' && (
            <div className="flex justify-start animate-pulse">
                <div className="flex items-center space-x-3 p-4 text-[#8a0000]">
                    <LoadingSpinner />
                    <span className="italic font-serif text-gray-500">El destino se está tejiendo...</span>
                </div>
            </div>
          )}
          <div ref={endOfMessagesRef} />
        </div>
      </div>
    </div>
  );
}
