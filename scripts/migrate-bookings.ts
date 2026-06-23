import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import connectDB from '../config/db';
import Booking from '../models/shared/Booking';

// Load env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function runMigration() {
  console.log('🔄 Connecting to database for migration...');
  await connectDB();

  const db = mongoose.connection.db;
  if (!db) {
    console.error('❌ Database connection not open');
    process.exit(1);
  }

  const sourceCollection = db.collection('emergencybookings');
  
  // Check if collection exists
  const collections = await db.listCollections({ name: 'emergencybookings' }).toArray();
  if (collections.length === 0) {
    console.log('ℹ️  No "emergencybookings" collection found. Nothing to migrate.');
    process.exit(0);
  }

  const existingEmergencyBookings = await sourceCollection.find({}).toArray();
  console.log(`🔍 Found ${existingEmergencyBookings.length} bookings in "emergencybookings" collection.`);

  if (existingEmergencyBookings.length === 0) {
    console.log('ℹ️  No records to migrate.');
    process.exit(0);
  }

  let migratedCount = 0;
  let skippedCount = 0;

  for (const doc of existingEmergencyBookings) {
    // Check if it's already migrated to avoid duplicates
    const alreadyExists = await Booking.findOne({
      name: doc.patientName || doc.name,
      phone: doc.phone,
      createdAt: doc.createdAt
    }).lean();

    if (alreadyExists) {
      skippedCount++;
      continue;
    }

    // Map fields to unified schema
    await Booking.create({
      name: doc.patientName || doc.name || 'Unknown Patient',
      phone: doc.phone,
      email: doc.email,
      patientEmail: doc.patientEmail || doc.email,
      location: doc.pickupLocation || doc.location || 'Not specified',
      status: doc.status || 'pending',
      source: doc.source || 'emergency.doctar.in',
      createdAt: doc.createdAt || new Date(),
      
      // Emergency fields
      pickupLocation: doc.pickupLocation || doc.location || '',
      reason: doc.reason || 'Other',
      notes: doc.notes || '',
      ambulance: doc.ambulance,
      confirmationCode: doc.confirmationCode
    });

    migratedCount++;
  }

  console.log(`✅ Migration complete!`);
  console.log(`   Migrated: ${migratedCount}`);
  console.log(`   Skipped (already exists): ${skippedCount}`);
  process.exit(0);
}

runMigration().catch(err => {
  console.error('❌ Migration failed:', err.message);
  process.exit(1);
});
