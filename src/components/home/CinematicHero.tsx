
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHeaderVisibility } from '@/context/HeaderVisibilityContext';

const CinematicHero: React.FC = () => {
  const navigate = useNavigate();
  const { showHeader } = useHeaderVisibility();

  const handleCreateAdventure = () => {
    showHeader();
    navigate('/adventure');
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Full-screen Video Background */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        style={{ filter: 'contrast(1.1) saturate(1.2)' }}
      >
        <source src="https://cdn.midjourney.com/video/e44f0881-cc76-4255-9301-0f3bb45896de/3.mp4" type="video/mp4" />
      </video>

      {/* Main Content Overlay - No dark background */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center items-center px-4">
        {/* Transparent Container with only blur effect */}
        <div className="backdrop-blur-sm bg-transparent rounded-2xl p-8 md:p-12 border border-white/20 shadow-2xl max-w-5xl mx-auto">
          {/* Tale Forge Title */}
          <div className="text-center mb-16">
            <h1 className="tale-forge-title text-6xl md:text-8xl lg:text-9xl font-bold font-serif text-white mb-8 leading-tight"
                style={{
                  textShadow: '0 0 30px rgba(0, 0, 0, 0.9), 0 0 60px rgba(0, 0, 0, 0.7), 4px 4px 12px rgba(0, 0, 0, 0.95), -2px -2px 8px rgba(0, 0, 0, 0.8)'
                }}>
              Tale Forge
            </h1>
            
            {/* Simple Tagline */}
            <p className="text-2xl md:text-4xl text-white max-w-4xl mx-auto leading-relaxed mb-8"
               style={{
                 textShadow: '0 0 20px rgba(0, 0, 0, 0.9), 0 0 40px rgba(0, 0, 0, 0.7), 3px 3px 8px rgba(0, 0, 0, 0.95), -1px -1px 6px rgba(0, 0, 0, 0.8)'
               }}>
              Where imagination meets
              <span className="font-cursive text-amber-300 mx-2" style={{fontStyle: 'italic'}}>
                infinite possibilities
              </span>
            </p>
          </div>

          {/* Simple CTA */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              onClick={handleCreateAdventure}
              className="group px-8 py-4 text-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
              Create Your Adventure
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CinematicHero;
