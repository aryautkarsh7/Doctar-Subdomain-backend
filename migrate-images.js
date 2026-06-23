require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Allow overriding input/output via CLI args; defaults match the Kolkata dataset.
const INPUT_FILE = process.argv[2] || 'hospitals-kolkata-v2.json';
const OUTPUT_FILE = process.argv[3] || 'hospitals-kolkata-cloudinary.json';

async function uploadFromUrl(url, folder) {
  try {
    if (!url || !url.startsWith('http')) return url;
    const result = await cloudinary.uploader.upload(url, {
      folder: folder,
      format: 'webp',
      transformation: [{ width: 1200, crop: 'limit', quality: 'auto' }]
    });
    console.log('Uploaded:', url.substring(0, 50), '→', result.secure_url);
    return result.secure_url;
  } catch (err) {
    console.log('Failed:', url.substring(0, 50), err.message);
    return url; // Keep original if upload fails
  }
}

async function processHospitals() {
  const inputPath = path.resolve(__dirname, INPUT_FILE);
  if (!fs.existsSync(inputPath)) {
    console.error(`Input file not found: ${inputPath}`);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

  for (let i = 0; i < data.length; i++) {
    const h = data[i];
    console.log(`\nProcessing ${i + 1}/${data.length}: ${h.name}`);

    // Upload image
    if (h.image) {
      h.image = await uploadFromUrl(h.image, 'doctar-surgery/hospitals');
    }

    // Upload logo
    if (h.logo) {
      h.logo = await uploadFromUrl(h.logo, 'doctar-surgery/hospitals/logos');
    }

    // Upload gallery
    if (h.gallery && h.gallery.length > 0) {
      const newGallery = [];
      for (const imgUrl of h.gallery) {
        const newUrl = await uploadFromUrl(imgUrl, 'doctar-surgery/hospitals/gallery');
        newGallery.push(newUrl);
      }
      h.gallery = newGallery;
    }
  }

  // Save updated JSON
  fs.writeFileSync(
    path.resolve(__dirname, OUTPUT_FILE),
    JSON.stringify(data, null, 2)
  );
  console.log(`\nDone! Saved to ${OUTPUT_FILE}`);
}

processHospitals();
