import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ComponentData } from '@/components/CodeCanvas';
import { useToast } from './use-toast';

interface Template {
  id: string;
  name: string;
  description?: string;
  category: string;
  components: ComponentData[];
  preview_image?: string;
  created_at: string;
}

export const useTemplates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to ensure components is properly typed
      const transformedData = data?.map(template => ({
        ...template,
        components: template.components as unknown as ComponentData[]
      })) || [];
      
      setTemplates(transformedData);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        title: "Error",
        description: "Failed to load templates",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return {
    templates,
    loading,
    refetch: fetchTemplates,
  };
};