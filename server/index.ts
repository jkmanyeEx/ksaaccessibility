import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pool, { initDb, query } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3101;

// Path resolution helper
const isProd = process.env.NODE_ENV === 'production';
const serverDir = isProd ? path.join(__dirname, '..') : __dirname;
const projectRoot = path.join(serverDir, '..');
const clientDistPath = path.join(projectRoot, 'client/dist');
const uploadsDir = path.join(serverDir, 'uploads');

// Setup middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// API Routes
app.get('/api/reports', async (req, res) => {
  try {
    const [rows] = await query('SELECT * FROM reports ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/reports', upload.single('photo'), async (req, res) => {
  try {
    const { student_name, student_id, issue_name, description, severity, suggested_fix } = req.body;
    const photo_path = req.file ? `/uploads/${req.file.filename}` : '';

    const [result] = await query(
      'INSERT INTO reports (student_name, student_id, issue_name, description, severity, suggested_fix, photo_path) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [student_name, student_id, issue_name, description, parseInt(severity), suggested_fix, photo_path]
    );

    const insertId = (result as any).insertId;
    const [newReport] = await query('SELECT * FROM reports WHERE id = ?', [insertId]);
    
    res.status(201).json((newReport as any)[0]);
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Serve static files
app.use(express.static(clientDistPath));

// SPA Catch-all middleware
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
    const indexPath = path.join(clientDistPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
  }
  next();
});

// Initialize DB and Start Server
async function startServer() {
  try {
    await initDb();
    app.listen(port, () => {
      console.log(`ksaaccessibility running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to initialize database, server not started:', error);
  }
}

startServer();
