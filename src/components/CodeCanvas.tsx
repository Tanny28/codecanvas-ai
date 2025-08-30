import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ComponentLibrary } from './ComponentLibrary';
import { CanvasArea } from './CanvasArea';
import { PreviewPanel } from './PreviewPanel';
import { CodePanel } from './CodePanel';
import { ProjectManager } from './ProjectManager';
import { TemplateLibrary } from './TemplateLibrary';
import { AIChat } from './AIChat';
import { useAuth } from '@/hooks/useAuth';
import { Sparkles, Code, Eye, Wand2, Download, Play, LogOut, User } from 'lucide-react';

export interface ComponentData {
  id: string;
  type: string;
  name: string;
  props: Record<string, any>;
  position: { x: number; y: number };
}

const CodeCanvas = () => {
  const [components, setComponents] = useState<ComponentData[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'design' | 'code' | 'preview'>('design');
  const [isGenerating, setIsGenerating] = useState(false);
  const { user, signOut } = useAuth();

  const addComponent = (type: string, position: { x: number; y: number }) => {
    const newComponent: ComponentData = {
      id: `${type}-${Date.now()}`,
      type,
      name: type,
      props: getDefaultProps(type),
      position
    };
    setComponents([...components, newComponent]);
  };

  const updateComponent = (id: string, updates: Partial<ComponentData>) => {
    setComponents(components.map(comp => 
      comp.id === id ? { ...comp, ...updates } : comp
    ));
  };

  const deleteComponent = (id: string) => {
    setComponents(components.filter(comp => comp.id !== id));
    if (selectedComponent === id) {
      setSelectedComponent(null);
    }
  };

  const generateWithAI = () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  const loadProject = (projectComponents: ComponentData[]) => {
    setComponents(projectComponents);
    setSelectedComponent(null);
  };

  const loadTemplate = (templateComponents: ComponentData[]) => {
    setComponents(templateComponents);
    setSelectedComponent(null);
  };

  const handleAIGeneration = (generatedComponents: ComponentData[]) => {
    setComponents(prev => [...prev, ...generatedComponents]);
  };

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="glass border-b border-glass-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">CodeCanvas AI</h1>
              <p className="text-xs text-muted-foreground">From Vision to Deployment</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Project Management */}
          <div className="flex items-center gap-2">
            <ProjectManager components={components} onLoadProject={loadProject} />
            <TemplateLibrary onLoadTemplate={loadTemplate} />
          </div>

          {/* View Toggle */}
          <div className="glass rounded-lg p-1 flex items-center gap-1">
            <Button
              variant={activeView === 'design' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveView('design')}
              className="text-xs"
            >
              <Wand2 className="w-4 h-4 mr-1" />
              Design
            </Button>
            <Button
              variant={activeView === 'code' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveView('code')}
              className="text-xs"
            >
              <Code className="w-4 h-4 mr-1" />
              Code
            </Button>
            <Button
              variant={activeView === 'preview' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveView('preview')}
              className="text-xs"
            >
              <Eye className="w-4 h-4 mr-1" />
              Preview
            </Button>
          </div>

          <AIChat onComponentsGenerated={handleAIGeneration} />

          <Button variant="outline" className="glass-hover">
            <Play className="w-4 h-4 mr-2" />
            Deploy
          </Button>

          {/* User Menu */}
          <div className="flex items-center gap-2 ml-2 pl-2 border-l border-glass-border">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">{user?.email}</span>
            </div>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={signOut}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Component Library */}
        <ComponentLibrary onAddComponent={addComponent} />

        {/* Main Canvas Area */}
        <div className="flex-1 flex">
          {activeView === 'design' && (
            <CanvasArea
              components={components}
              selectedComponent={selectedComponent}
              onSelectComponent={setSelectedComponent}
              onUpdateComponent={updateComponent}
              onDeleteComponent={deleteComponent}
              onAddComponent={addComponent}
            />
          )}
          {activeView === 'code' && (
            <CodePanel components={components} />
          )}
          {activeView === 'preview' && (
            <PreviewPanel components={components} />
          )}
        </div>
      </div>
    </div>
  );
};

const getDefaultProps = (type: string) => {
  switch (type) {
    case 'Hero':
      return {
        title: 'Your Amazing Startup',
        subtitle: 'Build the future with our revolutionary platform',
        buttonText: 'Get Started',
        backgroundType: 'gradient'
      };
    case 'Navbar':
      return {
        brand: 'YourBrand',
        links: ['Home', 'About', 'Services', 'Contact'],
        hasButton: true,
        buttonText: 'Sign Up'
      };
    case 'Card':
      return {
        title: 'Feature Title',
        description: 'Describe your amazing feature here',
        icon: 'star',
        variant: 'default'
      };
    case 'Button':
      return {
        text: 'Click Me',
        variant: 'primary',
        size: 'default'
      };
    case 'Input':
      return {
        placeholder: 'Enter your text...',
        label: 'Input Label',
        type: 'text'
      };
    case 'Footer':
      return {
        brand: 'YourBrand',
        links: ['Privacy', 'Terms', 'Contact'],
        socialLinks: true
      };
    default:
      return {};
  }
};

export default CodeCanvas;