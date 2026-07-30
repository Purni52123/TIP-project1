/* ============================================
   PLANORA — Seed Script
   Run once:  node seed.js
   Seeds the 12 Northeast India places into MongoDB.
   ============================================ */

require('dotenv').config();
const mongoose = require('mongoose');
const Place    = require('./models/Place');

const PLACES = [
  {
    id: 1,
    name: "Living Root Bridge, Cherrapunji",
    location: "Cherrapunji, Meghalaya",
    img: "images/living_root_bridge.jpg",
    category: "trekking",
    height: "tall",
    description: "Ancient living bridges woven from rubber tree roots over centuries."
  },
  {
    id: 2,
    name: "Café Shillong",
    location: "Police Bazaar, Shillong",
    img: "images/cafe_shillong.jpg",
    category: "food",
    height: "short",
    description: "Cosy music café famous for local brews and live acoustic sessions."
  },
  {
    id: 3,
    name: "Ri Kynjai Resort",
    location: "Umiam Lake, Meghalaya",
    img: "images/ri_kynjai_resort.jpg",
    category: "accommodation",
    height: "medium",
    description: "Luxury lakeside resort with panoramic views of Umiam Lake."
  },
  {
    id: 4,
    name: "Dzükou Valley Trek",
    location: "Kohima, Nagaland",
    img: "images/dzukou_valley.jpg",
    category: "trekking",
    height: "short",
    description: "Pristine alpine valley blanketed with seasonal wildflowers."
  },
  {
    id: 5,
    name: "Dawki River & Umngot",
    location: "Dawki, Meghalaya",
    img: "images/dawki_river.jpg",
    category: "nature",
    height: "tall",
    description: "Crystal-clear river so transparent boats appear to float in air."
  },
  {
    id: 6,
    name: "Nagaland Kitchen",
    location: "Dimapur, Nagaland",
    img: "images/nagaland_kitchen.jpg",
    category: "food",
    height: "medium",
    description: "Authentic Naga tribal cuisine — smoky pork and bamboo shoot delicacies."
  },
  {
    id: 7,
    name: "Laitlum Canyon Trek",
    location: "Shillong, Meghalaya",
    img: "images/laitlum_canyon.jpg",
    category: "trekking",
    height: "short",
    description: "Dramatic canyon overlooks with sweeping views of the Khasi hills."
  },
  {
    id: 8,
    name: "Cherrapunji Holiday Resort",
    location: "Cherrapunji, Meghalaya",
    img: "images/cherrapunji_resort.jpg",
    category: "accommodation",
    height: "tall",
    description: "Perched at the edge of the world's wettest place with misty valley views."
  },
  {
    id: 9,
    name: "Dylan's Café",
    location: "Laitumkhrah, Shillong",
    img: "images/dylans_cafe.jpg",
    category: "food",
    height: "medium",
    description: "Bohemian café beloved for its artisanal coffee and all-day breakfast."
  },
  {
    id: 10,
    name: "Kaziranga National Park",
    location: "Golaghat, Assam",
    img: "images/kaziranga.png",
    category: "nature",
    height: "medium",
    description: "UNESCO World Heritage Site — home to two-thirds of the world's one-horned rhinos."
  },
  {
    id: 11,
    name: "Hornbill Festival Grounds",
    location: "Kisama, Nagaland",
    img: "images/hornbill_festival.jpg",
    category: "entertainment",
    height: "tall",
    description: "Annual festival showcasing all Naga tribes through music, dance and crafts."
  },
  {
    id: 12,
    name: "Jade Bistro",
    location: "Police Bazaar, Shillong",
    img: "images/jade_bistro.jpg",
    category: "food",
    height: "short",
    description: "Popular bistro blending Northeast Indian flavours with global cuisine."
  }
];

async function seed() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/planora';
    console.log(`\n🌱 Connecting to MongoDB at: ${uri}`);
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    // Clear existing places to avoid duplicates on re-run
    await Place.deleteMany({});
    console.log('🗑️  Cleared existing places collection');

    const inserted = await Place.insertMany(PLACES);
    console.log(`🎉 Seeded ${inserted.length} places into MongoDB\n`);

    inserted.forEach(p => console.log(`   [${p.id}] ${p.name} (${p.category})`));

  } catch (err) {
    console.error('\n❌ Seeding failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

seed();
