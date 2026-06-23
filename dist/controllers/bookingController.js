"use strict";
const Booking = require('../models/Booking');
const Doctor = require('../models/Doctor');
const { sendBookingEmail } = require('../utils/mailer');
const { sendBookingSMS } = require('../utils/sms');
// POST /api/bookings/book — create a new booking
async function createBooking(req, res) {
    try {
        const { name, phone, disease, email, patientEmail, doctorSlug, doctorName, hospital, location, appointmentDate, appointmentTime, } = req.body;
        if (!name || !phone || !disease) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        const booking = await Booking.create({
            name, phone, disease,
            email,
            patientEmail: patientEmail || email,
            doctorSlug,
            doctorName,
            appointmentDate,
            appointmentTime,
            hospital,
            location,
        });
        console.log('✅ Booking saved:', booking.name);
        // Look up the doctor (by slug) to get their email for notification.
        let doctorEmail = null;
        if (doctorSlug) {
            try {
                const doctor = await Doctor.findOne({ slug: doctorSlug }).lean();
                if (doctor && doctor.email)
                    doctorEmail = doctor.email;
            }
            catch (e) {
                console.error('⚠️  Doctor lookup failed:', e.message);
            }
        }
        console.log('📨 Calling sendBookingEmail...');
        await sendBookingEmail(booking, doctorEmail);
        console.log('📨 sendBookingEmail done');
        // Non-blocking SMS — fire and forget, never delays the response
        sendBookingSMS(booking);
        return res.status(201).json({ success: true, message: 'Booking received!', data: booking });
    }
    catch (err) {
        console.error('❌ createBooking error:', err.message);
        return res.status(500).json({ success: false, error: err.message });
    }
}
// GET /api/bookings/all — list all bookings (newest first)
async function getAllBookings(req, res) {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        return res.json({ success: true, total: bookings.length, data: bookings });
    }
    catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
}
// PUT /api/bookings/:id/status — update a booking's status
const ALLOWED_STATUSES = ['pending', 'confirmed', 'cancelled'];
async function updateBookingStatus(req, res) {
    try {
        const { status } = req.body;
        if (!ALLOWED_STATUSES.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Status must be one of: ${ALLOWED_STATUSES.join(', ')}`,
            });
        }
        const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        return res.json({ success: true, message: 'Status updated', data: booking });
    }
    catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
}
module.exports = { createBooking, getAllBookings, updateBookingStatus };
