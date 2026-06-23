import mongoose, { Schema, Document, Model } from 'mongoose';

export type AmbulanceType = 'Basic' | 'ALS' | 'ICU';

export interface IAmbulance {
  name: string;
  slug: string;
  type: AmbulanceType;
  driver: { name: string; phone: string };
  phone: string;
  city: string;
  area: string;
  location: { lat?: number; lng?: number };
  available: boolean;
  price: number;
  rating: number;
  image: string;
  active: boolean;
}

export interface AmbulanceDoc extends IAmbulance, Document {}

const ambulanceSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  type: { type: String, enum: ['Basic', 'ALS', 'ICU'], default: 'Basic' },
  driver: {
    name: { type: String, default: '' },
    phone: { type: String, default: '' },
  },
  phone: { type: String, default: '' },
  city: { type: String, default: '' },
  area: { type: String, default: '' },
  location: {
    lat: { type: Number },
    lng: { type: Number },
  },
  available: { type: Boolean, default: true },
  price: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  image: { type: String, default: '' },
  active: { type: Boolean, default: true },
}, { timestamps: true });

ambulanceSchema.index({ city: 1 });

const Ambulance: Model<AmbulanceDoc> = mongoose.model<AmbulanceDoc>('Ambulance', ambulanceSchema);
export default Ambulance;
