import mongoose, { Document, Schema } from 'mongoose';

export interface IOperatingHour {
  day?: string;
  enabled?: boolean;
  open24?: boolean;
  open?: string;
  close?: string;
}

export interface IHospital extends Document {
  slug: string;
  name: string;
  type?: string;
  ownershipType?: string;
  registrationNumber?: string;
  registrationAuthority?: string;
  registrationYear?: string;
  totalBeds?: number;
  icuBeds?: number;
  totalStaff?: number;
  overview?: string;
  email?: string;
  phone?: string;
  alternatePhone?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  locality?: string;
  landmark?: string;
  emergencyContact?: string;
  emergencyServices?: boolean;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  specialties?: string[];
  services?: string[];
  amenities?: string[];
  metrics?: string[];
  image?: string;
  logo?: string;
  gallery?: string[];
  accreditations?: string[];
  awards?: string[];
  establishedYear?: string;
  operatingHours?: IOperatingHour[];
  map?: {
    left?: number;
    top?: number;
    label?: string;
    lat?: number;
    lng?: number;
  };
  rating?: number;
  reviews?: number;
  distance?: string;
  hours?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const operatingHourSchema = new Schema({
  day: String,
  enabled: Boolean,
  open24: Boolean,
  open: String,
  close: String,
}, { _id: false });

const hospitalSchema = new Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: String,
  ownershipType: String,
  registrationNumber: String,
  registrationAuthority: String,
  registrationYear: String,
  totalBeds: Number,
  icuBeds: Number,
  totalStaff: Number,
  overview: String,
  email: String,
  phone: String,
  alternatePhone: String,
  website: String,
  address: String,
  city: String,
  state: String,
  pincode: String,
  locality: String,
  landmark: String,
  emergencyContact: String,
  emergencyServices: Boolean,
  facebook: String,
  twitter: String,
  instagram: String,
  linkedin: String,
  youtube: String,
  specialties: [String],
  services: [String],
  amenities: [String],
  metrics: [String],
  image: String,
  logo: String,
  gallery: [String],
  accreditations: [String],
  awards: [String],
  establishedYear: String,
  operatingHours: [operatingHourSchema],
  map: {
    left: Number,
    top: Number,
    label: String,
    lat: Number,
    lng: Number,
  },
  rating: Number,
  reviews: Number,
  distance: String,
  hours: String,
}, { timestamps: true });

hospitalSchema.index({ city: 1 });

export default mongoose.model<IHospital>('Hospital', hospitalSchema);
