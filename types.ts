export interface Team {
  id: string;
  name: string;
  people: Person[];
}

export interface Season {
    id: string;
    name: string;
    teams: Team[];
}

export enum PersonRole {
  Player = 'Jugador',
  Coach = 'Entrenador',
}

export interface Person {
  id: string;
  name: string;
  role: PersonRole;
}

export enum AttendanceStatus {
  Present = 'Presente',
  Absent = 'Ausente',
  Justified = 'Justificado',
}

export interface AttendanceRecord {
  [date: string]: {
    [personId: string]: AttendanceStatus;
  };
}

export enum ChatAuthor {
  User = 'user',
  Bot = 'bot',
}

export interface ChatMessage {
  author: ChatAuthor;
  text: string;
}

export type Page = 'attendance' | 'statistics' | 'settings';

export enum UserRole {
  Admin = 'admin',
  Coach = 'coach',
}

export interface User {
  id: string;
  username: string;
  password: string; 
  role: UserRole;
}