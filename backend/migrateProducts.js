import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import Product from './models/Product.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PEXELS_KEY = process.env.PEXELS_API_KEY;

// ── Unique product names per subCategory ──
const NAMES = {
  "T-Shirts": [
    "Classic Crew Neck Tee","Oversized Drop Shoulder Tee","Acid Wash Vintage Tee","Striped Cotton T-Shirt",
    "Graphic Print Round Neck","Henley Neck Cotton Tee","Tie-Dye Festival Tee","Polo Collar Sport Tee",
    "Slim Fit V-Neck Tee","Ribbed Muscle Fit Tee","Boxy Cropped Street Tee","Color Block Panel Tee",
    "Essential Plain Cotton Tee","Washed Out Retro Tee","Textured Knit Crew Tee","Embroidered Logo Tee",
    "Raglan Sleeve Baseball Tee","Mock Neck Minimalist Tee","Abstract Art Print Tee","Breathable Mesh Sport Tee"
  ],
  "Shirts": [
    "Oxford Button-Down Shirt","Slim Fit Linen Shirt","Mandarin Collar Kurta Shirt","Checked Flannel Shirt",
    "Denim Trucker Shirt","Vertical Stripe Formal Shirt","Cuban Collar Resort Shirt","Corduroy Overshirt",
    "Classic White Poplin Shirt","Brushed Twill Work Shirt","Chambray Casual Shirt","Paisley Print Shirt",
    "Band Collar Slim Shirt","Windowpane Check Shirt","Utility Pocket Shirt","Camp Collar Relaxed Shirt"
  ],
  "Jeans": [
    "Slim Fit Dark Indigo Jeans","Straight Leg Washed Jeans","Skinny Fit Stretch Denim","Relaxed Taper Jeans",
    "Bootcut Vintage Jeans","Ripped Distressed Jeans","High-Rise Mom Jeans","Wide Leg Palazzo Jeans",
    "Acid Wash Retro Jeans","Carpenter Utility Jeans","Raw Hem Cropped Jeans","Classic Blue Denim Jeans"
  ],
  "Trousers": [
    "Tailored Slim Chinos","Pleated Wide Leg Trousers","Cargo Pocket Jogger Pants","Linen Blend Summer Trousers",
    "Formal Crease Trousers","Drawstring Ankle Pants","Tapered Fit Smart Trousers","Corduroy Relaxed Trousers",
    "Pinstripe Office Trousers","Elasticated Waist Comfort Pants","Straight Fit Cotton Trousers","Tech Stretch Work Pants"
  ],
  "Shorts": [
    "Chino Bermuda Shorts","Athletic Running Shorts","Denim Cut-Off Shorts","Linen Beach Shorts",
    "Cargo Pocket Shorts","Swim Trunk Shorts","Knit Lounge Shorts","Board Surf Shorts",
    "Tailored City Shorts","French Terry Sweat Shorts"
  ],
  "Jeans/Shorts": [
    "Distressed Denim Shorts","Classic Jean Shorts","High-Rise Cutoff Shorts","Cuffed Boyfriend Shorts",
    "Raw Edge Denim Shorts","Slim Fit Jean Shorts","Relaxed Denim Bermudas","Acid Wash Jean Shorts"
  ],
  "Jackets": [
    "Quilted Puffer Jacket","Leather Biker Jacket","Denim Trucker Jacket","Bomber Flight Jacket",
    "Windbreaker Shell Jacket","Corduroy Sherpa Jacket","Blazer Sport Coat","Harrington Classic Jacket",
    "Oversized Shacket","Utility Field Jacket","Hooded Parka Coat","Varsity Letterman Jacket"
  ],
  "Dresses": [
    "Floral Maxi Wrap Dress","Bodycon Ribbed Mini Dress","A-Line Midi Sundress","Shirt Dress with Belt",
    "Slip Satin Evening Dress","Tiered Ruffle Boho Dress","Blazer Mini Dress","Off-Shoulder Cocktail Dress",
    "Pleated Chiffon Gown","Smocked Puff Sleeve Dress","Linen Button-Front Dress","Cutout Bodycon Dress",
    "Flowy Georgette Dress","Knit Sweater Dress","Printed Skater Dress","Embroidered Anarkali Dress"
  ],
  "Tops": [
    "Peplum Ruffle Top","Satin Camisole Top","Oversized Graphic Sweatshirt","Ribbed Crop Top",
    "Wrap Front Blouse","Peasant Embroidered Top","Bardot Off-Shoulder Top","Lace Trim Cami Top",
    "Boxy Pocket Tee","Smocked Puff Sleeve Top","Tie-Front Cropped Blouse","Mesh Panel Bodysuit",
    "Printed Kaftan Top","Halter Neck Tank Top","Button-Up Utility Blouse","Knit Polo Collar Top"
  ],
  "Tops/Leggings": [
    "Printed Tunic & Legging Set","Crop Top with Joggers","Oversized Tee & Legging Combo",
    "Graphic Hoodie & Tight Set","Ribbed Tank & Legging Set","Peplum Top & Legging Duo",
    "Tie-Dye Tee & Legging Set","Floral Tunic & Tregging Set"
  ],
  "Skirts": [
    "Pleated Midi Skirt","Denim A-Line Mini Skirt","Wrap Ruffle Skirt","Leather Pencil Skirt",
    "Floral Print Maxi Skirt","Tiered Boho Skirt","Tennis Pleated Skirt","Satin Bias-Cut Skirt",
    "Button-Front Utility Skirt","Tulle Mesh Overlay Skirt"
  ],
  "Co-ord Sets": [
    "Linen Shirt & Short Set","Ribbed Crop & Wide Pant Set","Printed Blazer & Trouser Set",
    "Tie-Dye Hoodie & Jogger Set","Satin Top & Skirt Set","Knit Vest & Pant Duo",
    "Tropical Print Resort Set","Denim Jacket & Skirt Set","Embroidered Kurta & Pant Set",
    "Color Block Track Set"
  ],
  "Ethnic": [
    "Embroidered Anarkali Suit","Silk Banarasi Kurta","Block Print Cotton Kurta","Chikankari Palazzo Set",
    "Mirror Work Lehenga Set","Printed Salwar Kameez","Bandhani Dupatta Set","Ikat Weave Kurta",
    "Sequin Work Sharara Set","Jacquard Nehru Jacket","Khadi Handloom Kurta","Zari Brocade Sherwani"
  ],
  "Footwear": [
    "Classic White Sneakers","Suede Chelsea Boots","Minimalist Leather Loafers","Running Mesh Trainers",
    "Platform Canvas Sneakers","Strappy Block Heels","Embroidered Kolhapuri Chappals","Slip-On Mules",
    "High-Top Basketball Shoes","Oxford Brogue Shoes","Woven Espadrille Flats","Combat Lace-Up Boots"
  ],
  "Shoes": [
    "Velcro Strap Kids Sneakers","Glitter Ballet Flats","Light-Up LED Shoes","Canvas Slip-On Shoes",
    "Mini Hiking Boots","Cartoon Print Sandals","Colorful Jelly Shoes","Mesh Running Shoes",
    "Mary Jane School Shoes","Buckle Sandal Shoes"
  ],
  "Activewear": [
    "Compression Training Tights","Moisture-Wick Sports Bra","Racerback Tank Top","Running Performance Shorts",
    "Yoga Flow Leggings","Zip-Up Track Jacket","Mesh Panel Workout Top","High-Waist Squat Shorts",
    "Seamless Gym Leggings","DryFit Training Tee","Reflective Running Vest","Crossfit Compression Top"
  ],
  "Accessories": [
    "Leather Crossbody Bag","Aviator Sunglasses","Woven Canvas Belt","Minimalist Digital Watch",
    "Silk Printed Scarf","Beaded Charm Bracelet","Structured Tote Bag","Embroidered Bucket Hat",
    "Statement Hoop Earrings","Leather Card Wallet","Knitted Beanie Cap","Pearl Pendant Necklace",
    "Printed Bandana Scarf","Retro Round Sunglasses","Chain Link Bracelet","Canvas Backpack"
  ],
};

