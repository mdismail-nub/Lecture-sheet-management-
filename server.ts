import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import cookieParser from "cookie-parser";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("academic.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    courseName TEXT NOT NULL,
    courseCode TEXT NOT NULL UNIQUE,
    department TEXT NOT NULL,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS materials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    courseId INTEGER NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Other', -- 'Lecture Note' | 'Syllabus' | 'Assignment' | 'Other'
    fileType TEXT NOT NULL, -- 'pdf' | 'image'
    fileUrl TEXT NOT NULL,
    uploadedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS announcements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS admin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  );
`);

// Seed Admin if not exists
const adminExists = db.prepare("SELECT * FROM admin WHERE email = ?").get("admin@nub.ac.bd");
if (!adminExists) {
  db.prepare("INSERT INTO admin (email, password) VALUES (?, ?)").run("admin@nub.ac.bd", "password123");
}

// Seed some initial data if empty
const courseCount = db.prepare("SELECT COUNT(*) as count FROM courses").get() as { count: number };
if (courseCount.count === 0) {
  const insertCourse = db.prepare("INSERT INTO courses (courseName, courseCode, department, description) VALUES (?, ?, ?, ?)");
  insertCourse.run("Data Structures", "CSE 201", "CSE", "Fundamental data structures and algorithms.");
  insertCourse.run("Object Oriented Programming", "CSE 202", "CSE", "OOP concepts using Java.");
  insertCourse.run("Database Management Systems", "CSE 301", "CSE", "Relational databases and SQL.");

  const insertAnnouncement = db.prepare("INSERT INTO announcements (title, description) VALUES (?, ?)");
  insertAnnouncement.run("Midterm Exam Schedule", "The midterm exams for Spring 2026 will start from March 15th.");
  insertAnnouncement.run("New Lecture Materials", "New lecture slides for CSE 301 have been uploaded.");
}

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Add category column if it doesn't exist (for existing databases)
try {
  db.prepare("ALTER TABLE materials ADD COLUMN category TEXT NOT NULL DEFAULT 'Other'").run();
} catch (e) {
  // Column probably already exists
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and images are allowed.'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());
  app.use("/uploads", express.static(uploadsDir));

  // Auth Middleware
  const authenticate = (req: any, res: any, next: any) => {
    const token = req.cookies.admin_token;
    if (token === "logged_in_session_token") {
      next();
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  };

  // --- API Routes ---

  // File Upload
  app.post("/api/upload", authenticate, upload.single("file"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ fileUrl, fileType: req.file.mimetype.startsWith('image') ? 'image' : 'pdf' });
  });

  // Auth
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const admin = db.prepare("SELECT * FROM admin WHERE email = ? AND password = ?").get(email, password);
    if (admin) {
      res.cookie("admin_token", "logged_in_session_token", { httpOnly: true, sameSite: 'none', secure: true });
      res.json({ success: true });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("admin_token");
    res.json({ success: true });
  });

  app.get("/api/auth/me", (req, res) => {
    const token = req.cookies.admin_token;
    if (token === "logged_in_session_token") {
      res.json({ authenticated: true });
    } else {
      res.json({ authenticated: false });
    }
  });

  // Courses
  app.get("/api/courses", (req, res) => {
    const courses = db.prepare(`
      SELECT c.*, (SELECT COUNT(*) FROM materials m WHERE m.courseId = c.id) as materialCount 
      FROM courses c
    `).all();
    res.json(courses);
  });

  app.get("/api/courses/:id", (req, res) => {
    const course = db.prepare("SELECT * FROM courses WHERE id = ?").get(req.params.id);
    if (course) res.json(course);
    else res.status(404).json({ error: "Course not found" });
  });

  app.post("/api/courses", authenticate, (req, res) => {
    const { courseName, courseCode, department, description } = req.body;
    try {
      const result = db.prepare("INSERT INTO courses (courseName, courseCode, department, description) VALUES (?, ?, ?, ?)")
        .run(courseName, courseCode, department, description);
      res.json({ id: result.lastInsertRowid });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.put("/api/courses/:id", authenticate, (req, res) => {
    const { courseName, courseCode, department, description } = req.body;
    db.prepare("UPDATE courses SET courseName = ?, courseCode = ?, department = ?, description = ? WHERE id = ?")
      .run(courseName, courseCode, department, description, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/courses/:id", authenticate, (req, res) => {
    db.prepare("DELETE FROM courses WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Materials
  app.get("/api/materials", (req, res) => {
    const materials = db.prepare(`
      SELECT m.*, c.courseName, c.courseCode 
      FROM materials m 
      JOIN courses c ON m.courseId = c.id
      ORDER BY m.uploadedAt DESC
    `).all();
    res.json(materials);
  });

  app.get("/api/courses/:id/materials", (req, res) => {
    const materials = db.prepare("SELECT * FROM materials WHERE courseId = ? ORDER BY uploadedAt DESC").all(req.params.id);
    res.json(materials);
  });

  app.post("/api/materials", authenticate, (req, res) => {
    const { courseId, title, category, fileType, fileUrl } = req.body;
    const result = db.prepare("INSERT INTO materials (courseId, title, category, fileType, fileUrl) VALUES (?, ?, ?, ?, ?)")
      .run(courseId, title, category || 'Other', fileType, fileUrl);
    res.json({ id: result.lastInsertRowid });
  });

  app.delete("/api/materials/:id", authenticate, (req, res) => {
    db.prepare("DELETE FROM materials WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Announcements
  app.get("/api/announcements", (req, res) => {
    const announcements = db.prepare("SELECT * FROM announcements ORDER BY date DESC").all();
    res.json(announcements);
  });

  app.post("/api/announcements", authenticate, (req, res) => {
    const { title, description } = req.body;
    const result = db.prepare("INSERT INTO announcements (title, description) VALUES (?, ?)")
      .run(title, description);
    res.json({ id: result.lastInsertRowid });
  });

  app.put("/api/announcements/:id", authenticate, (req, res) => {
    const { title, description } = req.body;
    db.prepare("UPDATE announcements SET title = ?, description = ? WHERE id = ?")
      .run(title, description, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/announcements/:id", authenticate, (req, res) => {
    db.prepare("DELETE FROM announcements WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Search
  app.get("/api/search", (req, res) => {
    const q = `%${req.query.q}%`;
    const courses = db.prepare("SELECT * FROM courses WHERE courseName LIKE ? OR courseCode LIKE ?").all(q, q);
    const materials = db.prepare(`
      SELECT m.*, c.courseName 
      FROM materials m 
      JOIN courses c ON m.courseId = c.id 
      WHERE m.title LIKE ?
    `).all(q);
    res.json({ courses, materials });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
