import React, { useState, useCallback, useEffect } from 'react';
import { Chat } from '@google/genai';
import { MainMenu } from './components/MainMenu';
import { CreateGameScreen } from './components/CreateGameScreen';
import { GameScreen } from './components/GameScreen';
import { startChatSession } from './services/geminiService';
import { saveGame, downloadGameLogs } from './services/storageService';
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

  const createChatInstances = (game: GameSession) => {
    const fullSystemPrompt = `Eres un Dungeon Master de D&D. El jugador es un ${game.charRace} ${game.charClass}. 
      Contexto de la aventura: ${game.prologue}.
      Tu objetivo es narrar una historia oscura, de acción y aventura. Sé descriptivo pero conciso.
      Mantén la coherencia con el historial proporcionado.`;

    const dm1 = startChatSession('gemini-2.5-flash', fullSystemPrompt, game.historyDM1);
    const dm2 = startChatSession('gemini-2.5-pro', fullSystemPrompt, game.historyDM2);
    
    return { dm1, dm2 };
  };

  // -- EVENT HANDLERS --

  const handleCreateNewGame = async (charClass: CharacterClass, charRace: CharacterRace, prologue: string) => {
    setIsLoading(true);
    setError(null);

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
    
    // 1. Create instances
    let dm1, dm2;
    try {
      const chats = createChatInstances(newGame);
      dm1 = chats.dm1;
      dm2 = chats.dm2;
      setChatDM1(dm1);
      setChatDM2(dm2);
      setCurrentGame(newGame);
      // Switch view immediately so user sees loading state
      setView('playing');
    } catch (e) {
      setError("Error al inicializar la IA.");
      setIsLoading(false);
      return;
    }

    // 2. Trigger Initial Narration automatically
    const startPrompt = "Comienza la aventura narrando la escena inicial basada en el prólogo.";
    
    try {
      const [responseDM1, responseDM2] = await Promise.all([
        dm1.sendMessage({ message: startPrompt }),
        dm2.sendMessage({ message: startPrompt })
      ]);

      const modelMessageDM1: Message = {
        role: 'model',
        parts: [{ text: responseDM1.text || "..." }],
      };
      const modelMessageDM2: Message = {
        role: 'model',
        parts: [{ text: responseDM2.text || "..." }],
      };

      // Update game history with the intro
      const updatedGame = { ...newGame };
      updatedGame.historyDM1 = [modelMessageDM1];
      updatedGame.historyDM2 = [modelMessageDM2];
      
      setCurrentGame(updatedGame);
      saveGame(updatedGame);
    } catch (e) {
      setError("Error generando la introducción: " + (e instanceof Error ? e.message : "Desconocido"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadGame = (game: GameSession) => {
    try {
        const { dm1, dm2 } = createChatInstances(game);
        setChatDM1(dm1);
        setChatDM2(dm2);
        setCurrentGame(game);
        setView('playing');
    } catch (e) {
        setError("Error al cargar la partida.");
    }
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
              <h1 className="text-xl md:text-3xl font-bold text-[#e0e0e0] font-['Cinzel_Decorative'] tracking-wider text-shadow">
              Comparador de DMs
              </h1>
              <span className="hidden md:inline-block px-2 py-1 bg-[#8a0000] text-[10px] font-bold rounded text-white tracking-widest">
                  IA EDITION
              </span>
          </div>
          
          {view === 'playing' && currentGame && (
            <div className="flex gap-2 md:gap-4">
                <button
                onClick={() => downloadGameLogs(currentGame)}
                className="secondary-btn px-3 py-1 md:px-4 md:py-2 rounded-md text-xs md:text-sm transition-all duration-200 border-dashed border-gray-600 hover:border-gray-400"
                title="Descargar registro de la partida para análisis"
                >
                Exportar Historial
                </button>
                <button
                onClick={handleBackToMenu}
                className="secondary-btn px-3 py-1 md:px-4 md:py-2 rounded-md text-xs md:text-sm transition-all duration-200"
                >
                Menú Principal
                </button>
            </div>
          )}
        </header>
      )}
      
      {/* Main layout adjusts based on view */}
      <main className={`flex-grow flex flex-col relative overflow-hidden ${view === 'menu' ? 'h-screen' : 'h-[calc(100vh-70px)] md:h-[calc(100vh-80px)] p-2 md:p-6 items-center justify-center'}`}>
        
        {error && (
            <div className="absolute top-0 left-0 right-0 z-[60] bg-red-900/90 border-b border-red-600 text-white px-4 py-2 text-center text-sm md:text-base">
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