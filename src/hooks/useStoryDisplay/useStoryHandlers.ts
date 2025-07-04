import { useStoryGeneration } from '@/hooks/useStoryGeneration';
import { StorySegment } from './types';

interface UseStoryHandlersProps {
  maxSegments: number;
  segmentCount: number;
  currentStorySegment: StorySegment | null;
  genre: string;
  prompt: string;
  characterName: string;
  skipImage: boolean;
  storyGeneration: ReturnType<typeof useStoryGeneration>;
  showCostDialog: boolean;
  pendingAction: any;
  pendingParams: any;
  setShowCostDialog: (show: boolean) => void;
  setPendingAction: (action: any, params?: any) => void;
  setError: (error: string | null) => void;
  setCurrentStorySegment: (segment: StorySegment | null) => void;
  setAllStorySegments: (segments: StorySegment[] | ((prev: StorySegment[]) => StorySegment[])) => void;
  setSegmentCount: (count: number) => void;
  confirmGeneration: any;
  handleFinishStory: any;
}

export const useStoryHandlers = ({
  maxSegments,
  segmentCount,
  currentStorySegment,
  genre,
  prompt,
  characterName,
  skipImage,
  storyGeneration,
  pendingAction,
  pendingParams,
  setShowCostDialog,
  setPendingAction,
  setError,
  setCurrentStorySegment,
  setAllStorySegments,
  setSegmentCount,
  confirmGeneration,
  handleFinishStory,
}: UseStoryHandlersProps) => {

  const showConfirmation = (action: 'start' | 'choice', choice?: string) => {
    console.log('🎬 Showing confirmation dialog for action:', action, 'with choice:', choice);
    setPendingAction(action, { choice });
    setShowCostDialog(true);
  };

  const handleConfirmGeneration = async () => {
    console.log('🚀 Starting story generation confirmation...', { pendingAction, pendingParams });
    setShowCostDialog(false);
    await confirmGeneration(
      pendingAction,
      pendingParams,
      genre,
      prompt,
      characterName,
      skipImage,
      true, // Always skip audio during story creation
      currentStorySegment,
      setError,
      setCurrentStorySegment,
      setAllStorySegments,
      setSegmentCount,
      setPendingAction
    );
  };

  const handleChoiceSelect = (choice: string) => {
    if (segmentCount >= maxSegments) {
      handleFinishStory(currentStorySegment, setCurrentStorySegment, setAllStorySegments);
      return;
    }
    showConfirmation('choice', choice);
  };

  const handleStoryFinish = async () => {
    console.log('🏁 Finishing story...');
    await handleFinishStory(currentStorySegment, setCurrentStorySegment, setAllStorySegments);
  };

  return {
    showConfirmation,
    handleConfirmGeneration,
    handleChoiceSelect,
    handleStoryFinish,
  };
};