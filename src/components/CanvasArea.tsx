import { useState, useRef } from 'react';
import { ComponentData } from './CodeCanvas';
import { CanvasComponent } from './CanvasComponent';
import { Button } from '@/components/ui/button';
import { Trash2, Copy, Settings, Plus } from 'lucide-react';

interface CanvasAreaProps {
  components: ComponentData[];
  selectedComponent: string | null;
  onSelectComponent: (id: string | null) => void;
  onUpdateComponent: (id: string, updates: Partial<ComponentData>) => void;
  onDeleteComponent: (id: string) => void;
  onAddComponent: (type: string, position: { x: number; y: number }) => void;
}

export const CanvasArea = ({
  components,
  selectedComponent,
  onSelectComponent,
  onUpdateComponent,
  onDeleteComponent,
  onAddComponent
}: CanvasAreaProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
    
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setDragPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!canvasRef.current?.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const componentType = e.dataTransfer.getData('text/plain');
    if (componentType && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const position = {
        x: Math.max(0, e.clientX - rect.left - 100), // Center the component
        y: Math.max(0, e.clientY - rect.top - 50)
      };
      onAddComponent(componentType, position);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      onSelectComponent(null);
    }
  };

  const duplicateComponent = (component: ComponentData) => {
    const newComponent = {
      ...component,
      id: `${component.type}-${Date.now()}`,
      position: {
        x: component.position.x + 20,
        y: component.position.y + 20
      }
    };
    onAddComponent(newComponent.type, newComponent.position);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Canvas Toolbar */}
      {selectedComponent && (
        <div className="glass border-b border-glass-border p-3 flex items-center justify-between animate-slide-up">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {components.find(c => c.id === selectedComponent)?.name}
            </span>
            <span className="text-xs text-muted-foreground px-2 py-1 glass rounded">
              {components.find(c => c.id === selectedComponent)?.type}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                const component = components.find(c => c.id === selectedComponent);
                if (component) duplicateComponent(component);
              }}
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost">
              <Settings className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDeleteComponent(selectedComponent)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Canvas */}
      <div
        ref={canvasRef}
        className={`
          flex-1 relative overflow-auto canvas-grid
          ${isDragOver ? 'drop-zone active' : 'drop-zone'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleCanvasClick}
      >
        {/* Drop Indicator */}
        {isDragOver && (
          <div
            className="absolute pointer-events-none z-50 w-8 h-8 border-2 border-dashed border-canvas-dropzone rounded-lg bg-canvas-dropzone/20 animate-glow-pulse"
            style={{
              left: dragPosition.x - 16,
              top: dragPosition.y - 16
            }}
          />
        )}

        {/* Empty State */}
        {components.length === 0 && !isDragOver && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center animate-fade-in">
              <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center animate-float">
                <Plus className="w-10 h-10 text-primary/50" />
              </div>
              <h3 className="text-lg font-medium mb-2 gradient-text">Start Building</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Drag components from the library to start creating your website. 
                You can also use AI to generate components automatically.
              </p>
            </div>
          </div>
        )}

        {/* Components */}
        {components.map((component, index) => (
          <CanvasComponent
            key={component.id}
            component={component}
            isSelected={selectedComponent === component.id}
            onSelect={() => onSelectComponent(component.id)}
            onUpdate={(updates) => onUpdateComponent(component.id, updates)}
            style={{
              animationDelay: `${index * 100}ms`
            }}
          />
        ))}

        {/* Canvas Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="w-full h-full canvas-grid" />
        </div>
      </div>

      {/* Canvas Footer */}
      <div className="glass border-t border-glass-border px-4 py-2 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>{components.length} components</span>
          <span>Canvas: 1920x1080</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span>Zoom: 100%</span>
          <div className="w-px h-4 bg-glass-border mx-2" />
          <span className="text-success">Auto-saved</span>
        </div>
      </div>
    </div>
  );
};