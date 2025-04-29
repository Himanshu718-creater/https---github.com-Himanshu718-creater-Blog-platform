### 1. Install dependencies

\`\`\`bash
npm install/npm install --force
\`\`\`

### 2. Set up environment variables

Create a `.env.local` file in the root directory with the following variables:

\`\`\`MONGODB_URI=mongodb://localhost:27017/blog-platform

\`\`\`

Replace the MongoDB URI with your own connection string if you're using MongoDB Atlas or a different configuration.

### 3. Run the development server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 4. Build for production

\`\`\`bash
npm run build
\`\`\`

### 5. Start the production server

\`\`\`bash
npm start
\`\`\`

## Project Structure

- `/app` - Next.js App Router pages and API routes
- `/components` - React components
- `/lib` - Utility functions, database connection, and models

## API Endpoints

- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create a new post
- `GET /api/posts/:id` - Get a specific post
- `PUT /api/posts/:id` - Update a specific post
- `DELETE /api/posts/:id` - Delete a specific post

## Technologies Used

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Next.js API Routes (Express-like)
- **Database**: MongoDB with Mongoose
- **State Management**: React Hooks (useState, useEffect)

## License