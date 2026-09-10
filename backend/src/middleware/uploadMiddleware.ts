import multer from 'multer';
import path from 'path';
import fs from 'fs';

/* =========================================================
   GALLERY IMAGE UPLOAD
========================================================= */

const galleryUploadDirectory = path.join(
  process.cwd(),
  'uploads',
  'gallery'
);

if (!fs.existsSync(galleryUploadDirectory)) {
  fs.mkdirSync(galleryUploadDirectory, {
    recursive: true,
  });
}

const galleryStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, galleryUploadDirectory);
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


/* =========================================================
   DARSHAN VIDEO THUMBNAIL UPLOAD
========================================================= */

const darshanUploadDirectory = path.join(
  process.cwd(),
  'uploads',
  'darshan'
);

if (!fs.existsSync(darshanUploadDirectory)) {
  fs.mkdirSync(darshanUploadDirectory, {
    recursive: true,
  });
}

const darshanStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, darshanUploadDirectory);
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


/* =========================================================
   COMMON IMAGE FILTER
========================================================= */

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


/* =========================================================
   EXPORT UPLOADERS
========================================================= */

export const uploadGalleryImage = multer({
  storage: galleryStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export const uploadDarshanThumbnail = multer({
  storage: darshanStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});