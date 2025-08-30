-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create projects table for storing user projects
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  components JSONB NOT NULL DEFAULT '[]'::jsonb,
  preview_image TEXT,
  is_template BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create templates table for pre-built templates
CREATE TABLE public.templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  components JSONB NOT NULL DEFAULT '[]'::jsonb,
  preview_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policies for projects
CREATE POLICY "Users can view their own projects" 
ON public.projects 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects" 
ON public.projects 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" 
ON public.projects 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" 
ON public.projects 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for templates (public read access)
CREATE POLICY "Templates are viewable by everyone" 
ON public.templates 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'display_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some default templates
INSERT INTO public.templates (name, description, category, components, preview_image) VALUES 
(
  'Modern SaaS Landing',
  'Clean and modern landing page perfect for SaaS startups',
  'SaaS',
  '[
    {
      "id": "hero-1",
      "type": "Hero",
      "name": "Hero Section",
      "props": {
        "title": "Build Your Startup Faster",
        "subtitle": "The all-in-one platform to launch, grow, and scale your business with powerful tools and analytics.",
        "buttonText": "Start Free Trial",
        "backgroundType": "gradient"
      },
      "position": {"x": 50, "y": 50}
    },
    {
      "id": "navbar-1", 
      "type": "Navbar",
      "name": "Navigation",
      "props": {
        "brand": "StartupPro",
        "links": ["Features", "Pricing", "About", "Contact"],
        "hasButton": true,
        "buttonText": "Sign Up"
      },
      "position": {"x": 50, "y": 20}
    }
  ]'::jsonb,
  '/templates/saas-landing.jpg'
),
(
  'Portfolio Website',
  'Showcase your work with this elegant portfolio template',
  'Portfolio', 
  '[
    {
      "id": "hero-portfolio",
      "type": "Hero",
      "name": "Hero Section",
      "props": {
        "title": "Jane Doe",
        "subtitle": "Frontend Developer & UI Designer creating beautiful digital experiences",
        "buttonText": "View My Work",
        "backgroundType": "gradient"
      },
      "position": {"x": 50, "y": 50}
    }
  ]'::jsonb,
  '/templates/portfolio.jpg'
),
(
  'E-commerce Store',
  'Complete online store template with product showcase',
  'E-commerce',
  '[
    {
      "id": "hero-shop",
      "type": "Hero", 
      "name": "Hero Section",
      "props": {
        "title": "Premium Fashion Store",
        "subtitle": "Discover the latest trends in sustainable fashion with our curated collection",
        "buttonText": "Shop Now",
        "backgroundType": "gradient"
      },
      "position": {"x": 50, "y": 50}
    }
  ]'::jsonb,
  '/templates/ecommerce.jpg'
);