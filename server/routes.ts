import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBlogSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Blog API Routes
  
  // Get all blogs
  app.get("/api/blogs", async (req: Request, res: Response) => {
    try {
      const blogs = await storage.getAllBlogs();
      res.json(blogs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blogs" });
    }
  });

  // Get blogs by status (draft or published)
  app.get("/api/blogs/status/:status", async (req: Request, res: Response) => {
    try {
      const { status } = req.params;
      if (status !== "draft" && status !== "published") {
        return res.status(400).json({ message: "Invalid status. Must be 'draft' or 'published'" });
      }
      
      const blogs = await storage.getBlogsByStatus(status);
      res.json(blogs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blogs" });
    }
  });

  // Get a specific blog by ID
  app.get("/api/blogs/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid blog ID" });
      }

      const blog = await storage.getBlog(id);
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }

      res.json(blog);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog" });
    }
  });

  // Save or update a draft
  app.post("/api/blogs/save-draft", async (req: Request, res: Response) => {
    try {
      const blogData = {
        ...req.body,
        status: "draft"
      };
      
      // Validate blog data
      const validationResult = insertBlogSchema.safeParse(blogData);
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid blog data", 
          errors: validationResult.error.errors 
        });
      }

      let blog;
      if (req.body.id) {
        // Update existing blog
        blog = await storage.updateBlog(req.body.id, blogData);
        if (!blog) {
          return res.status(404).json({ message: "Blog not found" });
        }
      } else {
        // Create new blog
        blog = await storage.createBlog(blogData);
      }

      res.status(200).json(blog);
    } catch (error) {
      res.status(500).json({ message: "Failed to save draft" });
    }
  });

  // Publish a blog
  app.post("/api/blogs/publish", async (req: Request, res: Response) => {
    try {
      const blogData = {
        ...req.body,
        status: "published"
      };
      
      // Validate blog data with stricter requirements for publishing
      const publishSchema = insertBlogSchema.extend({
        title: z.string().min(1, "Title is required"),
        content: z.string().min(1, "Content is required"),
      });
      
      const validationResult = publishSchema.safeParse(blogData);
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid blog data", 
          errors: validationResult.error.errors 
        });
      }

      let blog;
      if (req.body.id) {
        // Update existing blog
        blog = await storage.updateBlog(req.body.id, blogData);
        if (!blog) {
          return res.status(404).json({ message: "Blog not found" });
        }
      } else {
        // Create new blog
        blog = await storage.createBlog(blogData);
      }

      res.status(200).json(blog);
    } catch (error) {
      res.status(500).json({ message: "Failed to publish blog" });
    }
  });

  // Delete a blog
  app.delete("/api/blogs/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid blog ID" });
      }

      const success = await storage.deleteBlog(id);
      if (!success) {
        return res.status(404).json({ message: "Blog not found" });
      }

      res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete blog" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
