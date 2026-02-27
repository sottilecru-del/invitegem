import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;
  const isProd = process.env.NODE_ENV === "production";

  // Database setup
  const db = new Database("rsvps.db");
  db.exec(`
    CREATE TABLE IF NOT EXISTS rsvps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT,
      attending TEXT NOT NULL,
      guests INTEGER,
      allergies TEXT,
      other_allergies TEXT,
      song TEXT,
      transport TEXT,
      message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  app.use(express.json());

  // API routes
  app.post("/api/rsvp", (req, res) => {
    try {
      const { 
        name, 
        email, 
        attending, 
        guests, 
        allergies, 
        other_allergies, 
        song, 
        transport, 
        message 
      } = req.body;

      const stmt = db.prepare(`
        INSERT INTO rsvps (name, email, attending, guests, allergies, other_allergies, song, transport, message)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        name, 
        email, 
        attending, 
        guests, 
        JSON.stringify(allergies), 
        other_allergies, 
        song, 
        transport, 
        message
      );

      res.status(201).json({ success: true, message: "RSVP received! Thank you." });
    } catch (error) {
      console.error("RSVP Error:", error);
      res.status(500).json({ success: false, message: "Failed to save RSVP." });
    }
  });

  // Get all RSVPs (simple protected route or just for testing)
  app.get("/api/rsvps", (req, res) => {
    const rows = db.prepare("SELECT * FROM rsvps ORDER BY created_at DESC").all();
    res.json(rows);
  });

  // Vite middleware for development
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
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
