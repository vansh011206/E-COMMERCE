import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
      customId: { type: String },
      name: { type: String, required: true },
      image: { type: String },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      selectedSize: { type: String },
      selectedColor: { type: String }
    }
  ],

  shippingAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine1: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    type: { type: String }
  },

  paymentMethod: { type: String, required: true },
  
  itemsPrice: { type: Number, required: true },
  shippingPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },

  isPaid: { type: Boolean, required: true, default: false },
  paidAt: { type: Date },

  status: { type: String, required: true, default: 'Pending' },
  statusHistory: [
    {
      status: { type: String },
      timestamp: { type: Date, default: Date.now },
      note: { type: String }
    }
  ],
  
  adminNotes: [
    {
      note: { type: String },
      timestamp: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;
