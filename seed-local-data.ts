import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/db';
import Hospital from './models/surgery/Hospital';
import Doctor from './models/surgery/Doctor';

async function seed() {
  await connectDB();

  const hospitalsDir = path.join(__dirname, '../data/hospitals');
  const doctorsDir = path.join(__dirname, '../data/cities');

  // 1. Import Hospitals
  if (fs.existsSync(hospitalsDir)) {
    console.log('🧹 Clearing existing Hospitals...');
    await Hospital.deleteMany({});
    
    const files = fs.readdirSync(hospitalsDir).filter(f => f.endsWith('.json'));
    console.log(`📂 Found ${files.length} hospital JSON files. Importing...`);
    
    let totalHops = 0;
    for (const file of files) {
      const filePath = path.join(hospitalsDir, file);
      try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const hospitals = JSON.parse(fileContent);
        if (Array.isArray(hospitals) && hospitals.length > 0) {
          await Hospital.insertMany(hospitals);
          totalHops += hospitals.length;
        }
      } catch (err: any) {
        console.error(`❌ Failed to import hospital file ${file}:`, err.message);
      }
    }
    console.log(`✅ Successfully seeded ${totalHops} hospitals.`);
  } else {
    console.warn(`⚠️ Hospitals directory not found at ${hospitalsDir}`);
  }

  // 2. Import Doctors
  if (fs.existsSync(doctorsDir)) {
    console.log('🧹 Clearing existing Doctors...');
    await Doctor.deleteMany({});
    
    const files = fs.readdirSync(doctorsDir).filter(f => f.endsWith('.json'));
    console.log(`📂 Found ${files.length} doctor JSON files. Importing...`);
    
    let totalDocs = 0;
    for (const file of files) {
      const filePath = path.join(doctorsDir, file);
      try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const doctors = JSON.parse(fileContent);
        if (Array.isArray(doctors) && doctors.length > 0) {
          await Doctor.insertMany(doctors);
          totalDocs += doctors.length;
        }
      } catch (err: any) {
        console.error(`❌ Failed to import doctor file ${file}:`, err.message);
      }
    }
    console.log(`✅ Successfully seeded ${totalDocs} doctors.`);
  } else {
    console.warn(`⚠️ Doctors directory not found at ${doctorsDir}`);
  }

  await mongoose.disconnect();
  console.log('👋 Seeding complete, disconnected from MongoDB.');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seeding process failed:', err);
  process.exit(1);
});
