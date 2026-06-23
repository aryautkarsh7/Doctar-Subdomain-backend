import mongoose, { Document, Schema } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  slug: string;
  content?: string;
  contentType?: 'standard' | 'html';
  excerpt?: string;
  author?: string;
  category: string;
  thumbnail?: string;
  image?: string;
  views?: number;
  siteType?: 'surgery' | 'emergency';
  tags?: string[];
  published?: boolean;
  showOn?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const blogSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, default: '' },
  contentType: { type: String, enum: ['standard', 'html'], default: 'standard' },
  excerpt: String,
  author: { type: String, default: 'Doctar Editorial' },
  category: { type: String, required: true },
  // thumbnail (surgery's original field name) and image (emergency's field
  // name) are kept as separate optional fields rather than unified, since
  // existing surgery posts/UI read `thumbnail` and existing emergency
  // posts/UI read `image` — renaming either would break a live frontend.
  thumbnail: String,
  image: String,
  views: { type: Number, default: 0 },
  // Distinguishes which subdomain a post belongs to; defaults to 'surgery'
  // so all pre-existing posts (created before this field existed) keep
  // their current behavior of showing up on the surgery site.
  siteType: { type: String, enum: ['surgery', 'emergency'], default: 'surgery' },
  tags: [String],
  published: { type: Boolean, default: false },
  showOn: { type: [String], default: ['all'] },
}, { timestamps: true });

export default mongoose.model<IBlog>('Blog', blogSchema);
