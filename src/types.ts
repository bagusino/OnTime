// src/types.ts

export type Task = {
  id: string;
  title: string;
  duration: number; // en segundos
  isActive: boolean;
  startTime: Date;
};

