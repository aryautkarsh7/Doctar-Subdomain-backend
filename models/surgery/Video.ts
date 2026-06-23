import mongoose, { Document, Schema } from 'mongoose';

export interface IVideo extends Document {
  title: string;
  video_url?: string;
  embed_code?: string;
  doctor_name: string;
  specialty: string;
  thumbnail_url?: string;
  platform: 'youtube' | 'instagram';
  type: 'reel' | 'landscape';
  duration?: string;
  order?: number;
  showOn?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const videoSchema = new Schema({
  title: { type: String, required: true },
  video_url: String,
  embed_code: String,
  doctor_name: { type: String, required: true },
  specialty: { type: String, required: true },
  thumbnail_url: String,
  platform: { type: String, enum: ['youtube', 'instagram'], required: true },
  type: { type: String, enum: ['reel', 'landscape'], required: true },
  duration: String,
  order: { type: Number, default: 0 },
  showOn: { type: [String], default: ['all'] },
}, { timestamps: true });

export default mongoose.model<IVideo>('Video', videoSchema);
