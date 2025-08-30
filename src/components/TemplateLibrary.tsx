import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTemplates } from '@/hooks/useTemplates';
import { ComponentData } from './CodeCanvas';
import { Layout, Sparkles, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TemplateLibraryProps {
  onLoadTemplate: (components: ComponentData[]) => void;
}

export const TemplateLibrary = ({ onLoadTemplate }: TemplateLibraryProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { templates, loading } = useTemplates();
  const { toast } = useToast();

  const categories = ['all', 'SaaS', 'Portfolio', 'E-commerce', 'Blog', 'Agency'];
  
  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const handleLoadTemplate = (components: ComponentData[]) => {
    onLoadTemplate(components);
    setDialogOpen(false);
    toast({
      title: "Template Loaded",
      description: "Template has been applied to your canvas",
    });
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="glass-hover">
          <Layout className="w-4 h-4 mr-2" />
          Templates
        </Button>
      </DialogTrigger>
      <DialogContent className="glass border-glass-border max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="gradient-text flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Template Library
          </DialogTitle>
        </DialogHeader>
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((category) => (
            <Button
              key={category}
              size="sm"
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="overflow-y-auto max-h-96">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-4" />
              <p className="text-muted-foreground">Loading templates...</p>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="text-center py-8">
              <Layout className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No templates found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="glass border-glass-border overflow-hidden hover:border-primary/50 transition-colors group">
                  {/* Preview Image */}
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 relative">
                    {template.preview_image ? (
                      <img 
                        src={template.preview_image} 
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Layout className="w-12 h-12 text-primary/50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        onClick={() => handleLoadTemplate(template.components)}
                        className="btn-glow bg-gradient-to-r from-primary to-secondary"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Use Template
                      </Button>
                    </div>
                  </div>
                  
                  {/* Template Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium">{template.name}</h3>
                      <Badge variant="secondary" className="glass">
                        {template.category}
                      </Badge>
                    </div>
                    {template.description && (
                      <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                    )}
                    <div className="flex items-center justify-between text-xs text-muted-foreground/70">
                      <span>{template.components.length} components</span>
                      <Button
                        size="sm"
                        onClick={() => handleLoadTemplate(template.components)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Use Template
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};