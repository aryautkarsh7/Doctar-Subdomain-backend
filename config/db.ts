import mongoose from 'mongoose';

// Connect to MongoDB using the URI from environment variables.
// Exits the process on failure so the server doesn't run without a DB.
async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌ MONGODB_URI is not set. Add it to backend/.env');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected');
  } catch (err: any) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
}

export default connectDB;
