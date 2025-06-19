const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define storage directory
// __dirname is .../solarconnect-feature-branch/backend/middleware
const storageDir = path.join(__dirname, '..', 'public', 'uploads', 'images');

// Ensure storage directory exists
if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true });
}

// Set up storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, storageDir);
  },
  filename: (req, file, cb) => {
    // Create a unique filename: companyId-fieldname-timestamp.ext
    // req.params.id might not be available if multer is processed before route param parsing for all setups.
    // A more robust way for companyId might be to set it on req by an earlier middleware if needed,
    // or use a temporary unique ID initially if company doesn't exist yet.
    // For update scenarios where :id is present, it should work.
    const id = req.params.id || req.user?.id || 'temp_id'; // Fallback for companyId
    const fieldName = file.fieldname; // 'logo' or 'banner'
    const timestamp = Date.now();
    const extension = path.extname(file.originalname);
    cb(null, `${id}-${fieldName}-${timestamp}${extension}`);
  }
});

// File filter to accept only images
const imageFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image file.'), false);
  }
};

// Configure multer upload instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB file size limit
  },
  fileFilter: imageFileFilter
});

module.exports = upload;
