const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect } = require('../middleware/auth');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|svg|pdf/;
    if (allowed.test(path.extname(file.originalname).toLowerCase())) cb(null, true);
    else cb(new Error('Only images and PDFs allowed'));
  },
});

router.post('/upload', protect, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const fileUrl = `${process.env.CLIENT_URL?.replace('5173', '5000') || 'http://localhost:5000'}/uploads/${req.file.filename}`;
  res.json({ url: fileUrl, filename: req.file.filename });
});

router.get('/', protect, (req, res) => {
  try {
    const files = fs.readdirSync(uploadDir).map((filename) => ({
      filename,
      url: `http://localhost:${process.env.PORT || 5000}/uploads/${filename}`,
      size: fs.statSync(path.join(uploadDir, filename)).size,
    }));
    res.json(files);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:filename', protect, (req, res) => {
  try {
    const filePath = path.join(uploadDir, req.params.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
