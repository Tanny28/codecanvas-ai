import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import CodeCanvas from "@/components/CodeCanvas";
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <LogIn className="w-12 h-12 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-4">Welcome to CodeCanvas AI</h1>
          <p className="text-muted-foreground mb-8 max-w-md">
            Create stunning websites with the power of AI. Sign in to start building your dream project.
          </p>
          <Button 
            onClick={() => navigate('/auth')}
            className="btn-glow bg-gradient-to-r from-primary to-secondary"
          >
            Get Started
          </Button>
        </div>
      </div>
    );
  }

  return <CodeCanvas />;
};

export default Index;
