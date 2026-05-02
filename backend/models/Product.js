import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  customId: { type: String, required: true, unique: true }, // For prod_001 etc
  name: { type: String, required: true },
  brand: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  price: { type: Number, required: true },
  mrp: { type: Number, required: true },
  discount: { type: Number, required: true, default: 0 },
  images: [{ type: String, required: true }],
  sizes: [{ type: String, required: true }],
  stock: { type: Number, required: true, default: 0 },
  rating: { type: Number, required: true, default: 0 },
  reviews: [reviewSchema],
  numReviews: { type: Number, required: true, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
