import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  name: string;
  city?: string;
  rating?: number;
  review: string;
  consultation?: string;
  hospital?: string;
  verified?: boolean;
  showOn?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const reviewSchema = new Schema({
  name: { type: String, required: true },
  city: String,
  rating: { type: Number, min: 1, max: 5, default: 5 },
  review: { type: String, required: true },
  consultation: String,
  hospital: String,
  verified: { type: Boolean, default: true },
  showOn: { type: [String], default: ['home'] },
}, { timestamps: true });

export default mongoose.model<IReview>('Review', reviewSchema);
