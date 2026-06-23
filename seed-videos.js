require('dotenv').config();
const mongoose = require('mongoose');
const Video = require('./models/Video');

const VIDEOS = [
  { title: 'Piles Treatment — Patient Story', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', doctor_name: 'Dr. Rajesh Sharma', specialty: 'Proctology', platform: 'youtube', type: 'reel', order: 1 },
  { title: 'Cataract Surgery — Real Experience', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', doctor_name: 'Dr. Sneha Reddy', specialty: 'Ophthalmology', platform: 'youtube', type: 'reel', order: 2 },
  { title: 'Knee Replacement Recovery', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', doctor_name: 'Dr. Anil Kapoor', specialty: 'Orthopedics', platform: 'youtube', type: 'reel', order: 3 },
  { title: 'What is Laparoscopic Surgery?', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', doctor_name: 'Dr. Amit Desai', specialty: 'Laparoscopy', duration: '5:32', platform: 'youtube', type: 'landscape', order: 1 },
  { title: 'Signs You Need Knee Replacement', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', doctor_name: 'Dr. Anil Kapoor', specialty: 'Orthopedics', duration: '4:15', platform: 'youtube', type: 'landscape', order: 2 },
  { title: 'LASIK vs Cataract Surgery', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', doctor_name: 'Dr. Sneha Reddy', specialty: 'Ophthalmology', duration: '6:45', platform: 'youtube', type: 'landscape', order: 3 },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  const existing = await Video.countDocuments();
  if (existing > 0) {
    console.log(`Already have ${existing} videos — skipping seed.`);
  } else {
    await Video.insertMany(VIDEOS);
    console.log(`Seeded ${VIDEOS.length} videos.`);
  }
  await mongoose.disconnect();
}

seed().catch(e => { console.error(e); process.exit(1); });
