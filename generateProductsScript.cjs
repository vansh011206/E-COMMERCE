const fs = require('fs');

const ID_LISTS = {
  Men: {
    'T-Shirts': ['1483985886-078e6abb8e4e', '1521572163474-6864f9cf17ab', '1558618666-fcd25c85cd64', '1503341504249-96bc8f2b4b07', '1618354691373-d851c5c827b2', '1542060748-10c28b62d84b', '1576566588048-b34a62b71f4b', '1509631179647-0177331693ae', '1562157873-818bc0726f68', '1583743814966-8d4f2b9d7c0e'],
    'Shirts': ['1603252109303-e67a8d5be4bf', '1596755094514-f87e34085b2c', '1598033129183-9be1a2c85a81', '1602810318383-e386cc2a3ccf', '1588359348347-9bc6cbbb689e', '1607345566856-3cf6ec9d90e9', '1617137984306-f5064c99e16a', '1571019614242-c5c5dee9f50b', '1572635196237-14b3f281503f', '1620799140408-edb9a42271d6'],
    'Jeans': ['1542272604-787c3835535d', '1475178626620-a4d074967452', '1565084888279-aca607bb00b4', '1624378439799-0b1afa4b5097', '1555689502-c4b22b7b5f28', '1506629082-1e364e0b4099', '1473966968600-fa4f40a38293', '1541099649105-f69ad21f3246', '1560472354-b33ff0ad4a4d', '1598554747436-c9293a239af8'],
    'Jackets': ['1591047139829-d91aecb6caea', '1608233546809-a3bec2e8e4c8', '1516257984-14f30e0d8a15', '1548126032-079a0fb0099d', '1578681994506-b8774fb5f9e6', '1551698618-1dbb9277e63e', '1547861985-e1c2c9d5dff0', '1601924994987-daa67f6e1b39', '1584370848010-d764564f67e9', '1556821840-3a63f8550908'],
    'Trousers': ['1473966968600-fa4f40a38293', '1560472354-b33ff0ad4a4d', '1598300042738-398e8c14ce78', '1536430034589-47b11f66b18d', '1489987707849-d49b7b13e4d7', '1519238263173-4f5f7d5a4cb2', '1552902865-b72c031ac5ea', '1602810316536-a5dd7e2d07f0', '1548372290-11e670a3e044', '1549298916-b41d501d3772'],
    'Shorts': ['1562183241-840b8af23be7', '1531310197839-ccf54634509e', '1519143343419-63a1f685c2e1', '1516478177764-9fe5bd7e9717', '1544194759-7f7e4b1da15e'],
    'Shoes': ['1542291026-5ff9e5a5f4e5', '1608231387042-605f89de8193', '1622921-430c-4a3d-8f3e-b3b4a2e5a5c1', '1549298916-b41d501d3772', '1463100099-8ae50e0a8b3b', '1600585154340-be6161a56a0c', '1551107696-a3b23f2f3f57', '1581142348-3-7c9b8a4d5f3e'],
    'Ethnic': ['1583391099893-28f6c9cb0b4c', '1598300042738-398e8c14ce78', '1606050986-8d2b37b5f6d6', '1591047139829-d91aecb6caea', '1564564321-bfdc0c47e36e'],
    'Activewear': ['1571019614242-c5c5dee9f50b', '1574680096400-f6ec1b7c36a4', '1546519638-68e109498ffc', '1485727220344-cd7ff9b2d4d2', '1594381898411-846ced2a6b36'],
    'Accessories': ['1523170335258-f937568f9114', '1553062407-98eeb64c6a62', '1585386959604-a52873a8ef95', '1491553397782-43399d6b5a4e', '1583391099893-28f6c9cb0b4c']
  },
  Women: {
    'Dresses': ['1515886657353-8a7d6d83e1e5', '1572804013309-59a88b7e6c28', '1496747986-f54ba7de7de6', '1539109136081-3359f8527a5f', '1508214751955-8bc68e65e3bc', '1566174009-9fa5fee67fe4', '1502716119720-f3a3b8429c96', '1549298916-b41d501d3772', '1518895949257-6ddf17b09b0f', '1582562124811-b7e57b61ce2f', '1609709295948-1e4be3b98581', '1623609163841-b3e5c7a17bdf'],
    'Tops': ['1533813341-d0d42a1aa02e', '1571455525313-c81994c7c1cb', '1529139374-3e5fa1a00791', '1481437156560-3205f6a55735', '1583744534046-0aa6a5f9f0b4', '1519355558038-33cf5f5da0b5', '1490481701610-e55b11edb2d0', '1552664730-d307ca884978', '1602088113834-bf03f85440e2', '1603808033192-08d4836fc250'],
    'Jeans': ['1541099649105-f69ad21f3246', '1566150703-d5c61ff64b1d', '1608228510934-2b2b31e9dba4', '1548126032-079a0fb0099d', '1507245784-e5e6c76df39b', '1502088113834-dde1e9b2e5c2', '1598033129183-9be1a2c85a81', '1594938298-e5b0c2b638d6'],
    'Ethnic': ['1610030469211-8d9ec0f8f455', '1583391099893-28f6c9cb0b4c', '1583744534046-0aa6a5f9f0b4', '1602088113834-bf03f85440e2', '1525507397-a4b89f68c8e3', '1571019614242-c5c5dee9f50b', '1606050986-8d2b37b5f6d6', '1583391099893-28f6c9cb0b4c'],
    'Skirts': ['1583496661067-417c99094f95', '1548123378-4a9873a7f9b9', '1609709295948-1e4be3b98581', '1615228402345-f36a22f17617', '1619603364003-2c33e31ea397'],
    'Jackets': ['1591047139829-d91aecb6caea', '1539533018-94b7bbdf2009', '1608228510934-2b2b31e9dba4', '1578681994506-b8774fb5f9e6', '1584370848010-d764564f67e9'],
    'Co-ord Sets': ['1515886657353-8a7d6d83e1e5', '1496747986-f54ba7de7de6', '1508214751955-8bc68e65e3bc', '1529139374-3e5fa1a00791', '1533813341-d0d42a1aa02e'],
    'Footwear': ['1543163981-d6e1b5e4b0e4', '1515347122818-b3b3e2c27ef3', '1579338537-42e24f1b77c1', '1560472354-b33ff0ad4a4d', '1581591524851-c1c7f5f2f3b6', '1616401776-32c2c4b4ed40'],
    'Accessories': ['1548036161-8c6aaf7d8d5c', '1553062407-98eeb64c6a62', '1602088113834-bf03f85440e2', '1523170335258-f937568f9114', '1603808033192-08d4836fc250']
  },
  Kids: {
    'Boys T-Shirts': ['1519457769-2a81db57d7be', '1503944329-7-18b7a4a3e1b', '1534308143909-7-4ab7a4b3e1a', '1565071-c92c-4e53-b53d-2b4acf5c1c5b', '1476234-a92c-4e53-c53d-3b5cde5c2c6c'],
    'Boys Jeans/Shorts': ['1503944329-7-18b7a4a3e1b', '1565071-c92c-4e53-b53d-2b4acf5c1c5b', '1519457769-2a81db57d7be', '1534308143909-7-4ab7a4b3e1a', '1476234-a92c-4e53-c53d-3b5cde5c2c6c'],
    'Girls Dresses': ['1503944329-7-18b7a4a3e1b', '1519457769-2a81db57d7be', '1565071-c92c-4e53-b53d-2b4acf5c1c5b', '1476234-a92c-4e53-c53d-3b5cde5c2c6c', '1534308143909-7-4ab7a4b3e1a'],
    'Girls Tops/Leggings': ['1519457769-2a81db57d7be', '1565071-c92c-4e53-b53d-2b4acf5c1c5b', '1503944329-7-18b7a4a3e1b', '1534308143909-7-4ab7a4b3e1a', '1476234-a92c-4e53-c53d-3b5cde5c2c6c'],
    'Kids Ethnic': ['1476234-a92c-4e53-c53d-3b5cde5c2c6c', '1503944329-7-18b7a4a3e1b', '1519457769-2a81db57d7be', '1565071-c92c-4e53-b53d-2b4acf5c1c5b', '1534308143909-7-4ab7a4b3e1a'],
    'Kids Footwear': ['1565071-c92c-4e53-b53d-2b4acf5c1c5b', '1534308143909-7-4ab7a4b3e1a', '1476234-a92c-4e53-c53d-3b5cde5c2c6c', '1519457769-2a81db57d7be', '1503944329-7-18b7a4a3e1b']
  }
};

