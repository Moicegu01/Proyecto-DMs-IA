
import { GameSession } from '../types';

const STORAGE_KEY = 'dm_comparator_sessions';

export function getSavedGames(): GameSession[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error("Error parsing saved games", e);
    return [];
  }
}

export function saveGame(game: GameSession): void {
  const games = getSavedGames();
  const index = games.findIndex(g => g.id === game.id);
  
  if (index >= 0) {
    games[index] = game;
  } else {
    games.push(game);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
}

export function deleteGame(gameId: string): void {
  const games = getSavedGames();
  const newGames = games.filter(g => g.id !== gameId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newGames));
}

export function downloadGameLogs(game: GameSession): void {
  const dateStr = new Date(game.createdAt).toLocaleString();
  let content = `LOG DE PARTIDA - COMPARADOR DE DMs\n`;
  content += `----------------------------------\n`;
  content += `ID Partida: ${game.id}\n`;
  content += `Fecha de Creación: ${dateStr}\n`;
  content += `Personaje: ${game.charClass} ${game.charRace}\n`;
  content += `Prólogo:\n${game.prologue}\n\n`;

  content += `==========================================\n`;
  content += `HISTORIAL DM 1 (Gemini 2.5 Flash)\n`;
  content += `==========================================\n\n`;

  game.historyDM1.forEach((msg, i) => {
    const role = msg.role === 'user' ? 'JUGADOR' : 'DM';
    const text = msg.parts.map(p => p.text).join('\n');
    content += `[Turno ${Math.floor(i/2) + 1}] [${role}]:\n${text}\n\n------------------\n\n`;
  });

  content += `\n\n==========================================\n`;
  content += `HISTORIAL DM 2 (Gemini 2.5 Pro)\n`;
  content += `==========================================\n\n`;

  game.historyDM2.forEach((msg, i) => {
    const role = msg.role === 'user' ? 'JUGADOR' : 'DM';
    const text = msg.parts.map(p => p.text).join('\n');
    content += `[Turno ${Math.floor(i/2) + 1}] [${role}]:\n${text}\n\n------------------\n\n`;
  });

  // Crear Blob y descargar
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `partida_${game.charClass}_${game.charRace}_${game.id}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
