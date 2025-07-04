import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 5000;

// Required for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(bodyParser.json());

const FILE_PATH = path.join(__dirname, 'contacts.xlsx');

app.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

app.post('/submit', (req, res) => {
    const { name, phone, time, reason } = req.body;

    let workbook, worksheet;
    if (fs.existsSync(FILE_PATH)) {
        workbook = XLSX.readFile(FILE_PATH);
        worksheet = workbook.Sheets[workbook.SheetNames[0]];
    } else {
        workbook = XLSX.utils.book_new();
        worksheet = XLSX.utils.json_to_sheet([]);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Contacts');
    }

    const data = XLSX.utils.sheet_to_json(worksheet);
    // Check if phone already exists
    const phoneExists = data.some(entry => String(entry.Phone) === String(phone));
    if (phoneExists) {
        return res.json({ success: false, message: 'Phone number already exists in the database.' });
    }
    data.push({ Name: name, Phone: phone, Time: time, Reason: reason });

    const updatedSheet = XLSX.utils.json_to_sheet(data);
    workbook.Sheets[workbook.SheetNames[0]] = updatedSheet;

    XLSX.writeFile(workbook, FILE_PATH);
    res.json({ success: true, message: 'Saved to Excel' });
});

app.listen(PORT, () => {
    console.log(`🚀 Backend running at http://localhost:${PORT}`);
});