import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { type Blog } from "@shared/schema";
import BlogEditor from "@/components/blog-editor";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditorPage() {
  const { id } = useParams();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentBlog, setCurrentBlog] = useState<Partial<Blog>>({
    title: "",
    content: "",
    tags: "",
    status: "draft"
  });

  // Fetch blog if editing an existing one
  const { isLoading, isError } = useQuery({
    queryKey: [`/api/blogs/${id}`],
    enabled: !!id,
    onSuccess: (data: Blog) => {
      setCurrentBlog(data);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to load blog. It may have been deleted or doesn't exist.",
        variant: "destructive"
      });
      setLocation("/editor");
    }
  });

  // Save draft mutation
  const saveDraftMutation = useMutation({
    mutationFn: async (blogData: Partial<Blog>) => {
      const res = await apiRequest("POST", "/api/blogs/save-draft", blogData);
      return await res.json();
    },
    onSuccess: (data: Blog) => {
      // If this is a new blog, redirect to edit URL with the ID
      if (!id && data.id) {
        setLocation(`/editor/${data.id}`);
      }
      setCurrentBlog(data);
      
      return data;
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save draft",
        variant: "destructive"
      });
    }
  });

  // Publish mutation
  const publishMutation = useMutation({
    mutationFn: async (blogData: Partial<Blog>) => {
      const res = await apiRequest("POST", "/api/blogs/publish", blogData);
      return await res.json();
    },
    onSuccess: (data: Blog) => {
      toast({
        title: "Success",
        description: "Blog published successfully"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/blogs"] });
      setCurrentBlog(data);
      return data;
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to publish blog",
        variant: "destructive"
      });
    }
  });

  const handleSaveDraft = async (blogData: Partial<Blog>) => {
    await saveDraftMutation.mutateAsync({
      ...blogData,
      id: id ? parseInt(id) : undefined
    });
  };

  const handlePublish = async (blogData: Partial<Blog>) => {
    await publishMutation.mutateAsync({
      ...blogData,
      id: id ? parseInt(id) : undefined
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <Skeleton className="h-10 w-64 mb-8" />
        <div className="space-y-6">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-12 w-full" />
          <div className="flex gap-3 pt-4">
            <Skeleton className="h-12 flex-1" />
            <Skeleton className="h-12 flex-1" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <BlogEditor 
      blog={currentBlog} 
      onSaveDraft={handleSaveDraft} 
      onPublish={handlePublish}
      isSaving={saveDraftMutation.isPending}
      isPublishing={publishMutation.isPending}
    />
  );
}
