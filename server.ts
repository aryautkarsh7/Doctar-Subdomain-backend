import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

// Load .env from the backend root (one level up from dist-server)
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import connectDB from './config/db';
import sharedBookingsRoute from './routes/shared/bookings';
import dataRoutes from './routes/surgery/data';
import doctorsRouter from './routes/surgery/doctors';
import videoRoutes from './routes/surgery/videos';
import blogRoutes from './routes/shared/blogs';
import uploadRoutes from './routes/shared/upload';
import { verifyMailer } from './utils/mailer';

import DoctorClaim from './models/surgery/DoctorClaim';
import resourceRouter from './routes/shared/resource';

import Hospital from './models/surgery/Hospital';
import Doctor from './models/surgery/Doctor';
import Category from './models/surgery/Category';
import Treatment from './models/surgery/Treatment';
import City from './models/shared/City';

// Connect to the database
connectDB();

// Verify the email transporter config
verifyMailer();

const app = express();
const PORT = process.env.PORT || 3001;

// Simple in-memory cache middleware
const _cache: Record<string, { data: any; time: number }> = {};
function cacheMiddleware(duration: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    // originalUrl (not url) — Express rewrites req.url to be relative to the
    // mount path, so different app.use(path, cacheMiddleware(...)) mounts can
    // produce identical relative req.url values and collide in this shared
    // cache object. originalUrl keeps the full, mount-independent path.
    const key = req.originalUrl;
    if (_cache[key] && Date.now() - _cache[key].time < duration) {
      res.json(_cache[key].data);
      return;
    }
    const origJson = res.json.bind(res);
    res.json = (data: any) => {
      _cache[key] = { data, time: Date.now() };
      return origJson(data);
    };
    next();
  };
}

// CORS allowlist — one entry per subdomain/dev origin. Add a new line here
// when a new subdomain goes live; nothing else in this file needs to change.
const ALLOWED_ORIGINS = [
  'https://surgery.doctar.in',
  'https://emergency.doctar.in',
  'https://doctar-surgery-clean-urls.onrender.com',
  'https://emergency-doctar.onrender.com',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
];

const corsOptions: cors.CorsOptions = {
  origin(origin, callback) {
    // No Origin header (curl, server-to-server, same-origin) — allow.
    if (!origin || ALLOWED_ORIGINS.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
};

// Middleware
app.use(compression());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${Date.now() - start}ms)`);
  });
  next();
});

// API documentation
app.get('/api-docs.json', (req: Request, res: Response) => res.json(swaggerSpec));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/data/critical', cacheMiddleware(10 * 60 * 1000));  // 10 min
app.use('/api/data/city',     cacheMiddleware(5  * 60 * 1000));  // 5 min
app.use('/api/categories',    cacheMiddleware(10 * 60 * 1000));  // 10 min
app.use('/api/bookings', sharedBookingsRoute);

import categoriesRoute from './routes/surgery/categories';
app.use('/api/categories', categoriesRoute);

app.get('/api/cities', cacheMiddleware(10 * 60 * 1000), async (req: Request, res: Response) => {
  try {
    const cities = await City.find({})
      .select('name slug state lat lng -_id')
      .sort({ name: 1 })
      .lean();
    res.json({ success: true, total: cities.length, data: cities });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

import treatmentsRoute from './routes/surgery/treatments';
app.use('/api/treatments', treatmentsRoute);

app.use('/api/doctors', doctorsRouter);

import hospitalsRoute from './routes/surgery/hospitals';
app.use('/api/hospitals', hospitalsRoute);

app.use('/api/blogs', blogRoutes);
app.use('/api/videos', videoRoutes);

import reviewsRoute from './routes/surgery/reviews';
app.use('/api/reviews', reviewsRoute);

import faqsRoute from './routes/surgery/faqs';
app.use('/api/faqs', faqsRoute);

import subCategoriesRoute from './routes/surgery/subCategories';
app.use('/api/subcategories', subCategoriesRoute);

import subSubCategoriesRoute from './routes/surgery/subSubCategories';
app.use('/api/subsubcategories', subSubCategoriesRoute);

app.use('/api/doctor-claims', resourceRouter(DoctorClaim, 'DoctorClaim'));

import petHospitalsRoute from './routes/surgery/petHospitals';
app.use('/api/pet-hospitals', petHospitalsRoute);

app.use('/api/data', dataRoutes);
app.use('/api/upload', uploadRoutes);

// ── Emergency subdomain (emergency.doctar.in) ──
// Mounted at the same paths the emergency frontend already expects, except
// the critical-data payload which is namespaced under /api/emergency/data
// because /api/data/critical is already taken by the surgery site's route.
import ambulancesRoute from './routes/emergency/ambulances';
import emergencyCentersRoute from './routes/emergency/emergencyCenters';
import bloodBanksRoute from './routes/emergency/bloodBanks';
import emergencyDataRoute from './routes/emergency/data';

app.use('/api/emergency/data/critical', cacheMiddleware(10 * 60 * 1000)); // 10 min
app.use('/api/emergency/data', emergencyDataRoute);
app.use('/api/ambulances', ambulancesRoute);
app.use('/api/emergency-centers', emergencyCentersRoute);
app.use('/api/blood-banks', bloodBanksRoute);
app.use('/api/emergency-bookings', sharedBookingsRoute);

// Serve uploaded images (WebP/AVIF) at /uploads/<file>
// Adjusted path: __dirname is dist-server, so public is at ../public
app.use('/uploads', express.static(path.join(__dirname, '../public', 'uploads')));

// Admin panel (static HTML)
app.get('/admin', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public', 'admin.html'));
});

// Dedicated fullscreen video manager
app.get('/video-manager', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public', 'video-manager.html'));
});

// Block access to sensitive server-side folders/files
app.use((req: Request, res: Response, next: NextFunction) => {
  const normalizedPath = req.path.toLowerCase();
  if (
    normalizedPath.startsWith('/backend') ||
    normalizedPath.startsWith('/.') ||
    normalizedPath.includes('package')
  ) {
    res.status(403).json({ success: false, message: 'Access denied' });
    return;
  }
  next();
});

// Backend is now purely an API and does not serve frontend static files.
// ==========================================
// SEO ROUTES (Robots.txt & Sitemap)
// ==========================================

app.get('/robots.txt', (req: Request, res: Response) => {
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: https://surgery.doctar.in/sitemap-index.xml`);
});