const REQUIREMENT = {
  Men: { 'T-Shirts': 8, 'Shirts': 8, 'Jeans': 8, 'Jackets': 6, 'Trousers': 6, 'Shorts': 5, 'Shoes': 6, 'Ethnic': 5, 'Activewear': 5, 'Accessories': 5 },
  Women: { 'Dresses': 10, 'Tops': 8, 'Jeans': 7, 'Ethnic': 8, 'Skirts': 5, 'Jackets': 5, 'Co-ord Sets': 5, 'Footwear': 6, 'Accessories': 5 },
  Kids: { 'Boys T-Shirts': 5, 'Boys Jeans/Shorts': 5, 'Girls Dresses': 5, 'Girls Tops/Leggings': 5, 'Kids Ethnic': 5, 'Kids Footwear': 5 }
};

const BRANDS = ["Zara", "H&M", "Levi's", "Nike", "Adidas", "Puma", "Allen Solly", "Van Heusen", "Jack & Jones", "ONLY", "Vero Moda", "FabIndia", "W", "URBAN EDGE", "NOIR", "DRIFT", "AURA", "BLOOM"];

const randomBrand = () => BRANDS[Math.floor(Math.random() * BRANDS.length)];

const PRICING = {
  'Men T-Shirts': { minP: 399, maxP: 899, minM: 699, maxM: 1499 },
  'Men Shirts': { minP: 599, maxP: 1499, minM: 999, maxM: 2499 },
  'Men Jeans': { minP: 799, maxP: 1999, minM: 1499, maxM: 3499 },
  'Men Jackets': { minP: 1499, maxP: 4999, minM: 2499, maxM: 7999 },
  'Men Trousers': { minP: 799, maxP: 1999, minM: 1499, maxM: 3499 },
  'Men Shorts': { minP: 499, maxP: 999, minM: 899, maxM: 1999 },
  'Men Shoes': { minP: 999, maxP: 3999, minM: 1999, maxM: 5999 },
  'Men Ethnic': { minP: 999, maxP: 2999, minM: 1999, maxM: 4999 },
  'Men Activewear': { minP: 599, maxP: 1499, minM: 999, maxM: 2499 },
  'Men Accessories': { minP: 299, maxP: 999, minM: 599, maxM: 1999 },
  
  'Women Dresses': { minP: 599, maxP: 2499, minM: 999, maxM: 3999 },
  'Women Tops': { minP: 399, maxP: 1299, minM: 799, maxM: 2499 },
  'Women Jeans': { minP: 799, maxP: 1999, minM: 1499, maxM: 3499 },
  'Women Ethnic': { minP: 799, maxP: 4999, minM: 1499, maxM: 7999 },
  'Women Skirts': { minP: 499, maxP: 1499, minM: 999, maxM: 2499 },
  'Women Jackets': { minP: 1499, maxP: 4999, minM: 2499, maxM: 7999 },
  'Women Co-ord Sets': { minP: 999, maxP: 2999, minM: 1999, maxM: 4999 },
  'Women Footwear': { minP: 599, maxP: 2499, minM: 999, maxM: 3999 },
  'Women Accessories': { minP: 299, maxP: 999, minM: 599, maxM: 1999 },
  
  'Kids Boys T-Shirts': { minP: 299, maxP: 899, minM: 499, maxM: 1499 },
  'Kids Boys Jeans/Shorts': { minP: 299, maxP: 899, minM: 499, maxM: 1499 },
  'Kids Girls Dresses': { minP: 299, maxP: 899, minM: 499, maxM: 1499 },
  'Kids Girls Tops/Leggings': { minP: 299, maxP: 899, minM: 499, maxM: 1499 },
  'Kids Kids Ethnic': { minP: 299, maxP: 899, minM: 499, maxM: 1499 },
  'Kids Kids Footwear': { minP: 299, maxP: 899, minM: 499, maxM: 1499 }
};

