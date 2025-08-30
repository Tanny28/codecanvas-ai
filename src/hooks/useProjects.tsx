import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { ComponentData } from '@/components/CodeCanvas';
import { useToast } from './use-toast';

interface Project {
  id: string;
  name: string;
  description?: string;
  components: ComponentData[];
  preview_image?: string;
  created_at: string;
  updated_at: string;
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchProjects = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to ensure components is properly typed
      const transformedData = data?.map(project => ({
        ...project,
        components: project.components as unknown as ComponentData[]
      })) || [];
      
      setProjects(transformedData);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const saveProject = async (name: string, components: ComponentData[], description?: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          name,
          description,
          components: components as any, // Cast to bypass type check
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      const transformedData = {
        ...data,
        components: data.components as unknown as ComponentData[]
      };

      setProjects(prev => [transformedData, ...prev]);
      toast({
        title: "Success",
        description: "Project saved successfully",
      });

      return transformedData;
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        title: "Error",
        description: "Failed to save project",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    if (!user) return;

    try {
      const updateData = { ...updates } as any;

      const { data, error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const transformedData = {
        ...data,
        components: data.components as unknown as ComponentData[]
      };

      setProjects(prev => prev.map(p => p.id === id ? transformedData : p));
      toast({
        title: "Success",
        description: "Project updated successfully",
      });

      return transformedData;
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteProject = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProjects(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  return {
    projects,
    loading,
    saveProject,
    updateProject,
    deleteProject,
    refetch: fetchProjects,
  };
};