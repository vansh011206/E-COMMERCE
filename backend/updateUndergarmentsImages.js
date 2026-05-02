import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import Product from './models/Product.js';
import connectDB from './config/db.js';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PEXELS_KEY = process.env.PEXELS_API_KEY;

// Fetch images from Pexels
async function fetchPexelsImages(query, count) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${count}&orientation=portrait`;
  const res = await fetch(url, { headers: { Authorization: PEXELS_KEY } });
  if (!res.ok) throw new Error(`Pexels error: ${res.status}`);
  const data = await res.json();
  return data.photos.map(p => p.src.large2x || p.src.large || p.src.medium);
}

// Upload to Cloudinary
async function uploadToCloudinary(imageUrl, publicId) {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: 'voguevault/undergarments',
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

const delay = ms => new Promise(r => setTimeout(r, ms));

const updateUndergarments = async () => {
  try {
    await connectDB();
    console.log('Fetching products to update...');
    
    const mensProducts = await Product.find({ category: "Undergarments", subCategory: "Men" });
    const womensProducts = await Product.find({ category: "Undergarments", subCategory: "Women" });

    console.log(`Found ${mensProducts.length} Men's and ${womensProducts.length} Women's undergarments.`);

    console.log('Fetching images from Pexels...');
    const mensImages = await fetchPexelsImages("men underwear boxer", Math.max(mensProducts.length * 2, 15));
    await delay(1000);
    const womensImages = await fetchPexelsImages("women lingerie underwear", Math.max(womensProducts.length * 2, 15));

    console.log(`Got ${mensImages.length} Men's images and ${womensImages.length} Women's images from Pexels.`);

    console.log('Updating Men\'s products...');
    for (let i = 0; i < mensProducts.length; i++) {
      const product = mensProducts[i];
      const img1 = mensImages[(i * 2) % mensImages.length];
      const img2 = mensImages[(i * 2 + 1) % mensImages.length] || img1;

      console.log(`  Uploading images for ${product.name}...`);
      const cImg1 = await uploadToCloudinary(img1, `${product.customId}_1`);
      const cImg2 = await uploadToCloudinary(img2, `${product.customId}_2`);

      await Product.updateOne(
        { _id: product._id },
        { $set: { images: [cImg1, cImg2] } }
      );
    }

    console.log('Updating Women\'s products...');
    for (let i = 0; i < womensProducts.length; i++) {
      const product = womensProducts[i];
      const img1 = womensImages[(i * 2) % womensImages.length];
      const img2 = womensImages[(i * 2 + 1) % womensImages.length] || img1;

      console.log(`  Uploading images for ${product.name}...`);
      const cImg1 = await uploadToCloudinary(img1, `${product.customId}_1`);
      const cImg2 = await uploadToCloudinary(img2, `${product.customId}_2`);

      await Product.updateOne(
        { _id: product._id },
        { $set: { images: [cImg1, cImg2] } }
      );
    }

    console.log('✅ Successfully updated all undergarments with Pexels + Cloudinary images!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

updateUndergarments();
