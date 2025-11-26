import React, { useEffect, useState } from 'react';
import { GameSession } from '../types';
import { getSavedGames, deleteGame } from '../services/storageService';

interface MainMenuProps {
  onCreateNew: () => void;
  onLoadGame: (game: GameSession) => void;
}

// Updated to a Dark Fantasy / D&D style image (Dark forest/mist or Dragon vibe)
const HERO_IMAGE_URL = "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=2070&auto=format&fit=crop";

export function MainMenu({ onCreateNew, onLoadGame }: MainMenuProps) {
  const [savedGames, setSavedGames] = useState<GameSession[]>([]);

  useEffect(() => {
    setSavedGames(getSavedGames());
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    // Detenemos la propagación para que no se abra la partida al borrarla
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('¿Estás seguro de que quieres borrar esta historia? No se podrá recuperar.')) {
      deleteGame(id);
      // Actualizamos el estado filtrando la partida eliminada para que desaparezca al instante
      setSavedGames(prevGames => prevGames.filter(game => game.id !== id));
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full w-full bg-[#050505]">
      {/* 
          Image Section 
          - Mobile: Banner top (h-64)
          - Desktop: Full height left split (w-1/2)
          - Object-cover ensures any resolution fits the container without stretching
      */}
      <div className="relative w-full h-64 md:h-full md:w-1/2 bg-black shrink-0 overflow-hidden">
         <img 
            src={HERO_IMAGE_URL} 
            alt="D&D Hero Art" 
            className="w-full h-full object-cover object-center opacity-90 transition-transform duration-700 hover:scale-105"
         />
         
         {/* Overlays for smooth transition to content */}
         {/* Desktop: Gradient from right (content) to left (transparent) */}
         <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/40 via-transparent to-transparent md:from-transparent md:via-black/20 md:to-[#050505]"></div>
         
         {/* Mobile: Gradient from bottom (content) to top */}
         <div className="absolute bottom-0 left-0 w-full h-24 md:h-32 bg-gradient-to-t from-[#050505] to-transparent"></div>
      </div>

      {/* Right Half: Content */}
      <div className="flex-grow w-full md:w-1/2 h-full overflow-y-auto p-6 md:p-12 flex flex-col relative z-10">
        {/* Main Title Section */}
        <div className="mb-8 md:mb-12 mt-2 md:mt-4">
             <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-5xl font-bold text-[#e0e0e0] font-['Cinzel_Decorative'] tracking-wider text-shadow">
                Comparador de DMs
                </h1>
             </div>
             <div className="flex items-center gap-4">
                <span className="px-2 py-1 bg-[#8a0000] text-xs font-bold rounded text-white tracking-widest">
                    IA EDITION
                </span>
                <div className="h-px bg-gray-800 flex-grow"></div>
             </div>
        </div>

        <div className="text-left mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl text-[#c5a059] font-serif italic mb-2 md:mb-4">Tus Crónicas</h2>
          <p className="text-gray-500 text-sm">
            Continúa donde lo dejaste o inicia una nueva leyenda.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:gap-6 w-full pb-10">
          {/* Card Nueva Partida */}
          <div 
            onClick={onCreateNew}
            className="group relative overflow-hidden rounded-lg border border-gray-700 bg-[#1a1a1a] p-4 md:p-6 cursor-pointer transition-all hover:border-[#8a0000] hover:shadow-[0_0_20px_rgba(138,0,0,0.3)]"
          >
            <div className="flex items-center gap-4 md:gap-6">
                 <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#0f0f0f] border border-gray-600 flex items-center justify-center group-hover:bg-[#8a0000] group-hover:border-[#a00000] group-hover:text-white transition-colors text-gray-400 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                 </div>
                 <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-200 group-hover:text-white font-['Cinzel_Decorative']">Nueva Aventura</h3>
                    <p className="text-xs text-gray-500 mt-1 group-hover:text-gray-400">Forja un nuevo destino desde cero</p>
                 </div>
            </div>
          </div>

          {/* Lista de Partidas */}
          {savedGames.length === 0 && (
            <div className="text-gray-600 text-center py-8 italic border border-dashed border-gray-800 rounded-lg text-sm md:text-base">
              No hay crónicas guardadas. Comienza tu viaje arriba.
            </div>
          )}

          {savedGames.map((game) => (
            <div 
              key={game.id}
              onClick={() => onLoadGame(game)}
              className="group relative overflow-hidden rounded-lg border border-gray-800 bg-black/40 p-4 md:p-6 cursor-pointer transition-all hover:border-[#c5a059] hover:bg-[#141414]"
            >
              <div className="flex justify-between items-start">
                <div className="flex-grow pr-4">
                    <h3 className="text-md md:text-lg font-bold text-[#c5a059] font-['Cinzel_Decorative'] group-hover:text-[#e0c070]">
                    {game.charClass} {game.charRace}
                    </h3>
                    <p className="text-[10px] md:text-xs text-gray-600 mt-1 mb-2 md:mb-3 uppercase tracking-widest font-bold">
                    {new Date(game.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs md:text-sm text-gray-400 line-clamp-2 italic font-serif border-l-2 border-gray-800 pl-3 group-hover:border-[#c5a059] transition-colors">
                    "{game.prologue}"
                    </p>
                </div>
                
                <button
                  onClick={(e) => handleDelete(game.id, e)}
                  className="relative z-10 text-gray-600 hover:text-red-500 transition-colors p-2 -mt-2 -mr-2 opacity-0 group-hover:opacity-100 focus:opacity-100"
                  title="Borrar partida"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 000-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}