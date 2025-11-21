
export type Role = 'user' | 'model';

export interface MessagePart {
  text: string;
}

export interface Message {
  role: Role;
  parts: MessagePart[];
}

export type CharacterClass = 'Guerrero' | 'Mago' | 'Pícaro' | 'Clérigo';
export type CharacterRace = 'Humano' | 'Elfo' | 'Enano' | 'Orco';

export interface GameSession {
  id: string;
  createdAt: number;
  characterName: string; // Usaremos un nombre genérico o input si se desea, por defecto "Héroe"
  charClass: CharacterClass;
  charRace: CharacterRace;
  prologue: string;
  historyDM1: Message[];
  historyDM2: Message[];
}
