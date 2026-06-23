require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const Treatment = require('./models/Treatment');

function loadFrontendData() {
  const dataPath = path.join(__dirname, '..', 'data.js');
  const code = fs.readFileSync(dataPath, 'utf8');
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(code + '\nthis.__data = { TREATMENTS };', sandbox);
  return sandbox.__data;
}

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const { TREATMENTS } = loadFrontendData();
  
  const treatments = [];
  for (const categorySlug of ['general-surgery', 'pediatric-surgery']) {
    if (TREATMENTS[categorySlug]) {
      for (const t of TREATMENTS[categorySlug]) {
        treatments.push({ ...t, categorySlug });
      }
    }
  }

  // Clear existing treatments for these categories just in case
  await Treatment.deleteMany({ categorySlug: { $in: ['general-surgery', 'pediatric-surgery'] } });
  
  await Treatment.insertMany(treatments);
  console.log(`Inserted ${treatments.length} treatments for general-surgery and pediatric-surgery`);
  process.exit(0);
}

run();
