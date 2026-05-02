import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const LOCAL_URI = 'mongodb://127.0.0.1:27017/voguevault';
const ATLAS_URI = 'mongodb+srv://jeeaspiranttt2024_db_user:391b3G9YJ7lg3h2y@shop0.xgjhum7.mongodb.net/voguevault?retryWrites=true&w=majority&appName=Shop0';

async function migrate() {
  console.log('\n🚀 Starting Local → Atlas Migration...\n');

  // Connect to local
  const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
  console.log('✅ Connected to LOCAL MongoDB');

  // Connect to Atlas
  const atlasConn = await mongoose.createConnection(ATLAS_URI).asPromise();
  console.log('✅ Connected to ATLAS MongoDB\n');

  // Get all collection names from local
  const collections = await localConn.db.listCollections().toArray();
  console.log(`📦 Found ${collections.length} collections: ${collections.map(c => c.name).join(', ')}\n`);

  for (const col of collections) {
    const name = col.name;
    const localCollection = localConn.db.collection(name);
    const atlasCollection = atlasConn.db.collection(name);

    const docs = await localCollection.find({}).toArray();
    console.log(`── ${name}: ${docs.length} documents`);

    if (docs.length === 0) {
      console.log(`   ⏭ Skipping (empty)`);
      continue;
    }

    // Clear existing data in Atlas for this collection
    await atlasCollection.deleteMany({});
    console.log(`   🗑 Cleared Atlas collection`);

    // Insert all docs
    await atlasCollection.insertMany(docs);
    console.log(`   ✅ Migrated ${docs.length} documents`);
  }

  console.log('\n🎉 Migration complete! All data is now on Atlas.\n');

  await localConn.close();
  await atlasConn.close();
  process.exit(0);
}

migrate().catch(err => {
  console.error('❌ Migration failed:', err.message);
  process.exit(1);
});
