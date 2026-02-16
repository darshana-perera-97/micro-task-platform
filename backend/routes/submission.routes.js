const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { createSubmission, getUserSubmissions, getSubmissionById } = require('../controllers/submission.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    require('fs').mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  },
});

// All submission routes require authentication
router.use(verifyToken);

// Create submission (with optional image upload)
router.post('/', upload.single('image'), (req, res, next) => {
  // If image is uploaded, add it to the evidence
  if (req.file) {
    req.body.evidence = req.body.evidence || {};
    req.body.evidence.image = `/uploads/${req.file.filename}`;
  }
  next();
}, createSubmission);

// Get user's submissions
router.get('/me', getUserSubmissions);

// Get submission by ID
router.get('/:id', getSubmissionById);

module.exports = router;

