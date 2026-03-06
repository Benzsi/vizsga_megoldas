// Tag típusa (amit a backend visszaad)
export interface Member {
  id: number;
  name: string;
  gender: 'M' | 'F' | null; // M = Férfi, F = Nő, null = nincs megadva
  birth_date: string;
  created_at: string; // Csatlakozási idő
  banned: boolean;
}

// Új tag létrehozásakor küldött adatok
export interface CreateMemberDto {
  name: string;
  gender?: 'M' | 'F'; // Opcionális
  birth_date: string;
}

// Backend validációs hiba formátuma
export interface ValidationError {
  message: string | string[]; // Lehet egy vagy több hibaüzenet
  error: string;
  statusCode: number;
}
