import mongoose, { Document, Schema } from 'mongoose';

export interface IDoctor extends Document {
  slug: string;
  name: string;
  email?: string;
  specialty?: string;
  degree?: string;
  experience?: string;
  rating?: number;
  reviews?: number;
  fee?: number;
  image?: string;
  iconImage?: string;
  hospital?: string;
  location?: string;
  slots?: string[];
  nextSlot?: string;
  language?: string;
  bio?: string;
  categories?: string[];
  city?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const doctorSchema = new Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: String,
  specialty: String,
  degree: String,
  experience: String,
  rating: Number,
  reviews: Number,
  fee: Number,
  image: String,
  iconImage: { type: String, default: '' },
  hospital: String,
  location: String,
  slots: [String],
  nextSlot: String,
  language: String,
  bio: String,
  categories: [String],
  city: String,
}, { timestamps: true });

doctorSchema.index({ city: 1 });

export default mongoose.model<IDoctor>('Doctor', doctorSchema);
