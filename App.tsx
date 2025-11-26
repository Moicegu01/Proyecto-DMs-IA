import React, { useState, useCallback, useEffect } from 'react';
import { Chat } from '@google/genai';
import { MainMenu } from './components/MainMenu';
import { CreateGameScreen } from './components/CreateGameScreen';
import { GameScreen } from './components/GameScreen';
import { startChatSession } from './services/geminiService';
import { saveGame } from './services/storageService';
import { Message, GameSession, CharacterClass, CharacterRace } from './types';

type AppView = 'menu' | 'create' | 'playing';

export default function App() {
  const [view, setView] = useState<AppView>('menu');
  const [currentGame, setCurrentGame] = useState<GameSession | null>(null);
  
  const [chatDM1, setChatDM1] = useState<Chat | null>(null);
  const [chatDM2, setChatDM2] = useState<Chat | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // -- INITIALIZATION LOGIC --

  const initializeChats = (game: GameSession) => {
    try {
      const fullSystemPrompt = `Eres un Dungeon Master de D&D. El jugador es un ${game.charRace} ${game.charClass}. 
      Contexto de la aventura: ${game.prologue}.
      Tu objetivo es narrar una historia oscura, de acción y aventura. Sé descriptivo pero conciso.
      Mantén la coherencia con el historial proporcionado.`;

      const dm1Session = startChatSession('gemini-2.5-flash', fullSystemPrompt, game.historyDM1);
      const dm2Session = startChatSession('gemini-2.5-pro', fullSystemPrompt, game.historyDM2);
      
      setChatDM1(dm1Session);
      setChatDM2(dm2Session);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al inicializar los DMs.');
      console.error(e);
    }
  };

  // -- EVENT HANDLERS --

  const handleCreateNewGame = (charClass: CharacterClass, charRace: CharacterRace, prologue: string) => {
    const newGame: GameSession = {
      id: Date.now().toString(),
      createdAt: Date.now(),
      characterName: 'Héroe',
      charClass,
      charRace,
      prologue,
      historyDM1: [],
      historyDM2: []
    };
    
    setCurrentGame(newGame);
    saveGame(newGame); 
    initializeChats(newGame);
    setView('playing');
  };

  const handleLoadGame = (game: GameSession) => {
    setCurrentGame(game);
    initializeChats(game);
    setView('playing');
  };

  const handleBackToMenu = () => {
    setView('menu');
    setCurrentGame(null);
    setChatDM1(null);
    setChatDM2(null);
  };

  const handleSendAction = useCallback(async (action: string) => {
    if (!chatDM1 || !chatDM2 || isLoading || !currentGame) return;

    setIsLoading(true);
    setError(null);

    const userMessage: Message = {
      role: 'user',
      parts: [{ text: action }],
    };

    const updatedGame = { ...currentGame };
    updatedGame.historyDM1 = [...updatedGame.historyDM1, userMessage];
    updatedGame.historyDM2 = [...updatedGame.historyDM2, userMessage];
    setCurrentGame(updatedGame);

    try {
      const [responseDM1, responseDM2] = await Promise.all([
        chatDM1.sendMessage({ message: action }),
        chatDM2.sendMessage({ message: action })
      ]);

      const modelMessageDM1: Message = {
        role: 'model',
        parts: [{ text: responseDM1.text || "..." }],
      };
      const modelMessageDM2: Message = {
        role: 'model',
        parts: [{ text: responseDM2.text || "..." }],
      };

      updatedGame.historyDM1 = [...updatedGame.historyDM1, modelMessageDM1];
      updatedGame.historyDM2 = [...updatedGame.historyDM2, modelMessageDM2];
      
      setCurrentGame(updatedGame);
      saveGame(updatedGame);

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Ocurrió un error en la API.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [chatDM1, chatDM2, isLoading, currentGame]);

  // -- RENDER --

  return (
    <div className="min-h-screen flex flex-col bg-[#050505]">
      {/* Header is only shown when NOT in menu */}
      {view !== 'menu' && (
        <header className="p-4 md:p-6 flex justify-between items-center border-b border-[#333] bg-[#0a0a0a] relative shadow-lg z-50">
          <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-bold text-[#e0e0e0] font-['Cinzel_Decorative'] tracking-wider text-shadow">
              Comparador de DMs
              </h1>
              <span className="hidden md:inline-block px-2 py-1 bg-[#8a0000] text-[10px] font-bold rounded text-white tracking-widest">
                  IA EDITION
              </span>
          </div>
          
          {view === 'playing' && (
            <button
              onClick={handleBackToMenu}
              className="secondary-btn px-4 py-2 rounded-md text-sm transition-all duration-200"
            >
              Menú Principal
            </button>
          )}
        </header>
      )}
      
      {/* Main layout adjusts based on view */}
      <main className={`flex-grow flex flex-col relative overflow-hidden ${view === 'menu' ? 'h-screen' : 'p-4 md:p-6 items-center justify-center'}`}>
        
        {error && (
            <div className="absolute top-0 left-0 right-0 z-[60] bg-red-900/90 border-b border-red-600 text-white px-4 py-2 text-center">
                <strong className="font-bold font-serif">Fallo Crítico: </strong>
                <span className="inline">{error}</span>
            </div>
        )}

        {view === 'menu' && (
            <MainMenu 
                onCreateNew={() => setView('create')} 
                onLoadGame={handleLoadGame} 
            />
        )}

        {view === 'create' && (
             <div className="w-full max-w-6xl mx-auto">
                <CreateGameScreen 
                    onStart={handleCreateNewGame} 
                    onCancel={() => setView('menu')} 
                />
            </div>
        )}

        {view === 'playing' && currentGame && (
          <GameScreen
            historyDM1={currentGame.historyDM1}
            historyDM2={currentGame.historyDM2}
            onSendAction={handleSendAction}
            isLoading={isLoading}
          />
        )}
      </main>
    </div>
  );
}