app.get('/sitemap-index.xml', async (req: Request, res: Response) => {
  const baseUrl = 'https://surgery.doctar.in';
  const today = new Date().toISOString().split('T')[0];
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;

  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

app.get('/sitemap.xml', async (req: Request, res: Response) => {
  try {
    const baseUrl = 'https://surgery.doctar.in';
    
    const [hospitals, doctors, categories, treatments] = 
      await Promise.all([
        Hospital.find({}).select('slug city locality'),
        Doctor.find({}).select('slug categories'),
        Category.find({}).select('slug'),
        Treatment.find({}).select('slug')
      ]);

    const urls: string[] = [];

    // Static pages
    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/specialities/s', priority: '0.9', changefreq: 'weekly' },
      { url: '/surgeons-near-me/s', priority: '0.8', changefreq: 'daily' },
    ];

    // City pages from hospitals
    const cities = [...new Set(hospitals.map(h => h.city).filter(Boolean))];
    cities.forEach(city => {
      const citySlug = (city as string).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      staticPages.push(
        { url: `/hospitals-in-${citySlug}/s`, priority: '0.8', changefreq: 'daily' },
        { url: `/surgeries-in-${citySlug}/s`, priority: '0.7', changefreq: 'weekly' },
        { url: `/surgeons-in-${citySlug}/s`, priority: '0.8', changefreq: 'daily' }
      );
    });

    staticPages.forEach(page => {
      urls.push(`
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>`);
    });

    // Category pages
    categories.forEach(cat => {
      urls.push(`
  <url>
    <loc>${baseUrl}/specialities/${cat.slug}/s</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>`);
    });

    // Treatment pages
    treatments.forEach(t => {
      urls.push(`
  <url>
    <loc>${baseUrl}/treatment/${t.slug}/s</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>`);
    });

    // Hospital pages
    hospitals.forEach(h => {
      const area = (h.locality || h.city || 'india')
        .toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const city = (h.city || 'india')
        .toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      urls.push(`
  <url>
    <loc>${baseUrl}/hospital/${h.slug}/${area}-${city}/s</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>`);
    });

    // Doctor pages
    doctors.forEach(d => {
      const catSlug = (d.categories && d.categories[0]) || 'general';
      urls.push(`
  <url>
    <loc>${baseUrl}/surgeons/${catSlug}/${d.slug}/s</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>`);
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('')}
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);

  } catch(err: any) {
    res.status(500).send('Sitemap error: ' + err.message);
  }
});

// Removed legacy SPA catch-all route because frontend is now hosted separately

// 404 fallback (unmatched API routes + non-GET)
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Catches the Error thrown by the CORS origin callback above and turns it
// into a clean 403 instead of Express's default 500 + stack trace.
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err && typeof err.message === 'string' && err.message.startsWith('Not allowed by CORS')) {
    res.status(403).json({ success: false, message: 'Origin not allowed' });
    return;
  }
  next(err);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
