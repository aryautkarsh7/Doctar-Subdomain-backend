import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEmergencyCenter {
  name: string;
  slug: string;
  type: string;
  city: string;
  area: string;
  address: string;
  location: { lat?: number; lng?: number };
  phone: string;
  rating: number;
  services: string[];
  beds: number;
  open24x7: boolean;
  image: string;
  active: boolean;
}

export interface EmergencyCenterDoc extends IEmergencyCenter, Document {}

const emergencyCenterSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  type: { type: String, default: '' },
  city: { type: String, default: '' },
  area: { type: String, default: '' },
  address: { type: String, default: '' },
  location: {
    lat: { type: Number },
    lng: { type: Number },
  },
  phone: { type: String, default: '' },
  rating: { type: Number, default: 0 },
  services: { type: [String], default: [] },
  beds: { type: Number, default: 0 },
  open24x7: { type: Boolean, default: true },
  image: { type: String, default: '' },
  active: { type: Boolean, default: true },
}, { timestamps: true });

emergencyCenterSchema.index({ city: 1 });

const EmergencyCenter: Model<EmergencyCenterDoc> =
  mongoose.model<EmergencyCenterDoc>('EmergencyCenter', emergencyCenterSchema);
export default EmergencyCenter;
