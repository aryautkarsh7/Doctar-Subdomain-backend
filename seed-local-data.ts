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
  
  const scanDirForDoctors = (dir: string) => {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir)
      .filter(f => f.endsWith('.json'))
      .forEach(f => {
        const filePath = path.join(dir, f);
        try {
          const fileContent = fs.readFileSync(filePath, 'utf8');
          const parsed = JSON.parse(fileContent);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Check if it looks like a doctor file (must have specialty or degree in the first item)
            const first = parsed[0];
            if (first && (first.specialty !== undefined || first.degree !== undefined)) {
              doctorFiles.push({ path: filePath, file: f });
            }
          }
        } catch (e) {
          // ignore parsing errors here, handled during actual seed loop
        }
      });
  };

  scanDirForDoctors(downloadsDir);
  scanDirForDoctors(doctorDataDir);
  
  console.log(`📂 Found ${doctorFiles.length} doctor JSON files. Parsing locally...`);
  
  const seenDocs = new Set<string>();
  const docRecords: any[] = [];
  
  for (const { path: filePath, file } of doctorFiles) {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const doctors = JSON.parse(fileContent);
      if (Array.isArray(doctors) && doctors.length > 0) {
        // Derive city name from the first doctor's city property, location, or filename
        const firstDoc = doctors[0];
        let rawCityName = '';
        if (firstDoc.city && typeof firstDoc.city === 'string' && firstDoc.city.trim().length > 0) {
          rawCityName = firstDoc.city;
        } else if (firstDoc.location && typeof firstDoc.location === 'string') {
          rawCityName = firstDoc.location.split(',').pop() || '';
        }
        
        if (!rawCityName.trim()) {
          rawCityName = file.replace('doctar.json', '').replace('.json', '').replace(/\s*\(\d+\)\s*/g, '').replace(/_/g, ' ');
        }
        
        const cityName = normalizeCity(rawCityName);
        console.log(`📄 Parsing doctor file ${file} → City: ${cityName} (${doctors.length} doctors)`);
        
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
