import { useState, useEffect } from "react";
import { type Blog } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useAutoSave } from "@/hooks/use-auto-save";
import { useToast } from "@/hooks/use-toast";

interface BlogEditorProps {
  blog: Partial<Blog>;
  onSaveDraft: (blog: Partial<Blog>) => Promise<void>;
  onPublish: (blog: Partial<Blog>) => Promise<void>;
  isSaving: boolean;
  isPublishing: boolean;
}

export default function BlogEditor({ 
  blog, 
  onSaveDraft, 
  onPublish, 
  isSaving, 
  isPublishing 
}: BlogEditorProps) {
  const [title, setTitle] = useState(blog.title || "");
  const [content, setContent] = useState(blog.content || "");
  const [tags, setTags] = useState(blog.tags || "");
  const [saveTime, setSaveTime] = useState<string>("");
  const { toast } = useToast();

  // Update form when blog data changes
  useEffect(() => {
    if (blog) {
      setTitle(blog.title || "");
      setContent(blog.content || "");
      setTags(blog.tags || "");
    }
  }, [blog]);

  // Auto-save functionality
  const { autoSaveIndicatorVisible } = useAutoSave({
    data: { title, content, tags },
    onSave: async (data) => {
      try {
        await onSaveDraft(data);
        const now = new Date();
        setSaveTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        
        // Show toast notification
        toast({
          description: "Draft automatically saved",
          className: "bg-secondary border border-accent/50 text-foreground"
        });
      } catch (error) {
        console.error("Auto-save failed:", error);
      }
    },
    debounceMs: 5000,
    enabled: !!(title || content) // Only enable auto-save if there's content
  });

  // Format tags for display in preview
  const tagItems = tags
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean);

  // Format content for preview (basic paragraph splitting)
  const formattedContent = content
    .split('\n\n')
    .map((paragraph, index) => <p key={index}>{paragraph}</p>);

  // Handle manual save draft
  const handleSaveDraft = async () => {
    await onSaveDraft({ title, content, tags });
    const now = new Date();
    setSaveTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    
    toast({
      title: "Success",
      description: "Draft saved successfully"
    });
  };

  // Handle publish
  const handlePublish = async () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for your blog",
        variant: "destructive"
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please add some content to your blog",
        variant: "destructive"
      });
      return;
    }

    await onPublish({ title, content, tags });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Editor Column */}
        <div className="flex-grow lg:w-3/5">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">Blog Editor</h1>
            <div className="flex items-center text-sm text-foreground/70">
              <div className={`auto-saved-indicator flex items-center ${autoSaveIndicatorVisible ? 'opacity-100' : 'opacity-0'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Last saved at {saveTime}</span>
              </div>
            </div>
          </div>
          
          {/* Editor Form */}
          <div className="space-y-6">
            {/* Title Field */}
            <div>
              <label htmlFor="title" className="block font-serif text-foreground mb-2">Title</label>
              <Input 
                id="title" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-secondary border-muted/30 text-foreground" 
                placeholder="Enter your blog title..." 
              />
            </div>
            
            {/* Content Field */}
            <div>
              <label htmlFor="content" className="block font-serif text-foreground mb-2">Content</label>
              <div className="border border-muted/30 rounded-md overflow-hidden">
                {/* Simple Formatting Toolbar */}
                <div className="flex items-center bg-secondary/70 px-4 py-2 border-b border-muted/30">
                  <Button type="button" variant="ghost" size="sm" className="p-1.5 rounded hover:bg-muted/30" title="Bold">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                  </Button>
                  <Button type="button" variant="ghost" size="sm" className="p-1.5 rounded hover:bg-muted/30" title="Italic">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9l-7 7-7-7" />
                    </svg>
                  </Button>
                  <Button type="button" variant="ghost" size="sm" className="p-1.5 rounded hover:bg-muted/30" title="Heading">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                  </Button>
                  <Button type="button" variant="ghost" size="sm" className="p-1.5 rounded hover:bg-muted/30" title="Link">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 015.656 0l4 4a4 4 0 11-5.656 5.656l-1.102-1.101" />
                    </svg>
                  </Button>
                  <div className="h-5 border-r border-muted/30 mx-2"></div>
                  <Button type="button" variant="ghost" size="sm" className="p-1.5 rounded hover:bg-muted/30" title="Image">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </Button>
                </div>
                {/* Text Editor Area */}
                <Textarea 
                  id="content" 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="editor-content w-full bg-secondary/30 border-0 rounded-none focus-visible:ring-0"
                  placeholder="Write your blog content here..." 
                />
              </div>
            </div>
            
            {/* Tags Field */}
            <div>
              <label htmlFor="tags" className="block font-serif text-foreground mb-2">Tags (comma-separated)</label>
              <Input 
                id="tags" 
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full bg-secondary border-muted/30 text-foreground font-mono text-sm" 
                placeholder="vintage, design, aesthetics, photography..." 
              />
              {/* Preview Tags */}
              {tagItems.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tagItems.map((tag, index) => (
                    <span key={index} className="tag-item">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={handleSaveDraft}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Saving...
                  </>
                ) : (
                  "Save as Draft"
                )}
              </Button>
              <Button
                type="button" 
                className="flex-1 bg-accent hover:bg-accent/90 text-white"
                onClick={handlePublish}
                disabled={isPublishing}
              >
                {isPublishing ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Publishing...
                  </>
                ) : (
                  "Publish"
                )}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Preview Column */}
        <div className="lg:w-2/5">
          {/* Blog Preview */}
          <Card className="rounded-lg border border-muted/30 overflow-hidden mb-8">
            <div className="p-5 bg-secondary/50">
              <h2 className="font-serif text-xl text-foreground mb-2">Preview</h2>
              <div className="text-xs text-foreground/70 flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
                <span>{blog.status === "published" ? "Published" : "Draft"}</span>
              </div>
            </div>
            <div className="p-5 bg-secondary/20">
              <h3 className="font-serif text-2xl font-bold mb-4">
                {title || "Untitled Blog"}
              </h3>
              <ScrollArea className="h-64">
                <div className="prose prose-invert prose-sm max-w-none">
                  {formattedContent.length > 0 
                    ? formattedContent 
                    : <p className="text-foreground/50 italic">Start writing to see a preview...</p>}
                </div>
              </ScrollArea>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
