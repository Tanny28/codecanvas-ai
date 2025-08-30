import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { ComponentData } from './CodeCanvas';
import { Sparkles, Send, MessageCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AIChatProps {
  onComponentsGenerated: (components: ComponentData[]) => void;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const AIChat = ({ onComponentsGenerated }: AIChatProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your AI assistant. I can help you generate website components and layouts. Just describe what you'd like to create!",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isGenerating) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsGenerating(true);

    try {
      // Determine if this is a layout request or component request
      const isLayoutRequest = inputValue.toLowerCase().includes('website') || 
                             inputValue.toLowerCase().includes('page') ||
                             inputValue.toLowerCase().includes('layout') ||
                             inputValue.toLowerCase().includes('site');

      const { data, error } = await supabase.functions.invoke('ai-generate', {
        body: {
          prompt: inputValue,
          type: isLayoutRequest ? 'layout' : 'component'
        }
      });

      if (error) throw error;

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: `I've generated ${isLayoutRequest ? 'a layout' : 'a component'} based on your request!`,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Handle the generated content
      if (data.type === 'layout') {
        try {
          const components = JSON.parse(data.content);
          onComponentsGenerated(components);
          toast({
            title: "Layout Generated!",
            description: "Your AI-generated layout has been added to the canvas",
          });
        } catch (parseError) {
          console.error('Error parsing layout JSON:', parseError);
          toast({
            title: "Generation Error",
            description: "Failed to parse the generated layout",
            variant: "destructive",
          });
        }
      } else {
        // For component generation, we'd need to integrate with the canvas differently
        toast({
          title: "Component Generated!",
          description: "Component code has been generated. Integration coming soon!",
        });
      }

    } catch (error) {
      console.error('AI generation error:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: "Sorry, I encountered an error while generating content. Please try again.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Generation Failed",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button className="btn-glow bg-gradient-to-r from-primary to-secondary">
          <MessageCircle className="w-4 h-4 mr-2" />
          AI Chat
        </Button>
      </DialogTrigger>
      <DialogContent className="glass border-glass-border max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="gradient-text flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            AI Assistant
          </DialogTitle>
        </DialogHeader>
        
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 min-h-96 max-h-96 p-4 glass rounded-lg">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <Card className={`max-w-[80%] p-3 ${
                message.role === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'glass border-glass-border'
              }`}>
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.role === 'user' 
                    ? 'text-primary-foreground/70' 
                    : 'text-muted-foreground'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </Card>
            </div>
          ))}
          
          {isGenerating && (
            <div className="flex justify-start">
              <Card className="glass border-glass-border p-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <p className="text-sm">Generating...</p>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="flex gap-2 pt-4 border-t border-glass-border">
          <Input
            placeholder="Describe what you want to create..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="glass-hover"
            disabled={isGenerating}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isGenerating}
            className="btn-glow bg-gradient-to-r from-primary to-secondary"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Quick Suggestions */}
        <div className="flex flex-wrap gap-2 pt-2">
          {[
            "Create a modern landing page",
            "Build a pricing section",
            "Design a contact form",
            "Make a portfolio gallery"
          ].map((suggestion) => (
            <Button
              key={suggestion}
              size="sm"
              variant="outline"
              onClick={() => setInputValue(suggestion)}
              className="text-xs glass-hover"
              disabled={isGenerating}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};