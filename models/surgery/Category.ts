import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  id?: number;
  name: string;
  slug: string;
  icon?: string;
  iconImage?: string;
  color?: string;
  colorLight?: string;
  treatmentCount?: number;
  tags?: string[];
  description?: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const categorySchema = new Schema({
  id: Number,
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  icon: String,
  iconImage: String,
  color: String,
  colorLight: String,
  treatmentCount: Number,
  tags: [String],
  description: String,
  image: String,
}, { timestamps: true });

export default mongoose.model<ICategory>('Category', categorySchema);
