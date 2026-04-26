import { upload } from '../config/multer.js';
import multer from 'multer';

export const uploadMiddleware = (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Catch Multer-specific errors (e.g. file too large)
      return res.status(400).json({ message: `Upload error: ${err.message}` });
    } else if (err) {
      // Catch custom errors (e.g. from fileFilter)
      return res.status(400).json({ message: err.message });
    }
    
    // Ensure file was actually sent
    if (!req.file) {
      return res.status(400).json({ message: 'A valid file is required.' });
    }
    
    next();
  });
};
