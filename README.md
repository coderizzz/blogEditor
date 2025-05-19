# Moody - Aesthetic Blog Editor

A moody, aesthetic blog editor with auto-save functionality inspired by Lana Del Rey/Cigarettes After Sex style. This project allows users to write, edit, save, and publish blogs with an elegant, dark-themed interface.

![Moody Blog Editor Screenshot](./generated-icon.png)

## Features

- **Aesthetic UI**: Dark-themed, minimalist design with subtle animations
- **Blog Editor**: Write and edit content with a beautiful interface
- **Auto-Save**: Automatically saves drafts after 5 seconds of inactivity
- **Draft Management**: Save blogs as drafts or publish them
- **Toast Notifications**: Get notified when your content is auto-saved
- **Blog Organization**: View all blogs, filter by drafts or published status
- **Tag Support**: Add tags to categorize your blog posts

## Tech Stack

### Frontend
- React.js with TypeScript
- Wouter for routing
- TanStack React Query for data fetching
- Tailwind CSS for styling
- Shadcn UI components
- Custom animations and transitions

### Backend
- Node.js with Express
- RESTful API design
- In-memory storage (can be easily replaced with a database)

### Database
- PostgreSQL (optional, configured but can use in-memory storage)
- Drizzle ORM for database interactions

## API Endpoints

- `GET /api/blogs` - Retrieve all blogs
- `GET /api/blogs/:id` - Retrieve a specific blog by ID
- `GET /api/blogs/status/:status` - Get blogs by status (draft or published)
- `POST /api/blogs/save-draft` - Save or update a draft
- `POST /api/blogs/publish` - Publish a blog
- `DELETE /api/blogs/:id` - Delete a blog

## Setup Instructions

### Prerequisites
- Node.js v18+ and npm

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/moody-blog-editor.git
   cd moody-blog-editor
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up environment variables (optional for PostgreSQL)
   Create a `.env` file with the following:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/blogdb
   ```

4. Start the development server
   ```
   npm run dev
   ```

5. Open your browser and visit `http://localhost:5000`

## Project Structure

```
/
├── client/               # Frontend code
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions
│   │   ├── pages/        # Page components
│   │   └── App.tsx       # Main application component
├── server/               # Backend code
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Data storage interface
│   └── index.ts          # Server entry point
├── shared/               # Shared code
│   └── schema.ts         # Database schema and types
└── README.md             # This file
```

## Deployment

The application can be deployed to any Node.js hosting service (Vercel, Netlify, Heroku, etc.).

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Design inspired by Lana Del Rey and Cigarettes After Sex aesthetic
- Built for a full-stack developer internship assignment