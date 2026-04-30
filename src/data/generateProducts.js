import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const brands = ["Zara", "H&M", "Levi's", "Nike", "Adidas", "Puma", "Allen Solly", "Van Heusen", "URBAN EDGE", "NOIR", "DRIFT", "AURA", "Jack & Jones", "ONLY", "Vero Moda", "FabIndia", "W", "Global Desi"];

const menImages = [
  "https://images.unsplash.com/photo-1516826957135-73ff61a225eb?w=600&q=80",
  "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80",
  "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&q=80",
  "https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?w=600&q=80",
  "https://images.unsplash.com/photo-1490578474895-699bc4e3f49f?w=600&q=80"
];

const womenImages = [
  "https://images.unsplash.com/photo-1515347619362-67fd8b27eb4a?w=600&q=80",
  "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600&q=80",
  "https://images.unsplash.com/photo-1550639525-c97d455acf70?w=600&q=80",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80",
  "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=600&q=80"
];

const kidImages = [
  "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=600&q=80",
  "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600&q=80",
  "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&q=80",
  "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600&q=80"
];

const productTypes = {
  Men: {
    categories: ["T-Shirts", "Shirts", "Jeans", "Trousers", "Jackets", "Hoodies & Sweatshirts", "Shorts", "Activewear", "Ethnic Wear", "Shoes", "Accessories"],
    types: ["Topwear", "Topwear", "Bottomwear", "Bottomwear", "Topwear", "Topwear", "Bottomwear", "Activewear", "Topwear", "Footwear", "Accessories"]
  },
  Women: {
    categories: ["Dresses", "Tops", "T-Shirts", "Jeans & Trousers", "Skirts", "Jackets & Blazers", "Ethnic", "Co-ord Sets", "Activewear", "Shoes", "Accessories"],
    types: ["Topwear", "Topwear", "Topwear", "Bottomwear", "Bottomwear", "Topwear", "Topwear", "Topwear", "Activewear", "Footwear", "Accessories"]
  },
  Kids: {
    categories: ["Boys T-Shirts & Shirts", "Boys Jeans & Shorts", "Girls Dresses & Tops", "Girls Leggings & Skirts", "Kids Shoes", "Kids Ethnic Wear"],
    types: ["Topwear", "Bottomwear", "Topwear", "Bottomwear", "Footwear", "Topwear"]
  }
};

const colorsPool = [
  { name: "Charcoal Black", hex: "#1a1a1a" },
  { name: "Off White", hex: "#f5f0e8" },
  { name: "Olive", hex: "#556B2F" },
  { name: "Navy Blue", hex: "#000080" },
  { name: "Maroon", hex: "#800000" },
  { name: "Mustard", hex: "#FFDB58" }
];

let globalId = 1;

function generateProducts(gender, count, startId) {
  const products = [];
  const { categories, types } = productTypes[gender];
  
  for (let i = 0; i < count; i++) {
    const catIndex = Math.floor(Math.random() * categories.length);
    const subCategory = categories[catIndex];
    const type = types[catIndex];
    const brand = brands[Math.floor(Math.random() * brands.length)];
    
    const mrp = Math.floor(Math.random() * 15000) + 499;
    const discount = Math.floor(Math.random() * 60) + 10;
    const price = Math.floor(mrp - (mrp * discount / 100));
    
    let images = gender === "Men" ? menImages : gender === "Women" ? womenImages : kidImages;
    // Shuffle images
    images = [...images].sort(() => 0.5 - Math.random()).slice(0, 4);
    
    products.push({
      id: `prod_${String(globalId++).padStart(3, '0')}`,
      name: `${brand} ${gender}'s Premium ${subCategory}`,
      brand: brand,
      description: `Premium quality ${subCategory.toLowerCase()} from ${brand}. Features comfortable fit and excellent material suitable for everyday wear.`,
      category: gender,
      subCategory: subCategory,
      type: type,
      price: price,
      mrp: mrp,
      discount: discount,
      currency: "₹",
      rating: Number((Math.random() * 2 + 3).toFixed(1)),
      reviewCount: Math.floor(Math.random() * 5000),
      images: images,
      colors: colorsPool.sort(() => 0.5 - Math.random()).slice(0, 3),
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      sizesAvailable: { "XS": Math.random() > 0.5, "S": true, "M": true, "L": true, "XL": Math.random() > 0.3, "XXL": Math.random() > 0.7 },
      material: "Premium Cotton Blend",
      fit: Math.random() > 0.5 ? "Regular" : "Slim",
      pattern: Math.random() > 0.5 ? "Solid" : "Printed",
      occasion: "Casual",
      season: "All Season",
      stock: Math.floor(Math.random() * 100) + 5,
      isTrending: Math.random() > 0.8,
      isNewArrival: Math.random() > 0.8,
      isBestSeller: Math.random() > 0.85,
      tags: ["fashion", "premium", type.toLowerCase(), gender.toLowerCase()],
      specifications: {
        "Fabric": "Premium Cotton Blend",
        "Fit": "Regular/Slim",
        "Wash Care": "Machine Wash"
      },
      reviews: [
        {
          id: `rev_${Math.random().toString(36).substr(2, 5)}`,
          userName: "Customer",
          rating: 5,
          comment: "Excellent product, highly recommended!",
          date: "2024-12-15",
          helpful: Math.floor(Math.random() * 50),
          verified: true
        }
      ]
    });
  }
  return products;
}

const allProducts = [
  ...generateProducts("Men", 90),
  ...generateProducts("Women", 90),
  ...generateProducts("Kids", 70)
];

const fileContent = `export const products = ${JSON.stringify(allProducts, null, 2)};`;

const dir = path.join(__dirname);
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(path.join(__dirname, 'products.js'), fileContent);
console.log("Successfully generated 250 products!");
