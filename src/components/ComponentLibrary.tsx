import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Layout, 
  Type, 
  Square, 
  MousePointer, 
  FileText, 
  Navigation, 
  Search,
  Sparkles,
  Zap,
  Globe
} from 'lucide-react';

interface ComponentLibraryProps {
  onAddComponent: (type: string, position: { x: number; y: number }) => void;
}

const componentCategories = [
  {
    name: 'Layout',
    icon: Layout,
    components: [
      { type: 'Hero', icon: Zap, name: 'Hero Section', description: 'Eye-catching landing section' },
      { type: 'Navbar', icon: Navigation, name: 'Navigation', description: 'Site navigation bar' },
      { type: 'Footer', icon: FileText, name: 'Footer', description: 'Page footer section' },
      { type: 'Container', icon: Square, name: 'Container', description: 'Content wrapper' }
    ]
  },
  {
    name: 'Components',
    icon: Square,
    components: [
      { type: 'Card', icon: Square, name: 'Card', description: 'Content card component' },
      { type: 'Button', icon: MousePointer, name: 'Button', description: 'Interactive button' },
      { type: 'Input', icon: Type, name: 'Input Field', description: 'Form input element' },
      { type: 'Text', icon: Type, name: 'Text Block', description: 'Paragraph or heading' }
    ]
  },
  {
    name: 'AI Templates',
    icon: Sparkles,
    components: [
      { type: 'SaaS-Landing', icon: Globe, name: 'SaaS Landing', description: 'Complete SaaS page' },
      { type: 'E-commerce', icon: Square, name: 'E-commerce', description: 'Product showcase' },
      { type: 'Portfolio', icon: FileText, name: 'Portfolio', description: 'Personal portfolio' },
      { type: 'Dashboard', icon: Layout, name: 'Dashboard', description: 'Admin dashboard' }
    ]
  }
];

export const ComponentLibrary = ({ onAddComponent }: ComponentLibraryProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Layout');
  const [draggedComponent, setDraggedComponent] = useState<string | null>(null);

  const filteredComponents = componentCategories
    .find(cat => cat.name === activeCategory)
    ?.components.filter(comp => 
      comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleDragStart = (e: React.DragEvent, componentType: string) => {
    setDraggedComponent(componentType);
    e.dataTransfer.setData('text/plain', componentType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragEnd = () => {
    setDraggedComponent(null);
  };

  return (
    <div className="w-80 glass border-r border-glass-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-glass-border">
        <h2 className="text-lg font-semibold mb-3 gradient-text">Component Library</h2>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 glass-hover"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-col gap-1">
          {componentCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.name}
                variant={activeCategory === category.name ? "default" : "ghost"}
                onClick={() => setActiveCategory(category.name)}
                className="justify-start h-9 text-sm"
              >
                <Icon className="w-4 h-4 mr-2" />
                {category.name}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Components Grid */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="grid grid-cols-1 gap-3">
          {filteredComponents?.map((component) => {
            const Icon = component.icon;
            const isDragging = draggedComponent === component.type;
            
            return (
              <div
                key={component.type}
                draggable
                onDragStart={(e) => handleDragStart(e, component.type)}
                onDragEnd={handleDragEnd}
                className={`
                  glass-hover p-4 rounded-lg border cursor-move group
                  transition-all duration-200 hover:border-primary/50
                  ${isDragging ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}
                  animate-slide-up
                `}
                style={{ animationDelay: `${filteredComponents.indexOf(component) * 50}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-secondary/30 transition-all duration-200">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm mb-1 text-foreground group-hover:text-primary transition-colors duration-200">
                      {component.name}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {component.description}
                    </p>
                  </div>
                </div>

                {/* Drag Indicator */}
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    Drag to canvas
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="w-1 h-1 bg-primary rounded-full"></div>
                    <div className="w-1 h-1 bg-primary rounded-full"></div>
                    <div className="w-1 h-1 bg-primary rounded-full"></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* AI Generate Section */}
        <div className="mt-6 p-4 glass rounded-lg border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="font-medium text-sm gradient-text">AI Generator</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Describe what you want and let AI create it for you
          </p>
          <Button 
            size="sm" 
            className="w-full btn-glow bg-gradient-to-r from-primary to-secondary hover:from-primary-glow hover:to-secondary-glow"
          >
            <Sparkles className="w-3 h-3 mr-2" />
            Generate Component
          </Button>
        </div>
      </div>
    </div>
  );
};