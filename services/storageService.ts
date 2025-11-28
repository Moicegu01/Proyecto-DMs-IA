
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
