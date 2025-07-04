
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import InlineStoryCreation from '@/components/story-creation/InlineStoryCreation';

const StoryCreation: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showInlineCreation, setShowInlineCreation] = useState(true);
  
  const prompt = searchParams.get('prompt');
  const mode = searchParams.get('mode') || searchParams.get('genre'); // Accept both mode and genre

  const handleExit = () => {
    // Clear URL parameters when exiting to prevent auto-generation on return
    setSearchParams({});
    // Go back to home instead of creating new routes
    navigate('/', { replace: true });
  };

  // Clear parameters if user navigates back after completing a story
  useEffect(() => {
    const handlePopState = () => {
      // Clear parameters when user uses browser back button
      if (searchParams.has('prompt') || searchParams.has('mode') || searchParams.has('genre')) {
        setSearchParams({});
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [searchParams, setSearchParams]);

  // If we have prompt and mode, show inline creation
  if (prompt && mode && showInlineCreation) {
    return (
      <InlineStoryCreation onExit={handleExit} />
    );
  }

  // Fallback - redirect to genre selection if no parameters
  if (!prompt || !mode) {
    useEffect(() => {
      navigate('/create/genre', { replace: true });
    }, [navigate]);
    return null;
  }

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
        <p className="text-white">Loading your story creation...</p>
      </div>
    </div>
  );
};

export default StoryCreation;
