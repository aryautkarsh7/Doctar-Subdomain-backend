import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { v2 as cloudinary } from 'cloudinary';

const router = express.Router();

// Configure Cloudinary from environment variables.
// (dotenv.config() runs in server.js before this module is required.)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryReady = () =>
  Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );

// ONLY these three image types go to Cloudinary — each in its own folder.
// Any other upload type falls back to the local pipeline (unchanged behaviour).
const CLOUD_FOLDERS: Record<string, string> = {
  hospital: 'doctar-surgery/hospitals',
  doctor:   'doctar-surgery/doctors',
  category: 'doctar-surgery/categories',
};

// Local fallback target. Served statically at /uploads.
const UPLOAD_DIR = path.join(__dirname, '..', '..', 'public', 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Keep the original bytes in memory only — nothing is written to disk on the
// Cloudinary path; the local fallback writes only the converted versions.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB max input
  fileFilter: (req, file, cb) => {
    const ok = ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype);
    if (ok) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG and WebP files are allowed'));
    }
  },
});

// Build a unique, filesystem-safe base name from the original filename.
function buildBaseName(originalName: string) {
  const stem = path
    .basename(originalName || 'image', path.extname(originalName || ''))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'image';
  const suffix = crypto.randomBytes(4).toString('hex');
  return `${stem}-${Date.now()}-${suffix}`;
}

// Stream an in-memory buffer to Cloudinary as WebP, capped at 1200px wide.
function uploadBufferToCloudinary(buffer: Buffer, folder: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        format: 'webp',
        resource_type: 'image',
        transformation: [{ width: 1200, crop: 'limit', quality: 'auto' }],
      },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(buffer);
  });
}

/**
 * @openapi
 * /api/upload:
 *   post:
 *     tags: [Shared]
 *     summary: Upload an image (⚠️ No write auth)
 *     description: type=hospital|doctor|category go to Cloudinary as WebP; any other (or omitted) type falls back to a local WebP/AVIF pipeline served from /uploads.
 *     parameters:
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [hospital, doctor, category, general] }
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [image]
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: JPG, PNG or WebP, max 15MB
 *     responses:
 *       200:
 *         description: Upload succeeded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 url: { type: string }
 *                 publicId: { type: string, description: "Present for Cloudinary uploads only" }
 *                 avif: { type: string, nullable: true, description: "Present for local-pipeline uploads only" }
 *       400: { description: No file received, or wrong file type }
 *       500: { description: Cloudinary not configured, or conversion failed }
 */
router.post('/', upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No image file received' });
      return;
    }

    const type = String(req.query.type || 'general').toLowerCase();

    // ── Cloudinary path: hospitals, doctors, categories only ──
    if (CLOUD_FOLDERS[type]) {
      if (!cloudinaryReady()) {
        res.status(500).json({
          success: false,
          message:
            'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in backend/.env',
        });
        return;
      }
      const result = await uploadBufferToCloudinary(req.file.buffer, CLOUD_FOLDERS[type]);
      res.json({ success: true, url: result.secure_url, publicId: result.public_id });
      return;
    }

    // ── Local fallback (everything else): convert to WebP (+ AVIF) on disk ──
    const base = buildBaseName(req.file.originalname);
    const pipeline = sharp(req.file.buffer).rotate(); // respect EXIF orientation
    pipeline.resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true });

    const webpName = `${base}.webp`;
    await pipeline.clone().webp({ quality: 80, effort: 4 }).toFile(path.join(UPLOAD_DIR, webpName));

    let avifUrl = null;
    try {
      const avifName = `${base}.avif`;
      await pipeline.clone().avif({ quality: 55, effort: 4 }).toFile(path.join(UPLOAD_DIR, avifName));
      avifUrl = `/uploads/${avifName}`;
    } catch (avifErr: any) {
      console.warn('AVIF conversion skipped:', avifErr.message);
    }

    res.json({ success: true, url: `/uploads/${webpName}`, avif: avifUrl });
  } catch (err: any) {
    console.error('Image upload failed:', err.message);
    res.status(500).json({ success: false, error: err.message, message: err.message });
  }
});

// Surface multer/file-filter errors as clean JSON.
router.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    res.status(400).json({ success: false, message: err.message });
    return;
  }
  next();
});

export default router;
