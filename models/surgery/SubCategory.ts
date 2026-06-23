import mongoose, { Document, Schema } from 'mongoose';

export interface ISubCategory extends Document {
  name: string;
  slug: string;
  categorySlug: string;
  description?: string;
  icon?: string;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const subCategorySchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  categorySlug: { type: String, required: true, index: true },
  description: String,
  icon: String,
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model<ISubCategory>('SubCategory', subCategorySchema);
