/**
 * NODE.JS BACKEND REFERENCE
 * 
 * To run this server:
 * 1. Create a package.json with dependencies: express, multer, cors, uuid
 * 2. Run `npm install`
 * 3. Run `node server.js`
 * 4. In frontend `services/api.ts`, set `USE_REAL_BACKEND = true`
 */

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Storage Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});
const upload = multer({ storage });

// In-memory DB for demo (Replace with MongoDB/Postgres)
const db = {
  models: [],
  collections: []
};

// Routes
app.get('/api/models', (req, res) => {
  res.json(db.models);
});

app.get('/api/models/:id', (req, res) => {
  const model = db.models.find(m => m.id === req.params.id);
  if (!model) return res.status(404).send('Not found');
  res.json(model);
});

app.post('/api/models', upload.single('file'), (req, res) => {
  const meta = JSON.parse(req.body.data);
  const newModel = {
    ...meta,
    id: uuidv4(),
    fileUrl: `http://localhost:${PORT}/uploads/${req.file.filename}`,
    fileName: req.file.originalname,
    createdAt: Date.now()
  };
  db.models.push(newModel);
  res.json(newModel);
});

app.get('/api/collections', (req, res) => {
  res.json(db.collections);
});

app.post('/api/collections', (req, res) => {
  const newCol = {
    ...req.body,
    id: uuidv4(),
    createdAt: Date.now()
  };
  db.collections.push(newCol);
  res.json(newCol);
});

app.get('/api/collections/:id', (req, res) => {
    const col = db.collections.find(c => c.id === req.params.id);
    if (!col) return res.status(404).send('Not found');
    res.json(col);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});