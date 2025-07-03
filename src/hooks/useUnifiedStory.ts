
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { StorySegmentRow } from '@/types/stories';

interface StoryGenerationVariables {
  prompt?: string;
  storyId?: string;
  parentSegmentId?: string;
  choiceText?: string;
  storyMode?: string;
  skipImage?: boolean;
  skipAudio?: boolean;
}

interface EdgeFunctionResponse {
  success: boolean;
  data?: StorySegmentRow;
  error?: string;
  code?: string;
}

const generateSegment = async (variables: StoryGenerationVariables) => {
  console.log('=== generateSegment called ===');
  console.log('Variables:', variables);
  
  try {
    console.log('Invoking Supabase function with variables:', variables);
    
    const { data, error } = await supabase.functions.invoke('generate-story-segment', {
      body: {
        storyId: variables.storyId,
        prompt: variables.prompt || '',
        choiceText: variables.choiceText || null,
        parentSegmentId: variables.parentSegmentId || null,
        storyMode: variables.storyMode || 'fantasy',
        skipImage: variables.skipImage || false,
        skipAudio: variables.skipAudio || false
      }
    });

    console.log('=== Supabase function response ===');
    console.log('Data:', data);
    console.log('Error:', error);

    if (error) {
      console.error('Supabase function invocation error:', error);
      throw new Error(`Story generation failed: ${error.message}`);
    }

    if (!data) {
      console.error('No data returned from function');
      throw new Error('No data returned from story generation service');
    }

    console.log('=== Processing response data ===');
    console.log('Raw data:', JSON.stringify(data, null, 2));

    // Handle the new response format
    if (data && typeof data === 'object' && 'success' in data) {
      const response = data as EdgeFunctionResponse;
      console.log('Using structured response format');
      
      if (!response.success) {
        const errorMessage = response.error || 'Unknown error occurred';
        console.error(`Story generation failed:`, errorMessage);
        throw new Error(errorMessage);
      }

      if (!response.data) {
        console.error('No story data in successful response');
        throw new Error('No story data returned from generation');
      }

      console.log('=== Successful response ===');
      console.log('Story data:', response.data);
      return response.data as StorySegmentRow;
    }
    
    // Fallback for direct segment data
    console.log('Using direct segment data format');
    return data as StorySegmentRow;
    
  } catch (functionError: any) {
    console.error('=== Function invocation caught error ===');
    console.error('Error:', functionError);
    throw new Error(`Story generation failed: ${functionError.message}`);
  }
};

export const useUnifiedStory = ({ 
  onSuccess,
  onError
}: { 
  onSuccess?: (data: StorySegmentRow) => void;
  onError?: (error: Error) => void;
} = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (variables: StoryGenerationVariables) => generateSegment(variables),
    onSuccess: (data) => {
      console.log('Story generation successful:', data);
      
      // Invalidate queries to refetch data
      if (data.story_id) {
        queryClient.invalidateQueries({ queryKey: ['story', data.story_id] });
      }
      queryClient.invalidateQueries({ queryKey: ['stories'] });
      
      onSuccess?.(data);
    },
    onError: (error) => {
      console.error("Story generation failed:", error);
      onError?.(error as Error);
    }
  });

  return { mutation };
};