// Pexels search queries per subCategory
const SEARCH_QUERIES = {
  "T-Shirts": "men tshirt fashion model",
  "Shirts": "men formal shirt fashion",
  "Jeans": "denim jeans fashion",
  "Trousers": "men trousers fashion",
  "Shorts": "men shorts casual fashion",
  "Jeans/Shorts": "denim shorts fashion",
  "Jackets": "jacket fashion model",
  "Dresses": "women dress fashion",
  "Tops": "women top blouse fashion",
  "Tops/Leggings": "women leggings outfit",
  "Skirts": "women skirt fashion",
  "Co-ord Sets": "women matching set outfit",
  "Ethnic": "indian ethnic kurta fashion",
  "Footwear": "fashion shoes sneakers",
  "Shoes": "kids shoes colorful",
  "Activewear": "gym workout fitness clothes",
  "Accessories": "fashion accessories bag watch",
};

// Descriptions per subCategory
const DESCRIPTIONS = {
  "T-Shirts": "Crafted from premium breathable cotton for all-day comfort. Features a relaxed modern fit with reinforced stitching. Perfect for layering or wearing solo.",
  "Shirts": "Impeccably tailored with attention to every stitch. Made from premium fabric with a structured collar and clean finish. Ideal for both formal and smart-casual occasions.",
  "Jeans": "Premium stretch denim that moves with you. Crafted for the perfect silhouette with durable hardware and comfortable waistband. A wardrobe essential.",
  "Trousers": "Expertly tailored trousers with a refined drape. Breathable fabric blend ensures comfort from morning meetings to evening outings.",
  "Shorts": "Lightweight and comfortable for warm weather. Features functional pockets and an elastic waistband for the perfect relaxed fit.",
  "Jeans/Shorts": "Classic denim shorts with a modern edge. Durable construction meets effortless style for your summer wardrobe.",
  "Jackets": "Premium outerwear designed for style and function. Quality hardware, warm lining, and a contemporary silhouette make this a must-have layering piece.",
  "Dresses": "Elegant silhouette crafted from flowing premium fabric. Flattering cut with thoughtful details that transition effortlessly from day to night.",
  "Tops": "Versatile top crafted from soft, breathable material. Designed with a flattering cut and premium finish for everyday elegance.",
  "Tops/Leggings": "Coordinated comfort set featuring a stylish top and matching high-waist leggings. Premium stretch fabric for all-day wear.",
  "Skirts": "Beautifully designed skirt with a flattering fit. Premium fabric and thoughtful construction for effortless feminine style.",
  "Co-ord Sets": "Perfectly matched separates for an effortlessly put-together look. Premium fabric and coordinated design for maximum versatility.",
  "Ethnic": "Traditional craftsmanship meets contemporary design. Handcrafted with intricate detailing and premium fabrics celebrating Indian heritage.",
  "Footwear": "Premium comfort meets stylish design. Cushioned insole and durable outsole ensure all-day wearability with every step.",
  "Shoes": "Designed for little feet with comfort and durability in mind. Fun, colorful designs that kids love with easy on-off features.",
  "Activewear": "High-performance athletic wear with moisture-wicking technology. Four-way stretch fabric and flatlock seams for unrestricted movement.",
  "Accessories": "Carefully crafted accessory that adds the finishing touch to any outfit. Premium materials and timeless design for everyday luxury.",
};

