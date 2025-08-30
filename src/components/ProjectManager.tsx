import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { useProjects } from '@/hooks/useProjects';
import { ComponentData } from './CodeCanvas';
import { Save, FolderOpen, Trash2, Edit, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProjectManagerProps {
  components: ComponentData[];
  onLoadProject: (components: ComponentData[]) => void;
}

export const ProjectManager = ({ components, onLoadProject }: ProjectManagerProps) => {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const { projects, loading, saveProject, deleteProject } = useProjects();
  const { toast } = useToast();

  const handleSaveProject = async () => {
    if (!projectName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a project name",
        variant: "destructive",
      });
      return;
    }

    const saved = await saveProject(projectName, components, projectDescription);
    if (saved) {
      setSaveDialogOpen(false);
      setProjectName('');
      setProjectDescription('');
    }
  };

  const handleLoadProject = (projectComponents: ComponentData[]) => {
    onLoadProject(projectComponents);
    setLoadDialogOpen(false);
    toast({
      title: "Success",
      description: "Project loaded successfully",
    });
  };

  const handleDeleteProject = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      await deleteProject(id);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline" className="glass-hover">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </DialogTrigger>
        <DialogContent className="glass border-glass-border">
          <DialogHeader>
            <DialogTitle className="gradient-text">Save Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Project Name</label>
              <Input
                placeholder="Enter project name..."
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="glass-hover"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description (Optional)</label>
              <Textarea
                placeholder="Describe your project..."
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                className="glass-hover resize-none"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSaveProject}
                className="btn-glow bg-gradient-to-r from-primary to-secondary"
              >
                Save Project
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline" className="glass-hover">
            <FolderOpen className="w-4 h-4 mr-2" />
            Load
          </Button>
        </DialogTrigger>
        <DialogContent className="glass border-glass-border max-w-2xl">
          <DialogHeader>
            <DialogTitle className="gradient-text">Load Project</DialogTitle>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto space-y-3">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-4" />
                <p className="text-muted-foreground">Loading projects...</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-8">
                <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No projects found</p>
                <p className="text-sm text-muted-foreground/70">Create your first project by saving your current work</p>
              </div>
            ) : (
              projects.map((project) => (
                <Card key={project.id} className="glass border-glass-border p-4 hover:border-primary/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{project.name}</h3>
                      {project.description && (
                        <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                      )}
                      <div className="flex items-center text-xs text-muted-foreground/70 gap-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(project.updated_at).toLocaleDateString()}
                        </div>
                        <div>{project.components.length} components</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleLoadProject(project.components)}
                        className="text-primary hover:text-primary"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteProject(project.id, project.name)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};