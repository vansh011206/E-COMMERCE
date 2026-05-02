import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Plus } from 'lucide-react';
import { useAdminStore } from '../store/adminStore';

const AdminProducts = () => {
  const navigate = useNavigate();
  const { products, deleteProduct, initializeData } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const categories = ['All', ...new Set(products.map(p => p.category))].filter(Boolean);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (p.id && p.id.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-[32px] text-[#0A0A0A] font-bold">Products</h1>
          <p className="font-body text-[15px] text-[#999999] mt-1">Manage your catalog and inventory.</p>
        </div>
        <button
          onClick={() => navigate('/admin/products/add')}
          className="h-[44px] px-6 bg-[#0A0A0A] hover:bg-[#333333] text-white rounded-lg font-heading text-[14px] uppercase tracking-wider flex items-center gap-2 transition-colors shrink-0"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      <div className="bg-white border border-[#E8E8E8] rounded-xl overflow-hidden">
        <div className="p-6 border-b border-[#E8E8E8] flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 max-w-[400px]">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999999]" />
            <input
              type="text"
              placeholder="Search products by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-[44px] pl-11 pr-4 bg-[#F5F5F3] border border-[#E8E8E8] rounded-lg font-body text-[14px] text-[#0A0A0A] outline-none focus:border-[#0A0A0A] transition-colors"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-[44px] px-4 bg-[#F5F5F3] border border-[#E8E8E8] rounded-lg font-body text-[14px] text-[#0A0A0A] outline-none focus:border-[#0A0A0A] cursor-pointer min-w-[160px]"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto admin-scrollbar pb-2">
          <table className="w-full border-collapse border-spacing-0">
            <thead>
              <tr className="bg-[#F8F8F6] border-b-[2px] border-[#E8E8E8]">
                <th className="px-6 py-[14px] text-left font-heading text-[12px] uppercase text-[#999999] tracking-[0.1em] font-medium">Product</th>
                <th className="px-6 py-[14px] text-left font-heading text-[12px] uppercase text-[#999999] tracking-[0.1em] font-medium">Category</th>
                <th className="px-6 py-[14px] text-left font-heading text-[12px] uppercase text-[#999999] tracking-[0.1em] font-medium">Price</th>
                <th className="px-6 py-[14px] text-left font-heading text-[12px] uppercase text-[#999999] tracking-[0.1em] font-medium">Stock</th>
                <th className="px-6 py-[14px] text-right font-heading text-[12px] uppercase text-[#999999] tracking-[0.1em] font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-[#F0F0F0] hover:bg-[#FAFAFA] transition-colors"
                  style={{ minHeight: '72px' }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-[44px] h-[56px] rounded-md overflow-hidden bg-[#F5F5F3] border border-[#E8E8E8] shrink-0">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#CCC] font-heading text-[10px]">NO IMG</div>
                        )}
                      </div>
                      <div className="max-w-[250px]">
                        <p className="font-body text-[14px] text-[#0A0A0A] font-medium truncate">{product.name}</p>
                        <p className="font-body text-[12px] text-[#999999] truncate mt-0.5">{product.brand || 'No Brand'} · ID: {product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-body text-[13px] text-[#555555]">{product.category}</p>
                    <p className="font-body text-[12px] text-[#999999]">{product.subCategory}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-mono text-[14px] text-[#0A0A0A] font-medium">₹{(product.price || 0).toLocaleString('en-IN')}</p>
                    {product.mrp && product.mrp > product.price && (
                      <p className="font-mono text-[12px] text-[#999999] line-through">₹{product.mrp.toLocaleString('en-IN')}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {product.stock === 0 ? (
                      <span className="bg-[#FEE2E2] text-[#991B1B] border border-[#FECACA] font-body text-[11px] font-bold uppercase px-2.5 py-1 rounded-full">Out of Stock</span>
                    ) : product.stock < 10 ? (
                      <span className="bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] font-body text-[11px] font-bold uppercase px-2.5 py-1 rounded-full">Low: {product.stock}</span>
                    ) : (
                      <span className="bg-[#D1FAE5] text-[#065F46] border border-[#A7F3D0] font-body text-[11px] font-bold uppercase px-2.5 py-1 rounded-full">In Stock: {product.stock}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-4">
                      <button
                        onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                        className="font-body text-[13px] text-[#555555] hover:text-[#0A0A0A] transition-colors hover:underline font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this product?')) {
                            deleteProduct(product.id);
                          }
                        }}
                        className="font-body text-[13px] text-[#EF4444] hover:text-[#B91C1C] transition-colors hover:underline font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center text-[#999999] font-body text-[14px]">
                    No products found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
