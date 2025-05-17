import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Sidebar from "@/components/sidebar";
import Home from "@/pages/home";
import Editor from "@/pages/editor";
import Blogs from "@/pages/blogs";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      <div className="flex-grow p-4 md:p-8 overflow-auto">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/editor" component={Editor} />
          <Route path="/editor/:id" component={Editor} />
          <Route path="/blogs" component={Blogs} />
          <Route path="/blogs/:status" component={Blogs} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
