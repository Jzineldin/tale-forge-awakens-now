
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Home, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthProvider';

const StoryNavigationPrompt = () => {
  const { user } = useAuth();

  return (
    <Card className="mt-6 bg-slate-800/90 border-purple-600">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold text-white">
            What's Next?
          </h3>
          <p className="text-purple-200">
            {user 
              ? "Your story has been saved to your account."
              : "Your story has been saved locally in your browser."
            }
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/my-stories">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                {user ? (
                  <>
                    <BookOpen className="mr-2 h-4 w-4" />
                    View My Stories
                  </>
                ) : (
                  <>
                    <Clock className="mr-2 h-4 w-4" />
                    View My Stories (Local)
                  </>
                )}
              </Button>
            </Link>
            
            <Link to="/">
              <Button variant="outline" className="border-purple-600 text-purple-200 hover:bg-purple-600 hover:text-white">
                <Home className="mr-2 h-4 w-4" />
                Create Another Story
              </Button>
            </Link>
          </div>
          
          {!user && (
            <div className="pt-2 border-t border-purple-600/30">
              <p className="text-sm text-orange-200 mb-2">
                Want to keep your stories forever?
              </p>
              <Link to="/auth">
                <Button size="sm" variant="outline" className="border-orange-500 text-orange-200 hover:bg-orange-500 hover:text-white">
                  Sign Up Now
                </Button>
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StoryNavigationPrompt;
