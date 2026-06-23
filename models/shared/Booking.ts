import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type BookingStatus = 'pending' | 'confirmed' | 'dispatched' | 'completed' | 'cancelled';

export interface IBooking extends Document {
  name: string;
  phone: string;
  email?: string;
  patientEmail?: string;
  location?: string;
  status: BookingStatus;
  source: string;
  createdAt: Date;

  // Surgery specific fields
  disease?: string;
  doctorSlug?: string;
  doctorName?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  hospital?: string;

  // Emergency specific fields
  pickupLocation?: string;
  reason?: string;
  notes?: string;
  ambulance?: Types.ObjectId | null;
  confirmationCode?: string;
}

const bookingSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  patientEmail: { type: String },
  location: { type: String, default: 'Not specified' },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'dispatched', 'completed', 'cancelled'],
    default: 'pending',
  },
  source: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },

  // Surgery specific fields
  disease: { type: String },
  doctorSlug: { type: String },
  doctorName: { type: String, default: 'Not specified' },
  appointmentDate: { type: String, default: '' },
  appointmentTime: { type: String, default: '' },
  hospital: { type: String, default: 'Not specified' },

  // Emergency specific fields
  pickupLocation: { type: String, default: '' },
  reason: {
    type: String,
    enum: ['Accident', 'Cardiac', 'Breathing', 'Stroke', 'Other'],
    default: 'Other',
  },
  notes: { type: String, default: '' },
  ambulance: { type: Schema.Types.ObjectId, ref: 'Ambulance' },
  confirmationCode: { type: String },
});

const Booking: Model<IBooking> = mongoose.model<IBooking>('Booking', bookingSchema, 'bookings');
export default Booking;
