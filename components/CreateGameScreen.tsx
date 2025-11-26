import React, { useState } from 'react';
import { CharacterClass, CharacterRace } from '../types';

interface CreateGameScreenProps {
  onStart: (charClass: CharacterClass, charRace: CharacterRace, prologue: string) => void;
  onCancel: () => void;
}

const CLASSES: CharacterClass[] = ['Guerrero', 'Mago', 'Pícaro', 'Clérigo'];
const RACES: CharacterRace[] = ['Humano', 'Elfo', 'Enano', 'Orco'];

const DEFAULT_PROMPT = "La aventura comienza en una mazmorra húmeda. Nuestro héroe despierta sin memoria de cómo llegó allí, solo con su equipo básico y una antorcha que parpadea...";

export function CreateGameScreen({ onStart, onCancel }: CreateGameScreenProps) {
  const [selectedClass, setSelectedClass] = useState<CharacterClass>('Guerrero');
  const [selectedRace, setSelectedRace] = useState<CharacterRace>('Humano');
  const [prologue, setPrologue] = useState(DEFAULT_PROMPT);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prologue.trim()) {
      onStart(selectedClass, selectedRace, prologue.trim());
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full">
      {/* Left Column: Controls */}
      <div className="flex-1 glass-panel p-8 rounded-lg">
        <h2 className="text-3xl font-bold text-[#c5a059] mb-6 font-['Cinzel_Decorative'] border-b border-gray-800 pb-4">
          Creación de Personaje
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Class Selection */}
          <div>
            <label className="block text-gray-400 text-sm font-bold mb-2 uppercase tracking-wider">Clase</label>
            <div className="grid grid-cols-2 gap-2">
              {CLASSES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedClass(c)}
                  className={`p-3 text-center rounded border transition-all ${
                    selectedClass === c 
                      ? 'bg-[#8a0000] border-[#a00000] text-white shadow-[0_0_10px_rgba(138,0,0,0.5)]' 
                      : 'bg-[#1a1a1a] border-gray-700 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Race Selection */}
          <div>
            <label className="block text-gray-400 text-sm font-bold mb-2 uppercase tracking-wider">Raza</label>
            <div className="grid grid-cols-2 gap-2">
              {RACES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setSelectedRace(r)}
                  className={`p-3 text-center rounded border transition-all ${
                    selectedRace === r 
                      ? 'bg-[#c5a059] border-[#d4af37] text-black font-bold shadow-[0_0_10px_rgba(197,160,89,0.5)]' 
                      : 'bg-[#1a1a1a] border-gray-700 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Prologue */}
          <div>
            <label className="block text-[#c5a059] text-sm font-bold mb-2 uppercase tracking-wider mt-8">
              Crea tu Historia (Prólogo)
            </label>
            <textarea
              value={prologue}
              onChange={(e) => setPrologue(e.target.value)}
              className="w-full h-40 p-4 bg-[#0a0a0a] border border-gray-700 rounded text-gray-300 focus:border-[#8a0000] focus:ring-1 focus:ring-[#8a0000] focus:outline-none resize-none"
              placeholder="Describe el inicio de la aventura..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 rounded text-gray-400 border border-gray-700 hover:bg-gray-800 transition-colors font-serif"
            >
              Volver
            </button>
            <button
              type="submit"
              disabled={!prologue.trim()}
              className="flex-[2] action-btn py-3 rounded font-bold font-serif uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Comenzar Aventura
            </button>
          </div>
        </form>
      </div>

      {/* Right Column: Image Placeholder */}
      <div className="hidden lg:flex flex-1 items-center justify-center">
        <div className="glass-panel p-2 rounded-lg w-full max-w-md aspect-[3/4] relative flex items-center justify-center bg-black/50 border-2 border-[#1a1a1a]">
            <div className="absolute inset-0 border-2 border-[#c5a059]/30 m-4 rounded-sm pointer-events-none"></div>
            <div className="text-center space-y-4">
                <div className="w-32 h-32 mx-auto bg-gray-900 rounded-full flex items-center justify-center border-2 border-dashed border-gray-700">
                    <span className="text-4xl text-gray-700">?</span>
                </div>
                <div>
                    <h3 className="text-2xl text-[#c5a059] font-['Cinzel_Decorative']">{selectedClass}</h3>
                    <p className="text-gray-500 uppercase tracking-widest text-sm">{selectedRace}</p>
                </div>
                <p className="text-gray-600 text-xs max-w-xs mx-auto italic px-8">
                    (Aquí aparecerá la imagen de tu personaje en el futuro)
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}