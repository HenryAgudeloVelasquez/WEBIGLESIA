export type EventCategory = 'culto' | 'familia' | 'jovenes' | 'ninos' | 'oracion' | 'especial';

export interface ChurchEvent {
  id: string;
  title: string;
  subtitle: string;
  date: string;       // Formato ISO o legible
  time: string;
  location: string;
  category: EventCategory;
  description: string;
  badge: string;
  image?: string;
  featured?: boolean;
}

export interface Sermon {
  id: string;
  title: string;
  preacher: string;
  series: string;
  date: string;
  passage: string;
  duration: string;
  summary: string;
  youtubeId?: string;
  audioUrl?: string;
  notesUrl?: string;
  tags: string[];
}

export interface Devotional {
  id: string;
  title: string;
  author: string;
  date: string;
  keyVerse: string;
  verseReference: string;
  reflection: string[];
  prayer: string;
}

export interface ChoirSong {
  id: string;
  title: string;
  author: string;
  tempo: string;
  key: string;
  category: 'adoracion' | 'alabanza' | 'especial';
  audioSample?: string;
  lyrics: string;
  chords: string;
}

export interface MinistryService {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  schedule: string;
  description: string;
  benefits: string[];
  contactAction: string;
}

export interface BibleTriviaQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  bibleVerse: string;
}

export interface KidsStory {
  id: string;
  title: string;
  bibleReference: string;
  moral: string;
  summary: string;
  icon: string;
}

export interface MemoryVerse {
  id: number;
  verse: string;
  reference: string;
  level: 'Fácil' | 'Intermedio' | 'Campeón';
  hint: string;
}
