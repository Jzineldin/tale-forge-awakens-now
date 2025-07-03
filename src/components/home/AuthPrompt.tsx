
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import WaitlistSignup from '@/components/WaitlistSignup';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const AuthPrompt: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
      <Card className="border-amber-500/40 bg-black/30 backdrop-blur-md shadow-2xl magical-glow">
        <CardHeader className="text-center pb-4">
          <CardTitle className="flex items-center justify-center gap-2 text-amber-300 text-xl font-serif">
            <Sparkles className="h-6 w-6" />
            Start Creating Now
          </CardTitle>
          <CardDescription className="text-amber-100 text-lg leading-relaxed font-sans">
            Jump right in and start creating your personalized stories instantly. No account needed to get started!
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2 space-y-3">
          <Button 
            onClick={() => navigate('/create/genre')} 
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-lg font-medium border-0 transition-all duration-300 py-3 font-sans"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Create Your First Story
          </Button>
          
          <div className="text-center pt-2">
            <p className="text-amber-300/70 text-sm">
              ✨ Full story creation available locally
            </p>
          </div>
        </CardContent>
      </Card>

      <WaitlistSignup className="md:max-w-none" />
    </div>
  );
};

export default AuthPrompt;
