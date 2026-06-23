import mongoose, { Document, Schema } from 'mongoose';

export interface IFAQ extends Document {
  question: string;
  answer: string;
  category?: string;
  order?: number;
  showOn?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const faqSchema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  category: String,
  order: { type: Number, default: 0 },
  showOn: { type: [String], default: ['all'] },
}, { timestamps: true });

export default mongoose.model<IFAQ>('FAQ', faqSchema);