const getPrice = (cat, sub) => {
  const key = `${cat} ${sub}`;
  const rule = PRICING[key] || { minP: 599, maxP: 1999, minM: 999, maxM: 3999 };
  const price = Math.floor(Math.random() * (rule.maxP - rule.minP) / 100) * 100 + 99;
  const mrp = Math.floor(Math.random() * (rule.maxM - rule.minM) / 100) * 100 + 99 + price;
  const discount = Math.round(((mrp - price) / mrp) * 100);
  return { price, mrp, discount };
};

let products = [];
let prodCounter = 1;
let trendingCount = 0;
let newCount = 0;
let bestCount = 0;

for (const cat in REQUIREMENT) {
  for (const sub in REQUIREMENT[cat]) {
    const numItems = REQUIREMENT[cat][sub];
    const ids = ID_LISTS[cat][sub] || [];
    
    for (let i = 0; i < numItems; i++) {
      const mainId = ids[i % ids.length];
      const img2 = ids[(i + 1) % ids.length];
      const img3 = ids[(i + 2) % ids.length];
      
      const { price, mrp, discount } = getPrice(cat, sub);
      
      let isT = false, isN = false, isB = false;
      if (trendingCount < 25 && Math.random() < 0.2) { isT = true; trendingCount++; }
      if (newCount < 20 && Math.random() < 0.15) { isN = true; newCount++; }
      if (bestCount < 15 && Math.random() < 0.1) { isB = true; bestCount++; }
      
      let type = sub;
      if (sub.includes('T-Shirts') || sub.includes('Shirts') || sub.includes('Tops')) type = 'Topwear';
      if (sub.includes('Jeans') || sub.includes('Trousers') || sub.includes('Shorts') || sub.includes('Skirts') || sub.includes('Leggings')) type = 'Bottomwear';
      if (sub.includes('Jackets')) type = 'Outerwear';
      if (sub.includes('Footwear') || sub.includes('Shoes')) type = 'Footwear';
      if (sub.includes('Accessories')) type = 'Accessories';
      
      products.push({
        id: `prod_${String(prodCounter).padStart(3, '0')}`,
        name: `Premium ${sub.replace('Kids ', '').replace('Boys ', '').replace('Girls ', '')} - Style ${i+1}`,
        brand: randomBrand(),
        description: `Experience ultimate comfort and style with our latest ${sub.toLowerCase()}. Perfect for everyday wear, featuring premium materials and exceptional craftsmanship.`,
        category: cat,
        subCategory: sub.replace('Boys ', '').replace('Girls ', '').replace('Kids ', ''),
        type: type,
        price: price,
        mrp: mrp,
        discount: discount,
        currency: "\u20B9",
        rating: (4 + Math.random()).toFixed(1),
        reviewCount: Math.floor(Math.random() * 5000) + 100,
        images: [
          `https://images.unsplash.com/photo-${mainId}?w=600&q=80`,
          `https://images.unsplash.com/photo-${img2}?w=600&q=80`,
          `https://images.unsplash.com/photo-${img3}?w=600&q=80`
        ],
        colors: [{ name: "Standard", hex: "#1a1a1a" }, { name: "Variant", hex: "#f5f5f5" }],
        sizes: ["S","M","L","XL","XXL"],
        sizesAvailable: { S:true, M:true, L:true, XL: Math.random()>0.5, XXL: Math.random()>0.7 },
        material: "100% Premium Material",
        fit: "Regular",
        pattern: "Solid",
        occasion: "Casual",
        stock: Math.floor(Math.random() * 100) + 10,
        isTrending: isT,
        isNewArrival: isN,
        isBestSeller: isB,
        tags: ["premium", "comfortable", sub.toLowerCase()],
        specifications: {
          "Fabric": "Premium Quality",
          "Fit": "Regular",
          "Wash Care": "Machine Wash"
        },
        reviews: [
          {
            id: `rev_${prodCounter}_1`,
            userName: "Verified Buyer",
            rating: 5,
            comment: "Absolutely love this product! The quality is amazing for the price.",
            date: "2024-03-15",
            helpful: Math.floor(Math.random() * 50),
            verified: true
          }
        ]
      });
      prodCounter++;
    }
  }
}

// Make sure counts are exactly met if they fell short due to random
while(trendingCount < 25) { products[Math.floor(Math.random()*products.length)].isTrending = true; trendingCount++; }
while(newCount < 20) { products[Math.floor(Math.random()*products.length)].isNewArrival = true; newCount++; }
while(bestCount < 15) { products[Math.floor(Math.random()*products.length)].isBestSeller = true; bestCount++; }

const output = `export const products = ${JSON.stringify(products, null, 2)};`;

fs.writeFileSync('src/data/products.js', output);
console.log('Successfully generated products.js with ' + products.length + ' products.');
