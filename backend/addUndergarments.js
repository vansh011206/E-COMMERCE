import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import connectDB from './config/db.js';

dotenv.config();

const seedUndergarments = async () => {
  try {
    await connectDB();

    console.log('Adding 30 Undergarments products...');

    const undergarments = [];

    // Men's Undergarments (15 items)
    const mensNames = [
      "Classic Cotton Briefs", "Breathable Trunks", "Microfiber Boxer Briefs", "Seamless Boxers",
      "Stretch Cotton Trunks", "Sport Performance Briefs", "Everyday Boxer Shorts", "Comfort Fit Boxers",
      "Athletic Compression Shorts", "Modal Blend Briefs", "Anti-Odor Trunks", "Thermal Long Johns",
      "Low Rise Briefs", "Graphic Print Boxers", "Premium Lounge Boxers"
    ];

    // Women's Undergarments (15 items)
    const womensNames = [
      "Seamless Bralette", "Lace Trim Hipster", "Cotton Boyshorts", "Push-Up T-Shirt Bra",
      "High-Waist Shaping Briefs", "Sports Bra with Removable Pads", "Invisible Thong", "Wireless Comfort Bra",
      "Microfiber Bikini Panties", "Full Coverage Support Bra", "Silk Blend French Knickers", "Lounge Crop Top Bra",
      "Strapless Balconette Bra", "Breathable Mesh Panties", "Maternity Nursing Bra"
    ];

    const brands = ["VogueVault", "ComfortWear", "LuxeBasics", "UrbanStyle", "Aura"];
    const mensImages = [
      "https://images.unsplash.com/photo-1582550186981-d13c9e6bb07d?w=800&q=80",
      "https://images.unsplash.com/photo-1616428784770-5b565a443553?w=800&q=80",
      "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?w=800&q=80"
    ];
    
    const womensImages = [
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80",
      "https://images.unsplash.com/photo-1596558450255-7c0b7be9d56a?w=800&q=80",
      "https://images.unsplash.com/photo-1521406830588-4e892c90bc93?w=800&q=80"
    ];

    // Generate Men's
    for (let i = 0; i < 15; i++) {
      const mrp = Math.floor(Math.random() * 500) + 499; // 499 to 998
      const discount = Math.floor(Math.random() * 3) * 10; // 0, 10, or 20
      const price = mrp - (mrp * discount / 100);

      undergarments.push({
        customId: `ug_m_${Date.now()}_${i}`,
        name: mensNames[i],
        brand: brands[i % brands.length],
        description: "Premium quality men's undergarments designed for all-day comfort and breathability.",
        category: "Undergarments",
        subCategory: "Men",
        price: Math.round(price),
        mrp: mrp,
        discount: discount,
        images: [mensImages[i % mensImages.length], mensImages[(i+1) % mensImages.length]],
        sizes: ["S", "M", "L", "XL"],
        stock: Math.floor(Math.random() * 50) + 10,
        rating: (Math.random() * 1.5 + 3.5).toFixed(1),
        numReviews: Math.floor(Math.random() * 100) + 10,
        isActive: true
      });
    }

    // Generate Women's
    for (let i = 0; i < 15; i++) {
      const mrp = Math.floor(Math.random() * 800) + 599; // 599 to 1398
      const discount = Math.floor(Math.random() * 3) * 10; // 0, 10, or 20
      const price = mrp - (mrp * discount / 100);

      undergarments.push({
        customId: `ug_w_${Date.now()}_${i}`,
        name: womensNames[i],
        brand: brands[i % brands.length],
        description: "Comfortable and stylish women's undergarments crafted with soft, skin-friendly fabrics.",
        category: "Undergarments",
        subCategory: "Women",
        price: Math.round(price),
        mrp: mrp,
        discount: discount,
        images: [womensImages[i % womensImages.length], womensImages[(i+1) % womensImages.length]],
        sizes: ["XS", "S", "M", "L", "XL"],
        stock: Math.floor(Math.random() * 50) + 10,
        rating: (Math.random() * 1.5 + 3.5).toFixed(1),
        numReviews: Math.floor(Math.random() * 100) + 10,
        isActive: true
      });
    }

    await Product.insertMany(undergarments);
    console.log('✅ Successfully added 30 undergarments products!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding undergarments:', error);
    process.exit(1);
  }
};

seedUndergarments();
