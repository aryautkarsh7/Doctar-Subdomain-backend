import { Router } from 'express';
import { createBooking, getAllBookings, updateBookingStatus } from '../../controllers/shared/bookingController';

const router = Router();

/**
 * @openapi
 * /api/bookings:
 *   post:
 *     tags: [Shared]
 *     summary: Create a booking (Surgery, Emergency, or Diagnostic)
 *     description: Unified endpoint supporting multi-tenant subdomains. Inferred based on disease/ambulance fields if source is omitted.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, phone]
 *             properties:
 *               name: { type: string }
 *               phone: { type: string }
 *               source: { type: string, example: "surgery.doctar.in" }
 *               email: { type: string }
 *               patientEmail: { type: string }
 *               location: { type: string }
 *               disease: { type: string, description: "Required if source is surgery.doctar.in" }
 *               doctorSlug: { type: string }
 *               doctorName: { type: string }
 *               appointmentDate: { type: string }
 *               appointmentTime: { type: string }
 *               hospital: { type: string }
 *               pickupLocation: { type: string }
 *               reason: { type: string }
 *               notes: { type: string }
 *               ambulance: { type: string, description: "Ambulance ID or slug" }
 *     responses:
 *       201: { description: Booking created }
 *       400: { description: Missing required parameters }
 *   get:
 *     tags: [Shared]
 *     summary: List all bookings across all subdomains (admin)
 *     parameters:
 *       - in: query
 *         name: source
 *         schema: { type: string }
 *         description: Optional filter by subdomain source
 *     responses:
 *       200: { description: List of bookings }
 */
router.post('/', createBooking);
router.post('/book', createBooking); // surgery backward compatibility
router.get('/all', getAllBookings); // admin panel backward compatibility
router.get('/', getAllBookings);
router.put('/:id/status', updateBookingStatus);

export default router;
