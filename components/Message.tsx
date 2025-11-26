import React from 'react';
import { Message as MessageType } from '../types';

interface MessageProps {
  message: MessageType;
}

export const MessageComponent: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const messageText = message.parts.map(part => part.text).join('\n');
  
  const containerClasses = isUser ? 'flex justify-end' : 'flex justify-start';
  
  // Styles for Dark Fantasy
  const bubbleClasses = isUser
    ? 'bg-[#2a2a2a] border border-gray-600 rounded-tl-lg rounded-bl-lg rounded-br-lg text-gray-200' 
    : 'text-gray-300 border-l-2 border-[#8a0000] pl-4'; // Model looks like story text

  return (
    <div className={containerClasses}>
      <div className={`p-3 md:p-4 max-w-xl ${bubbleClasses}`}>
        <p className="whitespace-pre-wrap leading-relaxed font-serif text-sm md:text-base">
            {messageText}
        </p>
      </div>
    </div>
  );
};