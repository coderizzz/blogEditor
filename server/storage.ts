import { blogs, type Blog, type InsertBlog, users, type User, type InsertUser } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Blog CRUD operations
  getAllBlogs(): Promise<Blog[]>;
  getBlogsByStatus(status: string): Promise<Blog[]>;
  getBlog(id: number): Promise<Blog | undefined>;
  createBlog(blog: InsertBlog): Promise<Blog>;
  updateBlog(id: number, blog: Partial<InsertBlog>): Promise<Blog | undefined>;
  deleteBlog(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private blogs: Map<number, Blog>;
  private userCurrentId: number;
  private blogCurrentId: number;

  constructor() {
    this.users = new Map();
    this.blogs = new Map();
    this.userCurrentId = 1;
    this.blogCurrentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllBlogs(): Promise<Blog[]> {
    return Array.from(this.blogs.values()).sort((a, b) => {
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
  }

  async getBlogsByStatus(status: string): Promise<Blog[]> {
    return Array.from(this.blogs.values())
      .filter(blog => blog.status === status)
      .sort((a, b) => {
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      });
  }

  async getBlog(id: number): Promise<Blog | undefined> {
    return this.blogs.get(id);
  }

  async createBlog(insertBlog: InsertBlog): Promise<Blog> {
    const id = this.blogCurrentId++;
    const now = new Date();
    const blog: Blog = {
      id,
      title: insertBlog.title,
      content: insertBlog.content,
      tags: insertBlog.tags === undefined ? null : insertBlog.tags,
      status: insertBlog.status || "draft",
      created_at: now,
      updated_at: now
    };
    this.blogs.set(id, blog);
    return blog;
  }

  async updateBlog(id: number, updatedFields: Partial<InsertBlog>): Promise<Blog | undefined> {
    const existingBlog = this.blogs.get(id);
    
    if (!existingBlog) {
      return undefined;
    }
    
    const updatedBlog: Blog = {
      ...existingBlog,
      ...updatedFields,
      updated_at: new Date()
    };
    
    this.blogs.set(id, updatedBlog);
    return updatedBlog;
  }

  async deleteBlog(id: number): Promise<boolean> {
    return this.blogs.delete(id);
  }
}

export const storage = new MemStorage();
