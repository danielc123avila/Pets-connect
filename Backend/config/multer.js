import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { createThumbnail } from './imagenUtils.js';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes (JPEG, PNG, JPG)'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 3 // Máximo 3 archivos
  }
});

// Middleware para procesar thumbnails
const processImages = async (req, res, next) => {
  if (!req.files) return next();
  
  try {
    req.files = await Promise.all(
      req.files.map(async file => {
        const thumbnailPath = await createThumbnail(file.path);
        return {
          path: file.path,
          filename: file.filename,
          thumbnail: thumbnailPath
        };
      })
    );
    next();
  } catch (error) {
    next(error);
  }
};

export const uploadMiddleware = [upload.array('fotos'), processImages];
