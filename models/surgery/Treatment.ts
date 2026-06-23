import mongoose, { Document, Schema } from 'mongoose';

export interface ITreatment extends Document {
  name: string;
  slug: string;
  categorySlug: string;
  subCategorySlug?: string;
  brief?: string;
  recovery?: string;
  costRange?: string;
  procedure?: string;
  benefits?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const treatmentSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  categorySlug: { type: String, required: true, index: true },
  subCategorySlug: { type: String, index: true },
  brief: String,
  recovery: String,
  costRange: String,
  procedure: String,
  benefits: [String],
}, { timestamps: true });

export default mongoose.model<ITreatment>('Treatment', treatmentSchema);
