import mongoose, { Document, Schema } from 'mongoose';

export interface IPetHospital extends Document {
  slug: string;
  name: string;
  type?: string;
  petTypes?: string[];
  phone?: string;
  alternatePhone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  locality?: string;
  landmark?: string;
  overview?: string;
  image?: string;
  logo?: string;
  rating?: number;
  reviews?: number;
  emergencyServices?: boolean;
  hours?: string;
  website?: string;
  map?: {
    lat?: number;
    lng?: number;
    label?: string;
  };
  services?: string[];
  amenities?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const petHospitalSchema = new Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, default: 'Veterinary Clinic' },
  petTypes: [String],
  phone: String,
  alternatePhone: String,
  address: String,
  city: String,
  state: String,
  pincode: String,
  locality: String,
  landmark: String,
  overview: String,
  image: String,
  logo: String,
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  emergencyServices: { type: Boolean, default: false },
  hours: String,
  website: String,
  map: {
    lat: Number,
    lng: Number,
    label: String
  },
  services: [String],
  amenities: [String]
}, { timestamps: true });

export default mongoose.model<IPetHospital>('PetHospital', petHospitalSchema);
