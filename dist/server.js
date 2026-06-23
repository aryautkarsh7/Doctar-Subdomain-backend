"use strict";
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();
const connectDB = require('./config/db');
const bookingRoutes = require('./routes/booking');
const dataRoutes = require('./routes/data');
const doctorsRouter = require('./routes/doctors');
const videoRoutes = require('./routes/videos');
const blogRoutes = require('./routes/blogs');
const uploadRoutes = require('./routes/upload');
const { verifyMailer } = require('./utils/mailer');
const DoctorClaim = require('./models/DoctorClaim');
const resourceRouter = require('./routes/resource');
// Connect to the database
connectDB();
// Verify the email transporter config
verifyMailer();
const app = express();
const PORT = process.env.PORT || 3001;
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Request logging middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${Date.now() - start}ms)`);
    });
    next();
});
// Routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/categories', require('./routes/categories'));
app.use('/api/treatments', require('./routes/treatments'));
app.use('/api/doctors', doctorsRouter);
app.use('/api/hospitals', require('./routes/hospitals'));
app.use('/api/blogs', blogRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/faqs', require('./routes/faqs'));
app.use('/api/subcategories', require('./routes/subCategories'));
app.use('/api/subsubcategories', require('./routes/subSubCategories'));
app.use('/api/doctor-claims', resourceRouter(DoctorClaim, 'DoctorClaim'));
app.use('/api/pet-hospitals', require('./routes/petHospitals'));
app.use('/api/data', dataRoutes);
app.use('/api/upload', uploadRoutes);
// Serve uploaded images (WebP/AVIF) at /uploads/<file>
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
// Admin panel (static HTML)
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});
// Dedicated fullscreen video manager
app.get('/video-manager', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'video-manager.html'));
});
// Block access to sensitive server-side folders/files
app.use((req, res, next) => {
    const normalizedPath = req.path.toLowerCase();
    if (normalizedPath.startsWith('/backend') ||
        normalizedPath.startsWith('/.') ||
        normalizedPath.includes('package')) {
        return res.status(403).json({ success: false, message: 'Access denied' });
    }
    next();
});
// Serve frontend static files from the parent directory
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../dist')));
    app.use(express.static(path.join(__dirname, '../')));
}
else {
    app.use(express.static(path.join(__dirname, '../')));
}
// SPA catch-all: any non-API GET that didn't match a static file returns the
// app shell so clean URLs (e.g. /hospitals/s) work on direct load / refresh.
// (Express 5 dropped the bare '*' string route, so use a path-less middleware.)
app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api/'))
        return next();
    if (process.env.NODE_ENV === 'production') {
        res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
    }
    else {
        res.sendFile(path.join(__dirname, '..', 'index.html'));
    }
});
// 404 fallback (unmatched API routes + non-GET)
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});
// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
