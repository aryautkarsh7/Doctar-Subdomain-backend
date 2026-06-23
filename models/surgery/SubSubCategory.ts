import mongoose, { Document, Schema } from 'mongoose';

export interface ISubSubCategory extends Document {
  name: string;
  slug: string;
  categorySlug: string;
  subCategorySlug: string;
  keywords?: string[];
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const subSubCategorySchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  categorySlug: { type: String, required: true },
  subCategorySlug: { type: String, required: true },
  keywords: [String],
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model<ISubSubCategory>('SubSubCategory', subSubCategorySchema);
