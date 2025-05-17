import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { type Blog } from "@shared/schema";

export default function Sidebar() {
  const [location] = useLocation();
  
  // Fetch recent drafts for the sidebar
  const { data: blogs } = useQuery<Blog[]>({
    queryKey: ["/api/blogs"],
  });
  
  const recentDrafts = blogs 
    ? blogs
        .filter(blog => blog.status === "draft")
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        .slice(0, 3)
    : [];

  return (
    <div className="bg-secondary w-full md:w-64 md:min-h-screen flex-shrink-0 md:sticky md:top-0 md:h-screen">
      <div className="flex flex-col h-full p-4">
        <div className="flex items-center justify-center mb-8 p-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-accent"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
            <line x1="12" y1="6" x2="12" y2="18"></line>
            <line x1="9" y1="6" x2="9" y2="9"></line>
            <line x1="15" y1="6" x2="15" y2="9"></line>
            <line x1="9" y1="15" x2="9" y2="18"></line>
            <line x1="15" y1="15" x2="15" y2="18"></line>
          </svg>
          <h1 className="text-2xl font-serif ml-3 text-foreground">Moody</h1>
        </div>
        
        <nav className="space-y-6 flex-grow">
          <div>
            <h2 className="font-serif text-sm uppercase tracking-wider text-foreground/70 mb-3">Menu</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/editor">
                  <a className={cn(
                    "flex items-center px-4 py-2 rounded transition hover:bg-accent/10",
                    location === "/editor" && "bg-accent/20 text-accent"
                  )}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editor
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/blogs">
                  <a className={cn(
                    "flex items-center px-4 py-2 rounded transition hover:bg-accent/10",
                    (location === "/blogs" || location.startsWith("/blogs/")) && "bg-accent/20 text-accent"
                  )}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    All Blogs
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/blogs/draft">
                  <a className={cn(
                    "flex items-center px-4 py-2 rounded transition hover:bg-accent/10",
                    location === "/blogs/draft" && "bg-accent/20 text-accent"
                  )}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    Drafts
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/blogs/published">
                  <a className={cn(
                    "flex items-center px-4 py-2 rounded transition hover:bg-accent/10",
                    location === "/blogs/published" && "bg-accent/20 text-accent"
                  )}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Published
                  </a>
                </Link>
              </li>
            </ul>
          </div>
          
          {recentDrafts.length > 0 && (
            <div>
              <h2 className="font-serif text-sm uppercase tracking-wider text-foreground/70 mb-3">Recent Drafts</h2>
              <ul className="space-y-2">
                {recentDrafts.map(draft => (
                  <li key={draft.id}>
                    <Link href={`/editor/${draft.id}`}>
                      <a className="block px-4 py-2 text-sm truncate hover:bg-accent/10 rounded">
                        {draft.title || "Untitled"}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </nav>
        
        <div className="pt-6 mt-auto">
          <div className="bg-secondary rounded-lg p-4 border border-muted/30">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-accent/30 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">Guest User</p>
                <p className="text-xs text-foreground/70">Premium Member</p>
              </div>
            </div>
            <div className="mt-3 flex space-x-2">
              <button className="text-xs px-3 py-1 rounded bg-muted/50 hover:bg-muted/70 transition">
                Profile
              </button>
              <button className="text-xs px-3 py-1 rounded bg-muted/30 hover:bg-muted/50 transition">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
