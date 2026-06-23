import mongoose, { Schema, Document, Model } from 'mongoose';

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';
export type BloodAvailability = Record<BloodGroup, boolean>;

export interface IBloodBank {
  name: string;
  slug: string;
  city: string;
  area: string;
  address: string;
  location: { lat?: number; lng?: number };
  phone: string;
  rating: number;
  hospital: string;
  open24x7: boolean;
  availableBlood: BloodAvailability;
  image: string;
  active: boolean;
}

export interface BloodBankDoc extends IBloodBank, Document {}

const bloodBankSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  city: { type: String, default: '' },
  area: { type: String, default: '' },
  address: { type: String, default: '' },
  location: {
    lat: { type: Number },
    lng: { type: Number },
  },
  phone: { type: String, default: '' },
  rating: { type: Number, default: 0 },
  hospital: { type: String, default: '' },
  open24x7: { type: Boolean, default: true },
  availableBlood: {
    'A+':  { type: Boolean, default: false },
    'A-':  { type: Boolean, default: false },
    'B+':  { type: Boolean, default: false },
    'B-':  { type: Boolean, default: false },
    'O+':  { type: Boolean, default: false },
    'O-':  { type: Boolean, default: false },
    'AB+': { type: Boolean, default: false },
    'AB-': { type: Boolean, default: false },
  },
  image: { type: String, default: '' },
  active: { type: Boolean, default: true },
}, { timestamps: true });

bloodBankSchema.index({ city: 1 });

const BloodBank: Model<BloodBankDoc> = mongoose.model<BloodBankDoc>('BloodBank', bloodBankSchema);
export default BloodBank;
