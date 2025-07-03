
export interface StorySegment {
  id: string;
  story_id: string;
  segment_text: string;
  image_url?: string;
  audio_url?: string;
  choices: string[];
  is_end: boolean;
  image_generation_status: string;
  audio_generation_status: string;
  created_at: string;
  word_count?: number;
  audio_duration?: number;
  triggering_choice_text?: string;
}

export interface StoryDisplayState {
  currentStorySegment: StorySegment | null;
  allStorySegments: StorySegment[];
  segmentCount: number;
  maxSegments: number;
  isInitialLoad: boolean;
  skipImage: boolean;
  skipAudio: boolean;
  audioPlaying: boolean;
  error: string | null;
  showHistory: boolean;
  viewMode: 'create' | 'player';
}

export interface StoryDisplayActions {
  setSkipImage: (skip: boolean) => void;
  setSkipAudio: (skip: boolean) => void;
  setAudioPlaying: (playing: boolean) => void;
  setError: (error: string | null) => void;
  setShowHistory: (show: boolean) => void;
  setViewMode: (mode: 'create' | 'player') => void;
  setShowCostDialog: (show: boolean) => void;
  showConfirmation: (action: 'start' | 'choice', choice?: string) => void;
  confirmGeneration: () => Promise<void>;
  handleChoiceSelect: (choice: string) => void;
  handleFinishStory: () => Promise<void>;
}
