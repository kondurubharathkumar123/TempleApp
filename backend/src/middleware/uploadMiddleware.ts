import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDirectory = path.join(
  process.cwd(),
  'uploads',
  'gallery'
);

// Make sure the directory exists
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    const baseName = path
      .basename(file.originalname, extension)
      .replace(/[^a-zA-Z0-9-_]/g, '-')
      .toLowerCase();

    const uniqueName = `${baseName}-${Date.now()}${extension}`;

    cb(null, uniqueName);
  },
});

const fileFilter: multer.Options['fileFilter'] = (
  _req,
  file,
  cb
) => {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Only JPG, JPEG, PNG and WEBP images are allowed'
      )
    );
  }
};

export const uploadGalleryImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
