require('dotenv').config();
const mongoose = require('mongoose');
const SubCategory = require('./models/SubCategory');
const Category = require('./models/Category');

async function fix() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  
  await SubCategory.deleteMany({ categorySlug: { $in: ['general-surgery', 'pediatric-surgery'] } });
  console.log('Deleted subcategories');

  await Category.updateOne({ slug: 'general-surgery' }, { treatmentCount: 10 });
  await Category.updateOne({ slug: 'pediatric-surgery' }, { treatmentCount: 10 });
  console.log('Updated treatmentCount');

  process.exit(0);
}
fix();
