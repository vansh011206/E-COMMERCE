import fs from 'fs';

const content = fs.readFileSync('src/data/products.js', 'utf8');

// Replace export statement to parse JSON
const jsonStr = content.replace('export const products = ', '').replace(/;$/, '');
let products = JSON.parse(jsonStr);

const imgMap = {
  'Ethnic Wear': [
    "https://images.unsplash.com/photo-1583391733959-1f510f214314?w=600&q=80",
    "https://images.unsplash.com/photo-1596455607563-ad6193f76b46?w=600&q=80"
  ],
  'Trousers': [
    "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80",
    "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80"
  ],
  'Shirts': [
    "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80",
    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ce3?w=600&q=80"
  ],
  'T-Shirts': [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80"
  ],
  'Jeans': [
    "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80",
    "https://images.unsplash.com/photo-1604176354204-926873812d4e?w=600&q=80"
  ],
  'Jackets': [
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80"
  ],
  'Hoodies & Sweatshirts': [
    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80",
    "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80"
  ],
  'Accessories': [
    "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=600&q=80",
    "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80"
  ],
  'Footwear': [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&q=80"
  ],
  'Dresses': [
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80",
    "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80"
  ],
  'Tops': [
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80"
  ],
  'default': [
    "https://images.unsplash.com/photo-1490578474895-699bc4e3f49f?w=600&q=80",
    "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&q=80"
  ]
};

products = products.map(product => {
  let images = imgMap[product.subCategory];
  if (!images) {
    if (product.type === 'Footwear') images = imgMap['Footwear'];
    else if (product.type === 'Accessories') images = imgMap['Accessories'];
    else images = imgMap['default'];
  }
  
  const prodIdx = parseInt(product.id.replace('prod_', '')) || 0;
  const rotatedImages = [...images];
  if (prodIdx % 2 !== 0) rotatedImages.reverse();
  
  // ensure there are 4 images by repeating
  return {
    ...product,
    images: [rotatedImages[0], rotatedImages[1], rotatedImages[0], rotatedImages[1]]
  };
});

fs.writeFileSync('src/data/products.js', 'export const products = ' + JSON.stringify(products, null, 2) + ';\n');
console.log('Successfully updated product images in products.js');
