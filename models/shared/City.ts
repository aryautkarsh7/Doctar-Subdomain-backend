import mongoose, { Document, Schema } from 'mongoose';

export interface ICity extends Document {
  name?: string;
  slug?: string;
  state?: string;
  lat?: number;
  lng?: number;
  population?: number;
}

const citySchema = new Schema({
  name: String,
  slug: String,
  state: String,
  lat: Number,
  lng: Number,
  population: Number
});

export default mongoose.model<ICity>('City', citySchema);
