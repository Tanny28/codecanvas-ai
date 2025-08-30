import { ComponentData } from './CodeCanvas';
import { Button } from '@/components/ui/button';
import { Monitor, Smartphone, Tablet, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface PreviewPanelProps {
  components: ComponentData[];
}

export const PreviewPanel = ({ components }: PreviewPanelProps) => {
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const getViewportClass = () => {
    switch (viewMode) {
      case 'mobile':
        return 'w-[375px] h-[667px]';
      case 'tablet':
        return 'w-[768px] h-[1024px]';
      default:
        return 'w-full h-full';
    }
  };

  const renderPreviewComponent = (component: ComponentData) => {
    switch (component.type) {
      case 'Hero':
        return (
          <section className="w-full py-20 bg-gradient-to-br from-primary/10 to-secondary/10">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h1 className="text-5xl font-bold mb-6 gradient-text">
                {component.props.title}
              </h1>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                {component.props.subtitle}
              </p>
              <button className="btn-glow bg-gradient-to-r from-primary to-secondary text-primary-foreground px-10 py-4 rounded-lg font-semibold text-lg">
                {component.props.buttonText}
              </button>
            </div>
          </section>
        );

      case 'Navbar':
        return (
          <nav className="w-full glass border-b border-glass-border sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="font-bold text-xl gradient-text">
                  {component.props.brand}
                </div>
                <div className="hidden md:flex items-center gap-8">
                  {component.props.links.map((link: string, index: number) => (
                    <a key={index} href="#" className="text-sm hover:text-primary transition-colors">
                      {link}
                    </a>
                  ))}
                  {component.props.hasButton && (
                    <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-medium">
                      {component.props.buttonText}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </nav>
        );

      case 'Card':
        return (
          <div className="glass-hover border border-glass-border rounded-xl p-8 max-w-sm">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-6">
              <div className="w-8 h-8 bg-primary rounded-lg" />
            </div>
            <h3 className="text-xl font-semibold mb-3">{component.props.title}</h3>
            <p className="text-muted-foreground">{component.props.description}</p>
          </div>
        );

      case 'Button':
        return (
          <button 
            className={
              component.props.variant === 'primary' 
                ? "btn-glow bg-gradient-to-r from-primary to-secondary text-primary-foreground px-8 py-3 rounded-lg font-semibold" 
                : "glass-hover border border-glass-border px-8 py-3 rounded-lg font-semibold"
            }
          >
            {component.props.text}
          </button>
        );

      case 'Input':
        return (
          <div className="max-w-md w-full">
            <label className="block text-sm font-medium mb-3">{component.props.label}</label>
            <input
              type={component.props.type}
              placeholder={component.props.placeholder}
              className="w-full px-4 py-3 glass-hover border border-glass-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all duration-200"
            />
          </div>
        );

      case 'Footer':
        return (
          <footer className="w-full glass border-t border-glass-border mt-auto">
            <div className="max-w-6xl mx-auto px-6 py-12">
              <div className="flex items-center justify-between">
                <div className="font-bold text-xl gradient-text">
                  {component.props.brand}
                </div>
                <div className="flex items-center gap-8">
                  {component.props.links.map((link: string, index: number) => (
                    <a key={index} href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </footer>
        );

      case 'Text':
        return (
          <div className="max-w-3xl mx-auto px-6">
            <p className="text-lg leading-relaxed">
              This is a text component. You can edit this content and style it as needed. 
              It supports rich formatting and responsive design.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Preview Toolbar */}
      <div className="glass border-b border-glass-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">Live Preview</h3>
          <span className="text-xs text-muted-foreground px-2 py-1 glass rounded">
            {components.length} components
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Viewport Toggle */}
          <div className="glass rounded-lg p-1 flex items-center gap-1">
            <Button
              variant={viewMode === 'desktop' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('desktop')}
            >
              <Monitor className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'tablet' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('tablet')}
            >
              <Tablet className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('mobile')}
            >
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>

          <Button variant="outline" size="sm" className="glass-hover">
            <ExternalLink className="w-4 h-4 mr-2" />
            Open
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 bg-background-secondary p-6 overflow-auto">
        <div className="flex justify-center">
          <div className={`${getViewportClass()} bg-background border border-glass-border rounded-lg overflow-hidden shadow-2xl transition-all duration-500`}>
            <div className="w-full h-full overflow-auto">
              {components.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                      <Monitor className="w-8 h-8 text-primary/50" />
                    </div>
                    <h3 className="text-lg font-medium mb-2 gradient-text">Preview Mode</h3>
                    <p className="text-sm text-muted-foreground">
                      Add components to see your live preview
                    </p>
                  </div>
                </div>
              ) : (
                <div className="min-h-full flex flex-col">
                  {components
                    .sort((a, b) => a.position.y - b.position.y)
                    .map((component) => (
                      <div key={component.id} className="w-full">
                        {renderPreviewComponent(component)}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Preview Footer */}
      <div className="glass border-t border-glass-border px-4 py-2 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>Viewport: {viewMode}</span>
          <span>Responsive: ✓</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-success">Live sync enabled</span>
        </div>
      </div>
    </div>
  );
};