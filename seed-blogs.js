const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = require('./config/db');
const Blog = require('./models/Blog');

const blogs = [
  {
    title: '5 Signs You Need Knee Replacement Surgery',
    slug: '5-signs-you-need-knee-replacement-surgery',
    author: 'Dr. Anil Kapoor',
    category: 'Orthopedics',
    excerpt: 'Knee pain affecting daily life? Here are 5 signs that indicate you might need knee replacement surgery.',
    content: `<p>Knee pain can slowly start affecting daily movement, sleep, and independence. If pain medicines, physiotherapy, and lifestyle changes are no longer helping, it may be time to discuss knee replacement surgery with an orthopedic specialist.</p><p>Common signs include persistent pain, difficulty climbing stairs, swelling, reduced mobility, and pain that continues even at rest. A consultation and imaging can help confirm whether surgery is the right next step.</p>`,
    thumbnail: 'images/service-general.png',
    tags: ['Knee Replacement', 'Orthopedics', 'Joint Pain'],
    published: true,
    showOn: ['all'],
  },
  {
    title: 'Cataract Surgery: What to Expect',
    slug: 'cataract-surgery-what-to-expect',
    author: 'Dr. Sneha Reddy',
    category: 'Ophthalmology',
    excerpt: 'Everything you need to know before, during and after your cataract surgery procedure.',
    content: `<p>Cataract surgery is a short and commonly performed procedure where the cloudy natural lens is replaced with a clear artificial lens. Most patients return home the same day and notice improved vision within a few days.</p><p>Your doctor will explain lens options, pre-surgery eye drops, recovery precautions, and follow-up visits. Avoid rubbing the eye and follow the medication schedule carefully after surgery.</p>`,
    thumbnail: 'images/service-neuro.png',
    tags: ['Cataract', 'Eye Surgery', 'Ophthalmology'],
    published: true,
    showOn: ['all'],
  },
  {
    title: 'Laser Treatment for Piles: Complete Guide',
    slug: 'laser-treatment-for-piles-complete-guide',
    author: 'Dr. Rajesh Sharma',
    category: 'Proctology',
    excerpt: 'Modern laser treatment for piles is painless with same-day discharge. Read the complete guide.',
    content: `<p>Laser treatment for piles is a minimally invasive option that uses focused laser energy to shrink hemorrhoidal tissue. It usually involves less pain, minimal bleeding, and faster recovery compared with traditional surgery.</p><p>The procedure is often done as a day-care treatment. Your surgeon will assess the grade of piles, symptoms, and medical history before recommending the best treatment plan.</p>`,
    thumbnail: 'images/about-surgery.png',
    tags: ['Piles', 'Laser Treatment', 'Proctology'],
    published: true,
    showOn: ['all'],
  },
];

async function seedBlogs() {
  await connectDB();

  for (const blog of blogs) {
    await Blog.findOneAndUpdate(
      { slug: blog.slug },
      blog,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  console.log(`Seeded ${blogs.length} blogs.`);
  process.exit(0);
}

seedBlogs().catch(err => {
  console.error('Blog seed failed:', err);
  process.exit(1);
});
