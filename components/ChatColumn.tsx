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
  }, [messages, isLoading]);

  return (
    <div className="glass-panel flex flex-col h-full w-full overflow-hidden rounded-lg border-gray-800">
      {/* Fixed Header */}
      <div className="flex-none bg-[#141414] border-b border-gray-700 z-10 shadow-md">
         <h3 className="text-lg md:text-xl font-bold text-[#c5a059] p-4 text-center font-['Cinzel_Decorative']">
            {title}
         </h3>
      </div>
      
      {/* Scrollable Content */}
      <div className="flex-grow overflow-y-auto p-4 scroll-smooth">
        <div className="space-y-6">
          {messages.map((msg, index) => (
            <MessageComponent key={index} message={msg} />
          ))}
          {isLoading && (
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