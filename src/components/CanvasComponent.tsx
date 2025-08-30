import { ComponentData } from './CodeCanvas';
import { cn } from '@/lib/utils';

interface CanvasComponentProps {
  component: ComponentData;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<ComponentData>) => void;
  style?: React.CSSProperties;
}

export const CanvasComponent = ({ 
  component, 
  isSelected, 
  onSelect, 
  onUpdate,
  style 
}: CanvasComponentProps) => {
  const handleDrag = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const newPosition = {
      x: Math.max(0, e.clientX - 100),
      y: Math.max(0, e.clientY - 50)
    };
    onUpdate({ position: newPosition });
  };

  const renderComponent = () => {
    switch (component.type) {
      case 'Hero':
        return (
          <div className="w-full max-w-4xl mx-auto p-12 text-center bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl border border-primary/20">
            <h1 className="text-4xl font-bold mb-4 gradient-text">
              {component.props.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {component.props.subtitle}
            </p>
            <button className="btn-glow bg-gradient-to-r from-primary to-secondary text-primary-foreground px-8 py-3 rounded-lg font-medium">
              {component.props.buttonText}
            </button>
          </div>
        );

      case 'Navbar':
        return (
          <nav className="w-full max-w-6xl mx-auto glass rounded-lg border border-glass-border p-4">
            <div className="flex items-center justify-between">
              <div className="font-bold text-lg gradient-text">
                {component.props.brand}
              </div>
              <div className="flex items-center gap-6">
                {component.props.links.map((link: string, index: number) => (
                  <a key={index} href="#" className="text-sm hover:text-primary transition-colors">
                    {link}
                  </a>
                ))}
                {component.props.hasButton && (
                  <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium">
                    {component.props.buttonText}
                  </button>
                )}
              </div>
            </div>
          </nav>
        );

      case 'Card':
        return (
          <div className="w-80 glass-hover border border-glass-border rounded-lg p-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4">
              <div className="w-6 h-6 bg-primary rounded" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{component.props.title}</h3>
            <p className="text-muted-foreground text-sm">{component.props.description}</p>
          </div>
        );

      case 'Button':
        return (
          <button 
            className={cn(
              "px-6 py-2 rounded-lg font-medium transition-all duration-200",
              component.props.variant === 'primary' 
                ? "btn-glow bg-gradient-to-r from-primary to-secondary text-primary-foreground" 
                : "glass-hover border border-glass-border"
            )}
          >
            {component.props.text}
          </button>
        );

      case 'Input':
        return (
          <div className="w-80">
            <label className="block text-sm font-medium mb-2">{component.props.label}</label>
            <input
              type={component.props.type}
              placeholder={component.props.placeholder}
              className="w-full px-3 py-2 glass-hover border border-glass-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all duration-200"
            />
          </div>
        );

      case 'Footer':
        return (
          <footer className="w-full max-w-6xl mx-auto glass border border-glass-border rounded-lg p-8">
            <div className="flex items-center justify-between">
              <div className="font-bold text-lg gradient-text">
                {component.props.brand}
              </div>
              <div className="flex items-center gap-6">
                {component.props.links.map((link: string, index: number) => (
                  <a key={index} href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link}
                  </a>
                ))}
              </div>
            </div>
          </footer>
        );

      case 'Text':
        return (
          <div className="max-w-2xl">
            <p className="text-base leading-relaxed">
              This is a text component. You can edit this content and style it as needed.
            </p>
          </div>
        );

      default:
        return (
          <div className="w-64 h-32 glass border border-glass-border rounded-lg flex items-center justify-center">
            <span className="text-muted-foreground">{component.type}</span>
          </div>
        );
    }
  };

  return (
    <div
      className={cn(
        "absolute cursor-move animate-fade-in",
        isSelected && "ring-2 ring-primary/50 ring-offset-2 ring-offset-background"
      )}
      style={{
        left: component.position.x,
        top: component.position.y,
        ...style
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      draggable
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
    >
      {renderComponent()}
      
      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-primary rounded-full border-2 border-background animate-glow-pulse" />
      )}
    </div>
  );
};