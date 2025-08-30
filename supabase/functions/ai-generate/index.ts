import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, type = 'component' } = await req.json();

    console.log('AI Generation request:', { prompt, type });

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    let systemPrompt = '';
    let userPrompt = '';

    if (type === 'component') {
      systemPrompt = `You are an expert React developer. Generate a single React component based on the user's description. 

REQUIREMENTS:
- Return ONLY valid JSX code for the component
- Use Tailwind CSS for styling with semantic design tokens when possible
- Include proper TypeScript props interface if needed  
- Make it responsive and accessible
- Use semantic HTML elements
- Include hover effects and animations where appropriate
- Component should be self-contained and ready to use

DESIGN TOKENS TO USE:
- Colors: Use semantic tokens like bg-primary, text-primary-foreground, bg-secondary, etc.
- Glass effects: Use 'glass' and 'glass-hover' classes
- Gradients: Use 'gradient-text', 'btn-glow', and gradient backgrounds
- Animations: Use 'animate-fade-in', 'animate-scale-in', etc.

Return only the component code, no explanations.`;

      userPrompt = `Create a React component: ${prompt}`;
    } else if (type === 'layout') {
      systemPrompt = `You are an expert web designer. Generate a complete website layout with multiple components based on the user's description.

REQUIREMENTS:
- Return a JSON array of components with their positions and props
- Each component should have: id, type, name, props, position {x, y}
- Available component types: Hero, Navbar, Card, Button, Input, Footer, Text
- Make it a cohesive, professional design
- Position components logically on the page
- Use appropriate props for each component type

Example format:
[
  {
    "id": "hero-1",
    "type": "Hero", 
    "name": "Hero Section",
    "props": {
      "title": "Your Title",
      "subtitle": "Description",
      "buttonText": "Call to Action"
    },
    "position": {"x": 50, "y": 50}
  }
]`;

      userPrompt = `Create a website layout: ${prompt}`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    console.log('Generated content:', generatedContent);

    return new Response(JSON.stringify({ 
      content: generatedContent,
      type 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-generate function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An unexpected error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});