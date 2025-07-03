
import { useState, useCallback } from 'react';
import { useUnifiedStory } from '@/hooks/useUnifiedStory';
import { useStoryDatabase } from '@/hooks/story-game/useStoryDatabase';
import { StorySegmentRow } from '@/types/stories';
import { toast } from 'sonner';

export const useUnifiedStoryGame = () => {
  const [gameState, setGameState] = useState<'not_started' | 'playing' | 'completed'>('not_started');
  const [currentSegment, setCurrentSegment] = useState<StorySegmentRow | null>(null);
  const [storyHistory, setStoryHistory] = useState<StorySegmentRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFinishingStory, setIsFinishingStory] = useState(false);
  const [isStoryCompleted, setIsStoryCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { createStoryInDatabase, finishStoryInDatabase } = useStoryDatabase();

  const handleSuccessfulGeneration = useCallback((data: StorySegmentRow) => {
    console.log('🎉 Story generation successful:', data);
    setCurrentSegment(data);
    setStoryHistory(prev => [...prev, data]);
    setGameState('playing');
    setIsLoading(false);
    setError(null);
    
    if (data.is_end) {
      console.log('📖 Story marked as ended');
      setGameState('completed');
      setIsStoryCompleted(true);
    }
    
    toast.success('Story segment generated successfully!');
  }, []);

  const handleGenerationError = useCallback((error: Error) => {
    console.error('❌ Story generation failed:', error);
    setIsLoading(false);
    setError(error.message);
    toast.error(`Story generation failed: ${error.message}`);
  }, []);

  const { mutation } = useUnifiedStory({
    onSuccess: handleSuccessfulGeneration,
    onError: handleGenerationError
  });

  const handleStartStory = useCallback(async (
    prompt: string, 
    storyMode: string, 
    options: { skipImage?: boolean; skipAudio?: boolean } = {}
  ) => {
    console.log('🚀 handleStartStory called with:', { prompt, storyMode, options });
    
    try {
      setIsLoading(true);
      setError(null);
      setGameState('playing');
      
      // Create a new story first
      const story = await createStoryInDatabase(
        prompt.slice(0, 100), // Use first 100 chars as title
        prompt,
        storyMode
      );
      
      console.log('✅ Story created, generating first segment...');
      
      // Generate the first segment
      mutation.mutate({
        prompt,
        storyMode,
        storyId: story.id,
        skipImage: options.skipImage,
        skipAudio: options.skipAudio
      });
      
    } catch (err) {
      console.error('❌ Error in handleStartStory:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to start story';
      handleGenerationError(new Error(errorMessage));
    }
  }, [mutation, createStoryInDatabase, handleGenerationError]);

  const handleSelectChoice = useCallback(async (
    choice: string, 
    options: { skipImage?: boolean; skipAudio?: boolean } = {}
  ) => {
    console.log('🎯 handleSelectChoice called with:', { choice, options });
    
    if (!currentSegment) {
      console.error('❌ No current segment to continue from');
      toast.error('No current segment to continue from');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      mutation.mutate({
        storyId: currentSegment.story_id,
        parentSegmentId: currentSegment.id,
        choiceText: choice,
        skipImage: options.skipImage,
        skipAudio: options.skipAudio
      });
      
    } catch (err) {
      console.error('❌ Error selecting choice:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to continue story';
      handleGenerationError(new Error(errorMessage));
    }
  }, [currentSegment, mutation, handleGenerationError]);

  const handleFinishStory = useCallback(async () => {
    if (!currentSegment) {
      toast.error('No story to finish');
      return;
    }
    
    try {
      setIsFinishingStory(true);
      
      await finishStoryInDatabase(currentSegment.id, currentSegment.story_id);
      
      setGameState('completed');
      setIsStoryCompleted(true);
      toast.success('Story completed successfully!');
      
    } catch (err) {
      console.error('Error finishing story:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to finish story';
      toast.error(`Failed to finish story: ${errorMessage}`);
    } finally {
      setIsFinishingStory(false);
    }
  }, [currentSegment, finishStoryInDatabase]);

  const handleRestart = useCallback(() => {
    console.log('🔄 Restarting story game');
    setGameState('not_started');
    setCurrentSegment(null);
    setStoryHistory([]);
    setIsLoading(false);
    setIsFinishingStory(false);
    setIsStoryCompleted(false);
    setError(null);
  }, []);

  return {
    // State
    gameState,
    currentSegment,
    storyHistory,
    isLoading: isLoading || mutation.isPending,
    isFinishingStory,
    isStoryCompleted,
    error,
    
    // Actions
    handleStartStory,
    handleSelectChoice,
    handleFinishStory,
    handleRestart
  };
};
