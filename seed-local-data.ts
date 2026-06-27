import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/db';
import Hospital from './models/surgery/Hospital';
import Doctor from './models/surgery/Doctor';

const parentCityMap: Record<string, string> = {
  'karol bagh': 'Delhi',
  'dwarka': 'Delhi',
  'saket': 'Delhi',
  'borivli': 'Mumbai',
  'borivali': 'Mumbai',
  'bhayandar': 'Mumbai',
  'kukatpalli': 'Hyderabad',
  'secunderabad': 'Hyderabad',
  'kamarhati': 'Kolkata',
  'panihati': 'Kolkata',
  'shyamnagar': 'Kolkata'
};

function normalizeCity(name: string): string {
  const clean = name.trim().toLowerCase();
  if (parentCityMap[clean]) {
    return parentCityMap[clean];
  }
  // Proper capitalization
  return name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

async function seed() {
  await connectDB();

  const hospitalsDir = '/Users/aryautkarsh/Downloads/hospitals';
  const downloadsDir = '/Users/aryautkarsh/Downloads';
  const doctorDataDir = '/Users/aryautkarsh/Downloads/doctor-data';

  // 1. Import Hospitals
  if (fs.existsSync(hospitalsDir)) {
    console.log('🧹 Clearing existing Hospitals...');
    await Hospital.deleteMany({});
    
    const files = fs.readdirSync(hospitalsDir).filter(f => f.endsWith('.json'));
    console.log(`📂 Found ${files.length} hospital JSON files. Parsing locally...`);
    
    const seenHops = new Set<string>();
    const hospRecords: any[] = [];
    
    for (const file of files) {
      const filePath = path.join(hospitalsDir, file);
      // Derive city name from filename
      const rawCityName = file.replace('.json', '').replace(/_/g, ' ');
      const cityName = normalizeCity(rawCityName);
      
      try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const hospitals = JSON.parse(fileContent);
        if (Array.isArray(hospitals)) {
          for (const hosp of hospitals) {
            if (hosp.slug && hosp.name && !seenHops.has(hosp.slug)) {
              seenHops.add(hosp.slug);
              hosp.city = cityName;
              hospRecords.push(hosp);
            }
          }
        }
      } catch (err: any) {
        console.error(`❌ Failed to parse hospital file ${file}:`, err.message);
      }
    }
    
    console.log(`🚀 Bulk inserting ${hospRecords.length} unique hospitals...`);
    if (hospRecords.length > 0) {
      await Hospital.insertMany(hospRecords);
    }
    console.log(`✅ Successfully seeded ${hospRecords.length} unique hospitals in bulk.`);
  } else {
    console.warn(`⚠️ Hospitals directory not found at ${hospitalsDir}`);
  }

  // 2. Import Doctors
  console.log('🧹 Clearing existing Doctors...');
  await Doctor.deleteMany({});
  
  const doctorFiles: { path: string, file: string }[] = [];
  
  // Scan main downloads folder
  if (fs.existsSync(downloadsDir)) {
    fs.readdirSync(downloadsDir)
      .filter(f => f.endsWith('doctar.json'))
      .forEach(f => doctorFiles.push({ path: path.join(downloadsDir, f), file: f }));
  }
  
  // Scan doctor-data subfolder
  if (fs.existsSync(doctorDataDir)) {
    fs.readdirSync(doctorDataDir)
      .filter(f => f.endsWith('doctar.json'))
      .forEach(f => doctorFiles.push({ path: path.join(doctorDataDir, f), file: f }));
  }
  
  console.log(`📂 Found ${doctorFiles.length} doctor JSON files. Parsing locally...`);
  
  const seenDocs = new Set<string>();
  const docRecords: any[] = [];
  
  for (const { path: filePath, file } of doctorFiles) {
    // Derive city name from filename
    const rawCityName = file.replace('doctar.json', '').replace(/_/g, ' ');
    const cityName = normalizeCity(rawCityName);
    
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const doctors = JSON.parse(fileContent);
      if (Array.isArray(doctors)) {
        for (const doc of doctors) {
          if (doc.slug && doc.name && !seenDocs.has(doc.slug)) {
            seenDocs.add(doc.slug);
            doc.city = cityName;
            docRecords.push(doc);
          }
        }
      }
    } catch (err: any) {
      console.error(`❌ Failed to parse doctor file ${file}:`, err.message);
    }
  }
  
  console.log(`🚀 Bulk inserting ${docRecords.length} unique doctors...`);
  if (docRecords.length > 0) {
    await Doctor.insertMany(docRecords);
  }
  console.log(`✅ Successfully seeded ${docRecords.length} unique doctors in bulk.`);

  await mongoose.disconnect();
  console.log('👋 Seeding complete, disconnected from MongoDB.');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seeding process failed:', err);
  process.exit(1);
});
