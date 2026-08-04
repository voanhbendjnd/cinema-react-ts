export interface MovieSuggestion {
  id: number;
  title: string;
  genre: string;
}

export interface ChatResponseDTO {
  reply: string;
  movies?: MovieSuggestion[];
  fallback: boolean;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  movies?: MovieSuggestion[];
}

export const QUICK_REPLIES = ['Phim hot', 'Phim mới', 'Gợi ý phim hay'] as const;
