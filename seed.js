/**
 * Seed script — imports CATEGORIES, TREATMENTS, DOCTORS, HOSPITALS
 * from the frontend data.js into MongoDB.
 *
 * Usage:  node seed.js
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('./config/db');
const Category = require('./models/Category');
const Treatment = require('./models/Treatment');
const Doctor = require('./models/Doctor');
const Hospital = require('./models/Hospital');

// Load data.js (a browser script with top-level consts) in a sandbox
function loadFrontendData() {
  const dataPath = path.join(__dirname, '..', 'data.js');
  const code = fs.readFileSync(dataPath, 'utf8');
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(
    code + '\nthis.__data = { CATEGORIES, TREATMENTS, DOCTORS, HOSPITALS };',
    sandbox
  );
  return sandbox.__data;
}

async function seed() {
  await connectDB();

  const { CATEGORIES, TREATMENTS, DOCTORS, HOSPITALS } = loadFrontendData();

  // Flatten TREATMENTS object -> array with categorySlug
  const treatments = [];
  for (const categorySlug of Object.keys(TREATMENTS)) {
    for (const t of TREATMENTS[categorySlug]) {
      treatments.push({ ...t, categorySlug });
    }
  }

  // Clear existing
  await Promise.all([
    Category.deleteMany({}),
    Treatment.deleteMany({}),
    Doctor.deleteMany({}),
    Hospital.deleteMany({}),
  ]);
  console.log('🧹 Cleared existing collections');

  // Insert fresh
  const [cats, treats, docs, hosps] = await Promise.all([
    Category.insertMany(CATEGORIES),
    Treatment.insertMany(treatments),
    Doctor.insertMany(DOCTORS),
    Hospital.insertMany(HOSPITALS),
  ]);

  console.log(`✅ Seeded:
  • Categories: ${cats.length}
  • Treatments: ${treats.length}
  • Doctors:    ${docs.length}
  • Hospitals:  ${hosps.length}`);

  await mongoose.disconnect();
  console.log('👋 Done, disconnected');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
