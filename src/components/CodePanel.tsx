import { ComponentData } from './CodeCanvas';
import { Button } from '@/components/ui/button';
import { Copy, Download, Code, FileText } from 'lucide-react';
import { useState } from 'react';

interface CodePanelProps {
  components: ComponentData[];
}

export const CodePanel = ({ components }: CodePanelProps) => {
  const [activeTab, setActiveTab] = useState<'react' | 'html' | 'css'>('react');

  const generateReactCode = () => {
    if (components.length === 0) {
      return `import React from 'react';

const App = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Your components will appear here */}
    </div>
  );
};

export default App;`;
    }

    const componentImports = components
      .map(comp => comp.type)
      .filter((type, index, array) => array.indexOf(type) === index)
      .map(type => `import ${type} from './components/${type}';`)
      .join('\n');

    const componentJSX = components
      .map(comp => {
        const propsString = Object.entries(comp.props)
          .map(([key, value]) => `${key}="${value}"`)
          .join(' ');
        
        return `      <${comp.type} ${propsString} />`;
      })
      .join('\n');

    return `import React from 'react';
${componentImports}

const App = () => {
  return (
    <div className="min-h-screen bg-background">
${componentJSX}
    </div>
  );
};

export default App;`;
  };

  const generateHTMLCode = () => {
    if (components.length === 0) {
      return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Website</title>
    <link href="https://cdn.tailwindcss.com" rel="stylesheet">
</head>
<body class="min-h-screen bg-slate-900 text-white">
    <!-- Your components will appear here -->
</body>
</html>`;
    }

    const componentHTML = components
      .map(comp => {
        switch (comp.type) {
          case 'Hero':
            return `    <section class="w-full py-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
        <div class="max-w-4xl mx-auto px-6 text-center">
            <h1 class="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                ${comp.props.title}
            </h1>
            <p class="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
                ${comp.props.subtitle}
            </p>
            <button class="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-10 py-4 rounded-lg font-semibold text-lg">
                ${comp.props.buttonText}
            </button>
        </div>
    </section>`;
          
          case 'Navbar':
            return `    <nav class="w-full bg-slate-800/80 backdrop-blur-lg border-b border-slate-700">
        <div class="max-w-6xl mx-auto px-6 py-4">
            <div class="flex items-center justify-between">
                <div class="font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    ${comp.props.brand}
                </div>
                <div class="hidden md:flex items-center gap-8">
                    ${comp.props.links.map((link: string) => `<a href="#" class="text-sm hover:text-blue-400 transition-colors">${link}</a>`).join('\n                    ')}
                    ${comp.props.hasButton ? `<button class="bg-blue-500 text-white px-6 py-2 rounded-lg text-sm font-medium">${comp.props.buttonText}</button>` : ''}
                </div>
            </div>
        </div>
    </nav>`;
          
          default:
            return `    <!-- ${comp.type} component -->`;
        }
      })
      .join('\n\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Website</title>
    <link href="https://cdn.tailwindcss.com" rel="stylesheet">
</head>
<body class="min-h-screen bg-slate-900 text-white">
${componentHTML}
</body>
</html>`;
  };

  const generateCSSCode = () => {
    return `/* Generated CSS for CodeCanvas AI */

/* Base Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  background: #0f172a;
  color: #f1f5f9;
  line-height: 1.6;
}

/* Glassmorphism Effects */
.glass {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(51, 65, 85, 0.5);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

/* Gradient Text */
.gradient-text {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Button Glow Effect */
.btn-glow {
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
  transition: all 0.3s ease;
}

.btn-glow:hover {
  box-shadow: 0 0 30px rgba(59, 130, 246, 0.6);
  transform: translateY(-1px);
}

/* Animations */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

/* Responsive Design */
@media (max-width: 768px) {
  .text-5xl { font-size: 2.5rem; }
  .text-xl { font-size: 1.125rem; }
  .px-10 { padding-left: 1.5rem; padding-right: 1.5rem; }
  .py-4 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
}`;
  };

  const getCurrentCode = () => {
    switch (activeTab) {
      case 'react':
        return generateReactCode();
      case 'html':
        return generateHTMLCode();
      case 'css':
        return generateCSSCode();
      default:
        return '';
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getCurrentCode());
  };

  const downloadCode = () => {
    const code = getCurrentCode();
    const fileExtension = activeTab === 'react' ? 'jsx' : activeTab;
    const fileName = `generated-code.${fileExtension}`;
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Code Panel Header */}
      <div className="glass border-b border-glass-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold text-sm gradient-text">Generated Code</h3>
          
          {/* Code Type Tabs */}
          <div className="glass rounded-lg p-1 flex items-center gap-1">
            <Button
              variant={activeTab === 'react' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('react')}
              className="text-xs"
            >
              <Code className="w-3 h-3 mr-1" />
              React
            </Button>
            <Button
              variant={activeTab === 'html' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('html')}
              className="text-xs"
            >
              <FileText className="w-3 h-3 mr-1" />
              HTML
            </Button>
            <Button
              variant={activeTab === 'css' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('css')}
              className="text-xs"
            >
              <FileText className="w-3 h-3 mr-1" />
              CSS
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="glass-hover"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadCode}
            className="glass-hover"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* Code Content */}
      <div className="flex-1 overflow-auto">
        <pre className="p-6 text-sm font-mono leading-relaxed text-foreground">
          <code className="language-javascript">
            {getCurrentCode()}
          </code>
        </pre>
      </div>

      {/* Code Panel Footer */}
      <div className="glass border-t border-glass-border px-4 py-2 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>Language: {activeTab.toUpperCase()}</span>
          <span>Lines: {getCurrentCode().split('\n').length}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-success">Auto-generated</span>
        </div>
      </div>
    </div>
  );
};