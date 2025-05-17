import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { type Blog } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import BlogCard from "@/components/blog-card";

export default function HomePage() {
  // Fetch recent drafts and published blogs
  const { data: blogs, isLoading } = useQuery<Blog[]>({
    queryKey: ["/api/blogs"],
  });

  const recentDrafts = blogs 
    ? blogs
        .filter(blog => blog.status === "draft")
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        .slice(0, 3)
    : [];

  const recentPublished = blogs
    ? blogs
        .filter(blog => blog.status === "published")
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        .slice(0, 3)
    : [];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">Welcome to Moody</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          An aesthetic blog editor for your deepest thoughts and creative expressions. 
          Write, save drafts, and publish your content with elegance.
        </p>
        <Button asChild className="bg-accent hover:bg-accent/90 text-white">
          <Link href="/editor">Create New Blog</Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-serif text-foreground mb-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Recent Drafts
          </h2>
          
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg mb-4" />
            ))
          ) : recentDrafts.length > 0 ? (
            <div className="space-y-4">
              {recentDrafts.map(blog => (
                <BlogCard key={blog.id} blog={blog} compact />
              ))}
            </div>
          ) : (
            <p className="text-center py-12 text-muted-foreground italic">No drafts yet</p>
          )}
          
          <div className="mt-6 text-center">
            <Button variant="outline" asChild>
              <Link href="/blogs/draft">View All Drafts</Link>
            </Button>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-serif text-foreground mb-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Published Blogs
          </h2>
          
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg mb-4" />
            ))
          ) : recentPublished.length > 0 ? (
            <div className="space-y-4">
              {recentPublished.map(blog => (
                <BlogCard key={blog.id} blog={blog} compact />
              ))}
            </div>
          ) : (
            <p className="text-center py-12 text-muted-foreground italic">No published blogs yet</p>
          )}
          
          <div className="mt-6 text-center">
            <Button variant="outline" asChild>
              <Link href="/blogs/published">View All Published</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
