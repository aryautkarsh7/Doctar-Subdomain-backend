import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Booking from '../../models/shared/Booking';
import Doctor from '../../models/surgery/Doctor';
import Ambulance from '../../models/emergency/Ambulance';
import { sendBookingEmail } from '../../utils/mailer';
const { sendBookingSMS } = require('../../utils/sms');

const ALLOWED_STATUSES = ['pending', 'confirmed', 'dispatched', 'completed', 'cancelled'];

// Generate a confirmation code: "DOC-" + 4 random digits
function generateConfirmationCode(): string {
  return 'DOC-' + Math.floor(1000 + Math.random() * 9000);
}

// POST /api/bookings (or /api/bookings/book) — create a new booking
export async function createBooking(req: Request, res: Response) {
  try {
    // Normalization & Fallbacks
    const name = req.body.name || req.body.patientName;
    const phone = req.body.phone;
    const location = req.body.location || req.body.pickupLocation || 'Not specified';
    const email = req.body.email;
    const patientEmail = req.body.patientEmail || email;

    // Resolve source
    let source = req.body.source;
    if (!source) {
      if (req.body.disease) {
        source = 'surgery.doctar.in';
      } else if (req.body.ambulance || req.body.slug || req.body.reason) {
        source = 'emergency.doctar.in';
      } else {
        source = 'surgery.doctar.in'; // Default fallback
      }
    }

    if (!name || !phone) {
      res.status(400).json({ success: false, message: 'Name and Phone are required' });
      return;
    }

    let bookingData: any = {
      name,
      phone,
      email,
      patientEmail,
      location,
      source,
      status: 'pending',
    };

    let doctorEmail: string | undefined = undefined;

    if (source === 'emergency.doctar.in') {
      const { reason, notes, ambulance, slug } = req.body;
      const ambParam = ambulance || slug;

      // Resolve the ambulance reference
      let ambulanceRef: Types.ObjectId | null = null;
      if (ambParam) {
        if (/^[0-9a-fA-F]{24}$/.test(ambParam)) {
          ambulanceRef = new Types.ObjectId(ambParam);
        } else {
          const amb = await Ambulance.findOne({ slug: ambParam }).select('_id').lean();
          if (amb) ambulanceRef = amb._id as Types.ObjectId;
        }
      }

      bookingData = {
        ...bookingData,
        pickupLocation: location,
        reason: reason || 'Other',
        notes: notes || '',
        ambulance: ambulanceRef,
        confirmationCode: generateConfirmationCode(),
      };
    } else {
      // Surgery / Diagnostics / Default
      const { disease, doctorSlug, doctorName, hospital, appointmentDate, appointmentTime } = req.body;

      if (source === 'surgery.doctar.in' && !disease) {
        res.status(400).json({ success: false, message: 'Disease/Reason of visit is required for surgery bookings' });
        return;
      }

      bookingData = {
        ...bookingData,
        disease: disease || 'Consultation',
        doctorSlug,
        doctorName: doctorName || 'Not specified',
        hospital: hospital || 'Not specified',
        appointmentDate: appointmentDate || '',
        appointmentTime: appointmentTime || '',
      };

      if (doctorSlug) {
        try {
          const doctor = await Doctor.findOne({ slug: doctorSlug }).lean();
          if (doctor && doctor.email) doctorEmail = doctor.email;
        } catch (e: any) {
          console.error('⚠️ Doctor lookup failed:', e.message);
        }
      }
    }

    const booking = await Booking.create(bookingData);
    console.log(`✅ Unified booking saved (${source}):`, booking.name, booking.confirmationCode || '');

    // Trigger non-blocking Email and SMS notifications
    console.log('📨 Dispatching notification emails...');
    sendBookingEmail(booking, doctorEmail).catch(err => {
      console.error('❌ Email notification failed:', err.message);
    });

    console.log('📱 Dispatching SMS notifications...');
    try {
      sendBookingSMS(booking);
    } catch (err: any) {
      console.error('❌ SMS notification failed:', err.message);
    }

    res.status(201).json({ success: true, message: 'Booking received!', data: booking });
  } catch (err: any) {
    console.error('❌ createBooking error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
}

// GET /api/bookings — list bookings (admin, supports filtering by source query)
export async function getAllBookings(req: Request, res: Response) {
  try {
    const filter: any = {};
    if (req.query.source) {
      filter.source = req.query.source;
    }

    const bookings = await Booking.find(filter)
      .populate('ambulance', 'name slug phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, total: bookings.length, data: bookings });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// PUT /api/bookings/:id/status — update a booking's status
export async function updateBookingStatus(req: Request, res: Response) {
  try {
    const { status } = req.body;
    if (!ALLOWED_STATUSES.includes(status)) {
      res.status(400).json({
        success: false,
        message: `Status must be one of: ${ALLOWED_STATUSES.join(', ')}`,
      });
      return;
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }

    res.json({ success: true, message: 'Status updated', data: booking });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}
