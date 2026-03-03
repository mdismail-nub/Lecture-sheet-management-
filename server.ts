import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import Joi from "joi";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

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
    description TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS materials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    courseId INTEGER NOT NULL,
    title TEXT NOT NULL,
    fileType TEXT NOT NULL,
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
    password TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expiresAt DATETIME NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES admin(id) ON DELETE CASCADE
  );
`);

// Seed Admin if not exists
const adminExists = db.prepare("SELECT * FROM admin WHERE email = ?").get("admin@nub.ac.bd");
if (!adminExists) {
  const hashedPassword = bcrypt.hashSync("admin123", 10);
  db.prepare("INSERT INTO admin (email, password) VALUES (?, ?)").run("admin@nub.ac.bd", hashedPassword);
}

// Seed initial data if empty
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

// Validation Schemas
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const courseSchema = Joi.object({
  courseName: Joi.string().required().min(3),
  courseCode: Joi.string().required().min(3),
  department: Joi.string().required().min(2),
  description: Joi.string().allow(""),
});

const materialSchema = Joi.object({
  courseId: Joi.number().required(),
  title: Joi.string().required().min(3),
  fileType: Joi.string().valid("pdf", "image").required(),
  fileUrl: Joi.string().required(),
});

const announcementSchema = Joi.object({
  title: Joi.string().required().min(3),
  description: Joi.string().required().min(10),
});

// Utility to generate secure tokens
const generateToken = () => crypto.randomBytes(32).toString("hex");

// Middleware
const authenticate = (req: any, res: any, next: any) => {
  const token = req.cookies.admin_token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const session = db.prepare("SELECT * FROM sessions WHERE token = ? AND expiresAt > datetime('now')").get(token);
  if (!session) {
    res.clearCookie("admin_token");
    return res.status(401).json({ error: "Session expired" });
  }

  req.userId = session.userId;
  next();
};

const validateRequest = (schema: Joi.Schema) => (req: any, res: any, next: any) => {
  const { error, value } = schema.validate(req.body, { stripUnknown: true });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  req.validatedBody = value;
  next();
};

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || "3000", 10);

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.use(cookieParser());

  // CORS headers
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  // --- Auth Routes ---
  app.post("/api/auth/login", validateRequest(loginSchema), (req, res) => {
    const { email, password } = req.validatedBody;
    
    const admin = db.prepare("SELECT * FROM admin WHERE email = ?").get(email);
    if (!admin || !bcrypt.compareSync(password, admin.password)) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    
    db.prepare("INSERT INTO sessions (userId, token, expiresAt) VALUES (?, ?, ?)").run(admin.id, token, expiresAt);
    
    res.cookie("admin_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    
    res.json({ success: true, message: "Logged in successfully" });
  });

  app.post("/api/auth/logout", (req, res) => {
    const token = req.cookies.admin_token;
    if (token) {
      db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
    }
    res.clearCookie("admin_token");
    res.json({ success: true });
  });

  app.get("/api/auth/me", (req, res) => {
    const token = req.cookies.admin_token;
    if (!token) return res.json({ authenticated: false });

    const session = db.prepare("SELECT * FROM sessions WHERE token = ? AND expiresAt > datetime('now')").get(token);
    res.json({ authenticated: !!session });
  });

  // --- Courses Routes ---
  app.get("/api/courses", (req, res) => {
    try {
      const courses = db.prepare(`
        SELECT c.*, (SELECT COUNT(*) FROM materials m WHERE m.courseId = c.id) as materialCount 
        FROM courses c
        ORDER BY c.createdAt DESC
      `).all();
      res.json(courses);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/courses/:id", (req, res) => {
    try {
      const course = db.prepare("SELECT * FROM courses WHERE id = ?").get(req.params.id);
      if (!course) return res.status(404).json({ error: "Course not found" });
      res.json(course);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/courses", authenticate, validateRequest(courseSchema), (req, res) => {
    try {
      const { courseName, courseCode, department, description } = req.validatedBody;
      const result = db.prepare("INSERT INTO courses (courseName, courseCode, department, description) VALUES (?, ?, ?, ?)")
        .run(courseName, courseCode, department, description);
      res.json({ id: result.lastInsertRowid, success: true });
    } catch (e: any) {
      if (e.message.includes("UNIQUE")) {
        res.status(400).json({ error: "Course code already exists" });
      } else {
        res.status(500).json({ error: e.message });
      }
    }
  });

  app.put("/api/courses/:id", authenticate, validateRequest(courseSchema), (req, res) => {
    try {
      const { courseName, courseCode, department, description } = req.validatedBody;
      db.prepare("UPDATE courses SET courseName = ?, courseCode = ?, department = ?, description = ? WHERE id = ?")
        .run(courseName, courseCode, department, description, req.params.id);
      res.json({ success: true });
    } catch (e: any) {
      if (e.message.includes("UNIQUE")) {
        res.status(400).json({ error: "Course code already exists" });
      } else {
        res.status(500).json({ error: e.message });
      }
    }
  });

  app.delete("/api/courses/:id", authenticate, (req, res) => {
    try {
      db.prepare("DELETE FROM courses WHERE id = ?").run(req.params.id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // --- Materials Routes ---
  app.get("/api/materials", (req, res) => {
    try {
      const materials = db.prepare(`
        SELECT m.*, c.courseName, c.courseCode 
        FROM materials m 
        JOIN courses c ON m.courseId = c.id
        ORDER BY m.uploadedAt DESC
      `).all();
      res.json(materials);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/courses/:id/materials", (req, res) => {
    try {
      const materials = db.prepare("SELECT * FROM materials WHERE courseId = ? ORDER BY uploadedAt DESC").all(req.params.id);
      res.json(materials);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/materials", authenticate, validateRequest(materialSchema), (req, res) => {
    try {
      const { courseId, title, fileType, fileUrl } = req.validatedBody;
      const result = db.prepare("INSERT INTO materials (courseId, title, fileType, fileUrl) VALUES (?, ?, ?, ?)")
        .run(courseId, title, fileType, fileUrl);
      res.json({ id: result.lastInsertRowid, success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/materials/:id", authenticate, (req, res) => {
    try {
      db.prepare("DELETE FROM materials WHERE id = ?").run(req.params.id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // --- Announcements Routes ---
  app.get("/api/announcements", (req, res) => {
    try {
      const announcements = db.prepare("SELECT * FROM announcements ORDER BY date DESC").all();
      res.json(announcements);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/announcements", authenticate, validateRequest(announcementSchema), (req, res) => {
    try {
      const { title, description } = req.validatedBody;
      const result = db.prepare("INSERT INTO announcements (title, description) VALUES (?, ?)")
        .run(title, description);
      res.json({ id: result.lastInsertRowid, success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put("/api/announcements/:id", authenticate, validateRequest(announcementSchema), (req, res) => {
    try {
      const { title, description } = req.validatedBody;
      db.prepare("UPDATE announcements SET title = ?, description = ? WHERE id = ?")
        .run(title, description, req.params.id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/announcements/:id", authenticate, (req, res) => {
    try {
      db.prepare("DELETE FROM announcements WHERE id = ?").run(req.params.id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // --- Search Route ---
  app.get("/api/search", (req, res) => {
    try {
      const q = `%${req.query.q || ""}%`;
      const courses = db.prepare("SELECT * FROM courses WHERE courseName LIKE ? OR courseCode LIKE ? OR department LIKE ?").all(q, q, q);
      const materials = db.prepare(`
        SELECT m.*, c.courseName, c.courseCode 
        FROM materials m 
        JOIN courses c ON m.courseId = c.id 
        WHERE m.title LIKE ?
      `).all(q);
      res.json({ courses, materials });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
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

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Running on http://localhost:${PORT}`);
  });

  server.on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console.log(`[Server] Port ${PORT} in use, trying ${PORT + 1}...`);
      startServerOnPort(app, PORT + 1);
    } else {
      console.error("[Server] Error:", err);
      throw err;
    }
  });
}

function startServerOnPort(app: any, port: number) {
  const server = app.listen(port, "0.0.0.0", () => {
    console.log(`[Server] Running on http://localhost:${port}`);
  });

  server.on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console.log(`[Server] Port ${port} in use, trying ${port + 1}...`);
      startServerOnPort(app, port + 1);
    } else {
      console.error("[Server] Error:", err);
      throw err;
    }
  });
}

startServer().catch(err => {
  console.error("[Server] Fatal error:", err);
  process.exit(1);
});
