import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { type Blog } from "@shared/schema";
import BlogCard from "@/components/blog-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogsPage() {
  const { status } = useParams();
  const [activeTab, setActiveTab] = useState<string>(status || "all");

  // Fetch all blogs
  const { data: blogs, isLoading } = useQuery<Blog[]>({
    queryKey: ["/api/blogs"],
  });

  const filteredBlogs = blogs ? blogs.filter(blog => {
    if (activeTab === "all") return true;
    return blog.status === activeTab;
  }) : [];

  const drafts = blogs ? blogs.filter(blog => blog.status === "draft") : [];
  const published = blogs ? blogs.filter(blog => blog.status === "published") : [];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-8">Your Blogs</h1>
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)}>
        <TabsList className="mb-6">
          <TabsTrigger value="all" asChild>
            <Link href="/blogs">All</Link>
          </TabsTrigger>
          <TabsTrigger value="published" asChild>
            <Link href="/blogs/published">Published</Link>
          </TabsTrigger>
          <TabsTrigger value="draft" asChild>
            <Link href="/blogs/draft">Drafts</Link>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg" />
            ))
          ) : filteredBlogs.length > 0 ? (
            filteredBlogs.map(blog => (
              <BlogCard key={blog.id} blog={blog} />
            ))
          ) : (
            <p className="text-center py-12 text-muted-foreground italic">No blogs found</p>
          )}
        </TabsContent>
        
        <TabsContent value="published" className="space-y-4">
          {isLoading ? (
            Array(2).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg" />
            ))
          ) : published.length > 0 ? (
            published.map(blog => (
              <BlogCard key={blog.id} blog={blog} />
            ))
          ) : (
            <p className="text-center py-12 text-muted-foreground italic">No published blogs found</p>
          )}
        </TabsContent>
        
        <TabsContent value="draft" className="space-y-4">
          {isLoading ? (
            Array(2).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg" />
            ))
          ) : drafts.length > 0 ? (
            drafts.map(blog => (
              <BlogCard key={blog.id} blog={blog} />
            ))
          ) : (
            <p className="text-center py-12 text-muted-foreground italic">No drafts found</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
