const multer = require('multer');
const path = require('path');

// File filter for allowed MIME types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
  ];

  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error('File type not supported');
    error.statusCode = 422;
    return cb(error, false);
  }

  cb(null, true); // Accept the file
};

// Multer storage configuration to save files with original extension
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads'); // Directory where files will be saved
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname); // Extract the file extension
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`); // Generate a unique file name
  },
});

// Multer setup with custom storage and file filter
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 20, // 20MB limit per file
  },
});

module.exports = upload;