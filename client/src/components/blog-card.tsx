import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { type Blog } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface BlogCardProps {
  blog: Blog;
  compact?: boolean;
}

export default function BlogCard({ blog, compact = false }: BlogCardProps) {
  const { toast } = useToast();
  
  // Delete blog mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/blogs/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Blog deleted successfully"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/blogs"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete blog",
        variant: "destructive"
      });
    }
  });

  // Format tags for display
  const tags = blog.tags ? blog.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];
  
  // Format time for display
  const timeAgo = blog.updated_at ? formatDistanceToNow(new Date(blog.updated_at), { addSuffix: true }) : "";
  
  return (
    <div className="rounded-lg border border-muted/30 overflow-hidden bg-secondary/20 hover:bg-secondary/30 transition blog-card-hover fade-in">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-serif font-medium text-foreground">
            {blog.title || "Untitled"}
          </h3>
          <span className={cn(
            "text-xs px-2 py-0.5 rounded",
            blog.status === "published" 
              ? "bg-accent/10 text-accent" 
              : "bg-muted/20 text-foreground/80"
          )}>
            {blog.status === "published" ? "Published" : "Draft"}
          </span>
        </div>
        
        {!compact && (
          <p className="text-sm text-foreground/70 line-clamp-2 mb-2">
            {blog.content.length > 120 
              ? `${blog.content.substring(0, 120)}...` 
              : blog.content || "No content"}
          </p>
        )}
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.map((tag, index) => (
              <span key={index} className="tag-item inline-block bg-muted/40 text-foreground/80 text-xs px-1.5 py-0.5 rounded font-mono">
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex justify-between items-center text-xs text-foreground/60">
          <span>
            {blog.status === "published" 
              ? `Published ${timeAgo}` 
              : `Last edited ${timeAgo}`}
          </span>
          
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-foreground/70 hover:text-accent"
              asChild
            >
              <Link href={`/editor/${blog.id}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </Link>
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 text-foreground/70 hover:text-destructive"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the blog "{blog.title || "Untitled"}". 
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => deleteMutation.mutate(blog.id)} 
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
