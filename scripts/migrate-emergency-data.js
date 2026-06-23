// One-off migration: copy Emergency's real data (ambulances, emergency
// centers, blood banks, bookings, blogs) from the doctar-emergency DB into
// Surgery's doctar DB, on the same MongoDB Atlas cluster, now that both
// subdomains' resources live in one backend.
//
// Run once with: node backend/scripts/migrate-emergency-data.js
// Safe to re-run: every insert is upserted by slug (or _id for bookings),
// so re-running does not duplicate documents.

const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const SURGERY_URI = process.env.MONGODB_URI;
const EMERGENCY_URI = SURGERY_URI.replace(/\/doctar(\?|$)/, '/doctar-emergency$1');

async function migrate() {
  const surgeryConn = await mongoose.createConnection(SURGERY_URI).asPromise();
  const emergencyConn = await mongoose.createConnection(EMERGENCY_URI).asPromise();
  console.log('Connected to both doctar (surgery) and doctar-emergency.');

  const results = {};

  // ── Ambulances, EmergencyCenters, BloodBanks: copy verbatim, upsert by slug ──
  for (const collName of ['ambulances', 'emergencycenters', 'bloodbanks']) {
    const srcDocs = await emergencyConn.db.collection(collName).find().toArray();
    let upserts = 0;
    for (const doc of srcDocs) {
      await surgeryConn.db.collection(collName).updateOne(
        { slug: doc.slug },
        { $set: doc },
        { upsert: true }
      );
      upserts++;
    }
    results[collName] = { source: srcDocs.length, upserted: upserts };
  }

  // ── Bookings -> emergencybookings: copy verbatim (own collection, ambulance
  // ObjectId refs stay valid since ambulances were just copied with the same _id) ──
  {
    const srcDocs = await emergencyConn.db.collection('bookings').find().toArray();
    let upserts = 0;
    for (const doc of srcDocs) {
      await surgeryConn.db.collection('emergencybookings').updateOne(
        { _id: doc._id },
        { $set: doc },
        { upsert: true }
      );
      upserts++;
    }
    results['bookings -> emergencybookings'] = { source: srcDocs.length, upserted: upserts };
  }

  // ── Blogs: merge into Surgery's shared blogs collection, tagged siteType: 'emergency' ──
  {
    const srcDocs = await emergencyConn.db.collection('blogs').find().toArray();
    let upserts = 0;
    for (const doc of srcDocs) {
      const { _id, ...rest } = doc;
      await surgeryConn.db.collection('blogs').updateOne(
        { slug: doc.slug },
        { $set: { ...rest, siteType: 'emergency' } },
        { upsert: true }
      );
      upserts++;
    }
    results['blogs (siteType=emergency)'] = { source: srcDocs.length, upserted: upserts };
  }

  // ── Cities: dedupe by slug, only insert what's missing ──
  {
    const srcDocs = await emergencyConn.db.collection('cities').find().toArray();
    const existingSlugs = new Set(
      (await surgeryConn.db.collection('cities').find().project({ slug: 1 }).toArray()).map(c => c.slug)
    );
    const missing = srcDocs.filter(c => !existingSlugs.has(c.slug));
    if (missing.length) {
      await surgeryConn.db.collection('cities').insertMany(missing);
    }
    results['cities (dedup by slug)'] = { source: srcDocs.length, alreadyPresent: srcDocs.length - missing.length, inserted: missing.length };
  }

  console.log(JSON.stringify(results, null, 2));

  await surgeryConn.close();
  await emergencyConn.close();
}

migrate().then(() => {
  console.log('Migration complete.');
  process.exit(0);
}).catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
