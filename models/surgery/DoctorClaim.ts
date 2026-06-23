import mongoose, { Document, Schema } from 'mongoose';

export interface IDoctorClaim extends Document {
  doctorSlug?: string;
  doctorName: string;
  claimantName: string;
  email: string;
  phone: string;
  regNumber?: string;
  message?: string;
  status?: 'pending' | 'approved' | 'rejected';
  createdAt?: Date;
  updatedAt?: Date;
}

const doctorClaimSchema = new Schema({
  doctorSlug: String,
  doctorName: { type: String, required: true },
  claimantName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  regNumber: String,
  message: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });

export default mongoose.model<IDoctorClaim>('DoctorClaim', doctorClaimSchema);
