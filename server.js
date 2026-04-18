import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, 'workouts-data.json');

const DEFAULT_DATA = { history: [], lastSession: {}, active: {}, prs: {} };

function readData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return { ...DEFAULT_DATA, ...JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')) };
    }
  } catch (e) {
    console.error('Failed to read data file:', e.message);
  }
  return DEFAULT_DATA;
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/workouts', (req, res) => {
  res.json(readData());
});

app.post('/api/workouts', (req, res) => {
  try {
    writeData(req.body);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Workout server running at http://localhost:${PORT}`);
  console.log(`Data stored at: ${DATA_FILE}`);
});
