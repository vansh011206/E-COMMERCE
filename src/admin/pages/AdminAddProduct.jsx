import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAdminStore } from '../store/adminStore';

const AdminAddProduct = () => {
  const navigate = useNavigate();
  const { addProduct } = useAdminStore();
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    brand: '',
    description: '',
    category: '',
    subCategory: '',
    price: '',
    mrp: '',
    discount: '',
    stock: '',
    image: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'price' || name === 'mrp' ? { discount: calculateDiscount(name === 'mrp' ? value : prev.mrp, name === 'price' ? value : prev.price) } : {})
    }));
  };

  const calculateDiscount = (mrp, price) => {
    if (!mrp || !price || Number(mrp) <= Number(price)) return '0';
    return Math.round(((Number(mrp) - Number(price)) / Number(mrp)) * 100).toString();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category) {
      toast.error('Please fill required fields');
      return;
    }
    const newProduct = {
      ...formData,
      id: formData.id || `prod_${Date.now().toString().slice(-6)}`,
      price: Number(formData.price),
      mrp: Number(formData.mrp) || Number(formData.price),
      discount: Number(formData.discount) || 0,
      stock: Number(formData.stock) || 0,
      images: [formData.image].filter(Boolean),
      sizes: ['S', 'M', 'L', 'XL'],
      rating: 0,
      reviews: 0
    };
    
    addProduct(newProduct);
    toast.success('Product added successfully!');
    navigate('/admin/products');
  };

  const InputField = ({ label, name, type = 'text', required, ...props }) => (
    <div>
      <label className="font-body text-[13px] text-[#555555] block mb-1.5">{label} {required && '*'}</label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        required={required}
        className="w-full h-[48px] px-4 bg-[#F5F5F3] border border-[#E8E8E8] rounded-lg font-body text-[14px] text-[#0A0A0A] outline-none focus:border-[#0A0A0A] transition-colors placeholder-[#CCCCCC]"
        {...props}
      />
    </div>
  );

  return (
    <div className="w-full max-w-[800px]">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/admin/products')} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#F5F5F3] text-[#555555] transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="font-heading text-[32px] text-[#0A0A0A] font-bold">Add New Product</h1>
          <p className="font-body text-[15px] text-[#999999] mt-1">Create a new product listing in your catalog.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-[#E8E8E8] rounded-[14px] p-8">
          <h2 className="font-heading text-[18px] text-[#0A0A0A] font-bold mb-6 pb-4 border-b border-[#E8E8E8]">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Product Name" name="name" required placeholder="E.g. Classic White T-Shirt" />
            <InputField label="Brand" name="brand" placeholder="E.g. VogueVault" />
            <InputField label="Category" name="category" required placeholder="E.g. Men" />
            <InputField label="Sub-Category" name="subCategory" placeholder="E.g. T-Shirts" />
            <div className="md:col-span-2">
              <label className="font-body text-[13px] text-[#555555] block mb-1.5">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full p-4 bg-[#F5F5F3] border border-[#E8E8E8] rounded-lg font-body text-[14px] text-[#0A0A0A] outline-none focus:border-[#0A0A0A] transition-colors resize-none placeholder-[#CCCCCC]"
                placeholder="Enter detailed product description..."
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#E8E8E8] rounded-[14px] p-8">
          <h2 className="font-heading text-[18px] text-[#0A0A0A] font-bold mb-6 pb-4 border-b border-[#E8E8E8]">Pricing & Inventory</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputField label="Selling Price (₹)" name="price" type="number" required placeholder="0" min="0" />
            <InputField label="MRP (₹)" name="mrp" type="number" placeholder="0" min="0" />
            <InputField label="Stock Quantity" name="stock" type="number" required placeholder="0" min="0" />
            <InputField label="Discount (%)" name="discount" type="number" readOnly className="w-full h-[48px] px-4 bg-[#E8E8E8] border border-[#E8E8E8] rounded-lg font-body text-[14px] text-[#555555] outline-none" />
          </div>
        </div>

        <div className="bg-white border border-[#E8E8E8] rounded-[14px] p-8">
          <h2 className="font-heading text-[18px] text-[#0A0A0A] font-bold mb-6 pb-4 border-b border-[#E8E8E8]">Media</h2>
          <InputField label="Main Image URL" name="image" placeholder="https://..." />
          {formData.image && (
            <div className="mt-4 p-4 border border-[#E8E8E8] rounded-lg inline-block bg-[#F5F5F3]">
              <img src={formData.image} alt="Preview" className="h-32 object-contain rounded" onError={(e) => e.target.style.display = 'none'} />
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-6 pt-4">
          <button type="button" onClick={() => navigate('/admin/products')} className="font-body text-[14px] text-[#999999] hover:text-[#0A0A0A] transition-colors">
            Cancel
          </button>
          <button type="submit" className="h-[48px] px-8 bg-[#0A0A0A] hover:bg-[#333333] text-white rounded-lg font-heading text-[14px] uppercase tracking-wider flex items-center gap-2 transition-all active:scale-95">
            <Save size={18} />
            Save Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAddProduct;
