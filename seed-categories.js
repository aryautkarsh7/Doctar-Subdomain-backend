require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const SubCategory = require('./models/SubCategory');

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const DATA = [
  {
    name: 'General Surgery',
    slug: 'general-surgery',
    icon: '🔪',
    color: '#34d399',
    colorLight: '#d1fae5',
    tags: ['Hernia', 'Gallstone', 'Appendix'],
    image: 'images/service-general.png',
    description: 'Comprehensive surgical care for abdominal, soft-tissue and emergency conditions.',
  },
  {
    name: 'Pediatric Surgery',
    slug: 'pediatric-surgery',
    icon: '🧸',
    color: '#f59e0b',
    colorLight: '#fef3c7',
    tags: ['Hernia', 'Appendix', 'Circumcision'],
    image: 'images/service-general.png',
    description: 'Specialised surgical treatment for infants, children and adolescents.',
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  for (const cat of DATA) {
    // Upsert the parent category (no duplicates — matched by slug)
    await Category.findOneAndUpdate(
      { slug: cat.slug },
      {
        $set: {
          name: cat.name,
          icon: cat.icon,
          color: cat.color,
          colorLight: cat.colorLight,
          tags: cat.tags,
          image: cat.image,
          description: cat.description,
          treatmentCount: 10,
        },
        $setOnInsert: { slug: cat.slug },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`📁 Category ready: ${cat.name} (${cat.slug})`);
  }

  console.log('\n🎉 Done seeding categories.');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
