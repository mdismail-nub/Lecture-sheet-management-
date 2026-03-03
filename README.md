# NUB Academic Lecture Materials Portal

A professional, production-ready full-stack web application for Northern University Bangladesh to manage and distribute academic lecture materials. Students can publicly browse, view, and download course materials while lecturers manage everything through a secure admin panel.

## Features

### Public Features
- **Home Page**: Hero section with lecturer profile, featured announcements, and course overview
- **Course Browsing**: View all courses with filtering by department/tag
- **Course Details**: Access materials for specific courses with preview and download options
- **Search**: Global search across all courses and materials
- **Announcements**: View all notices and academic updates
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop

### Admin Features (Password Protected)
- **Secure Login**: Password-hashed authentication with session management
- **Dashboard**: Overview of statistics (courses, materials, announcements)
- **Course Management**: Create, edit, delete courses
- **Material Upload**: Upload PDFs and images with course association
- **Announcement Management**: Post, edit, delete announcements
- **Protected Routes**: JWT-based auth with HTTP-only cookies

## Tech Stack

- **Frontend**: React 19 + React Router 7 + Tailwind CSS 4
- **Backend**: Express.js + SQLite
- **Build Tool**: Vite 6
- **Security**: bcrypt password hashing, Joi validation, HTTP-only cookies
- **UI Components**: Lucide icons, Motion (animations)
- **Database**: SQLite with better-sqlite3

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lecture-sheet-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # The app will be available at http://localhost:3000
   ```

## Available Scripts

- `npm run dev` - Start development server (runs server + Vite)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run clean` - Remove build artifacts
- `npm run lint` - Type check with TypeScript

## Default Admin Credentials

**Email**: `admin@nub.ac.bd`  
**Password**: `admin123`

**⚠️ Important**: Change these credentials immediately after first login in production!

## Project Structure

```
├── server.ts                  # Express backend with API endpoints
├── src/
│   ├── pages/               # React page components
│   │   ├── Home.tsx
│   │   ├── Courses.tsx
│   │   ├── CourseDetail.tsx
│   │   ├── SearchResults.tsx
│   │   ├── Announcements.tsx
│   │   ├── Login.tsx
│   │   └── admin/          # Protected admin pages
│   ├── components/          # Reusable components
│   ├── lib/
│   │   └── api.ts          # API client functions
│   ├── types.ts            # TypeScript interfaces
│   ├── App.tsx             # Main routing component
│   ├── main.tsx            # React entry point
│   └── index.css           # Tailwind + custom styles
├── academic.db             # SQLite database (auto-created)
├── package.json
└── vite.config.ts
```

## Database Schema

### Courses Table
```sql
- id: INTEGER PRIMARY KEY
- courseName: TEXT NOT NULL
- courseCode: TEXT NOT NULL UNIQUE
- department: TEXT NOT NULL
- description: TEXT
- createdAt: DATETIME
```

### Materials Table
```sql
- id: INTEGER PRIMARY KEY
- courseId: INTEGER (FK to courses)
- title: TEXT NOT NULL
- fileType: TEXT ('pdf' | 'image')
- fileUrl: TEXT NOT NULL
- uploadedAt: DATETIME
```

### Announcements Table
```sql
- id: INTEGER PRIMARY KEY
- title: TEXT NOT NULL
- description: TEXT NOT NULL
- date: DATETIME
```

### Admin Table
```sql
- id: INTEGER PRIMARY KEY
- email: TEXT NOT NULL UNIQUE
- password: TEXT NOT NULL (hashed with bcrypt)
- createdAt: DATETIME
```

### Sessions Table
```sql
- id: INTEGER PRIMARY KEY
- userId: INTEGER (FK to admin)
- token: TEXT NOT NULL UNIQUE
- expiresAt: DATETIME
- createdAt: DATETIME
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout and clear session
- `GET /api/auth/me` - Check authentication status

### Courses (Public Read, Admin Write)
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create course (admin)
- `PUT /api/courses/:id` - Update course (admin)
- `DELETE /api/courses/:id` - Delete course (admin)

### Materials (Public Read, Admin Write)
- `GET /api/materials` - Get all materials
- `GET /api/courses/:id/materials` - Get materials for course
- `POST /api/materials` - Upload material (admin)
- `DELETE /api/materials/:id` - Delete material (admin)

### Announcements (Public Read, Admin Write)
- `GET /api/announcements` - Get all announcements
- `POST /api/announcements` - Create announcement (admin)
- `PUT /api/announcements/:id` - Update announcement (admin)
- `DELETE /api/announcements/:id` - Delete announcement (admin)

### Search
- `GET /api/search?q=query` - Search courses and materials

## Color Scheme

- **Primary**: Navy Blue (#102a43)
- **Accent**: Gold (#c99738)
- **Background**: Paper White (#fcfcf9)
- **Text**: Navy Dark (#102a43)
- **Neutrals**: Navy Gray scales

## Security Features

✅ Password hashing with bcrypt (10 salt rounds)  
✅ Session-based authentication with secure tokens  
✅ HTTP-only cookies (no XSS vulnerability)  
✅ Input validation with Joi schema validation  
✅ CORS properly configured  
✅ Protected admin routes with session verification  
✅ Parameterized database queries (SQL injection prevention)  

## Deployment

### Build for Production
```bash
npm run build
npm run preview
```

### Deploy to Vercel
1. Push code to GitHub
2. Connect repository to Vercel
3. Vercel automatically deploys on push
4. Set environment variables in Vercel project settings

## Troubleshooting

### Port Already in Use
The server automatically attempts the next port if 3000 is occupied. Check console for the actual port.

### Database Issues
Delete `academic.db` to reset the database. It will be recreated on next startup with default data.

### Login Issues
Ensure you're using the correct credentials:
- Email: `admin@nub.ac.bd`
- Password: `admin123`

## License

© 2026 Northern University Bangladesh. All rights reserved.