// ── Helper: fetch from Pexels ──
async function fetchPexelsImages(query, count = 40) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${Math.min(count, 80)}&orientation=portrait`;
  const res = await fetch(url, { headers: { Authorization: PEXELS_KEY } });
  if (!res.ok) throw new Error(`Pexels error: ${res.status}`);
  const data = await res.json();
  return data.photos.map(p => p.src.large2x || p.src.large || p.src.medium);
}

// ── Helper: upload to Cloudinary ──
async function uploadToCloudinary(imageUrl, folder, publicId) {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: `voguevault/${folder}`,
      public_id: publicId,
      overwrite: true,
      transformation: [{ width: 800, height: 1100, crop: 'fill', gravity: 'auto', quality: 'auto' }]
    });
    return result.secure_url;
  } catch (err) {
    console.error(`  ⚠ Cloudinary upload failed for ${publicId}:`, err.message);
    return imageUrl; // fallback to original
  }
}

// ── Helper: delay ──
const delay = ms => new Promise(r => setTimeout(r, ms));

// ══════════════════════════════════════════════
// MAIN MIGRATION
// ══════════════════════════════════════════════
async function migrate() {
  console.log('\n🚀 Starting Product Migration...\n');

  const products = await Product.find({}).sort({ customId: 1 });
  console.log(`📦 Found ${products.length} products in DB\n`);

  // Group products by subCategory
  const grouped = {};
  for (const p of products) {
    const key = p.subCategory;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(p);
  }

  // Pre-fetch all Pexels images per subCategory
  const pexelsCache = {};
  for (const [subCat, query] of Object.entries(SEARCH_QUERIES)) {
    if (!grouped[subCat]) continue;
    const needed = grouped[subCat].length;
    console.log(`🔍 Fetching Pexels images for "${subCat}" (need ${needed})...`);
    try {
      pexelsCache[subCat] = await fetchPexelsImages(query, Math.min(needed * 2, 80));
      console.log(`   ✅ Got ${pexelsCache[subCat].length} images`);
    } catch (err) {
      console.error(`   ❌ Failed: ${err.message}`);
      pexelsCache[subCat] = [];
    }
    await delay(300); // rate limit
  }

  // Process each subCategory group
  let totalUpdated = 0;
  for (const [subCat, prods] of Object.entries(grouped)) {
    const names = NAMES[subCat] || [`${subCat} Item`];
    const images = pexelsCache[subCat] || [];
    const desc = DESCRIPTIONS[subCat] || "Premium quality product with exceptional craftsmanship.";

    console.log(`\n── Processing ${subCat} (${prods.length} products) ──`);

    for (let i = 0; i < prods.length; i++) {
      const product = prods[i];
      const newName = names[i % names.length] + (i >= names.length ? ` - ${product.brand}` : '');
      
      // Pick 3 different Pexels images
      const img1 = images[(i * 3) % Math.max(images.length, 1)] || product.images[0];
      const img2 = images[(i * 3 + 1) % Math.max(images.length, 1)] || product.images[1] || img1;
      const img3 = images[(i * 3 + 2) % Math.max(images.length, 1)] || product.images[2] || img1;

      // Upload to Cloudinary
      const pid = product.customId;
      console.log(`  📤 [${totalUpdated + 1}/${products.length}] ${pid}: "${newName}"`);

      const cloudUrls = [];
      for (let j = 0; j < 3; j++) {
        const srcUrl = [img1, img2, img3][j];
        const cUrl = await uploadToCloudinary(srcUrl, subCat.replace(/[^a-zA-Z0-9]/g, '_'), `${pid}_${j}`);
        cloudUrls.push(cUrl);
        await delay(200);
      }

      // Update in DB
      await Product.updateOne(
        { _id: product._id },
        {
          $set: {
            name: newName,
            description: desc,
            images: cloudUrls,
          }
        }
      );
      totalUpdated++;
    }
  }

  console.log(`\n✅ Migration complete! Updated ${totalUpdated} products.\n`);
  process.exit(0);
}

migrate().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
