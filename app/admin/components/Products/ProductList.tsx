"use client";

import React, { useState, useMemo } from 'react';
import { Search, Edit, Trash2, Plus, Image as ImageIcon, ExternalLink, Loader2, Star, Tag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface ProductImage {
  id: string;
  url: string;
}

interface ProductItem {
  id: string;
  name: string;
  title: string;
  slug: string;
  price: number;
  comparePrice?: number | null;
  stock: number;
  category: string;
  categoryId?: string | null;
  description?: string;
  isFeatured?: boolean;
  specs?: string | null;
  imageUrl?: string;
  images: ProductImage[];
}

interface ProductListProps {
  products: ProductItem[];
  existingCategories: string[];
  onProductUpdated: () => void;
  onAddMediaClicked: (id: string) => void;
  onManageImagesClicked: (id: string) => void;
}

export default function ProductList({
  products,
  existingCategories,
  onProductUpdated,
  onAddMediaClicked,
  onManageImagesClicked,
}: ProductListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Edit Modal State
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editComparePrice, setEditComparePrice] = useState('');
  const [editStock, setEditStock] = useState('0');
  const [editCategory, setEditCategory] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editFeatured, setEditFeatured] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const startEdit = (p: ProductItem) => {
    setEditingProduct(p);
    setEditName(p.name || p.title);
    setEditPrice(p.price.toString());
    setEditComparePrice(p.comparePrice ? p.comparePrice.toString() : '');
    setEditStock(p.stock.toString());
    setEditCategory(p.category || '');
    setEditDesc(p.description || '');
    setEditFeatured(!!p.isFeatured);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setIsSavingEdit(true);
    try {
      const res = await fetch('/api/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingProduct.id,
          name: editName,
          price: parseFloat(editPrice),
          comparePrice: editComparePrice ? parseFloat(editComparePrice) : null,
          stock: parseInt(editStock) || 0,
          category: editCategory,
          description: editDesc,
          isFeatured: editFeatured,
        }),
      });

      if (res.ok) {
        setEditingProduct(null);
        onProductUpdated();
      } else {
        alert('Failed to save product updates.');
      }
    } catch {
      alert('Error updating product.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Permanently delete "${name}" and all its photos?`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        onProductUpdated();
      } else {
        alert('Failed to delete product.');
      }
    } catch {
      alert('Error deleting product.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === 'ALL' || p.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Top Filter Bar */}
      <div className="bg-[#111927] border border-slate-800 rounded-3xl p-4 md:p-6 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search component name, category..."
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-11 px-4 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-200 text-xs font-semibold focus:border-cyan-400 focus:outline-none w-full sm:w-auto"
          >
            <option value="ALL">All Categories ({products.length})</option>
            {existingCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product List Cards */}
      {filteredProducts.length === 0 ? (
        <div className="bg-[#111927] border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
          <p className="text-sm">No components match your search filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProducts.map((product) => {
            const firstImg = product.images?.[0]?.url || product.imageUrl || '';
            const imgCount = product.images?.length || (product.imageUrl ? 1 : 0);

            return (
              <div
                key={product.id}
                className="bg-[#111927]/90 border border-slate-800/80 hover:border-cyan-500/30 rounded-2xl p-4 md:p-5 backdrop-blur-xl transition-all duration-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group"
              >
                {/* Left: Thumbnail & Details */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shrink-0">
                    {firstImg ? (
                      <Image src={firstImg} alt={product.name} fill className="object-contain p-1" sizes="64px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}
                    {product.isFeatured && (
                      <span className="absolute top-1 left-1 p-0.5 bg-amber-400 text-slate-950 rounded-full" title="Featured product">
                        <Star className="w-2.5 h-2.5 fill-current" />
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <span className="px-2 py-0.5 bg-slate-800 text-cyan-400 text-[10px] font-mono rounded-full border border-slate-700/60">
                        {product.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mt-1.5 text-xs">
                      <span className="font-mono font-bold text-white">৳{product.price.toLocaleString()}</span>
                      {product.comparePrice && (
                        <span className="font-mono text-slate-500 line-through text-[11px]">
                          ৳{product.comparePrice.toLocaleString()}
                        </span>
                      )}
                      <span className="text-slate-600">•</span>
                      <span
                        className={`text-[11px] font-medium font-mono ${
                          product.stock > 5
                            ? 'text-emerald-400'
                            : product.stock > 0
                            ? 'text-amber-400'
                            : 'text-rose-400 font-bold'
                        }`}
                      >
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-800/80">
                  {/* Photos Button */}
                  <button
                    onClick={() => onManageImagesClicked(product.id)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                    title="View & manage photos"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Photos ({imgCount})</span>
                  </button>

                  {/* Add Photo Button */}
                  <button
                    onClick={() => onAddMediaClicked(product.id)}
                    className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-cyan-400 rounded-xl transition"
                    title="Add another photo"
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  {/* Edit Button */}
                  <button
                    onClick={() => startEdit(product)}
                    className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-amber-400 rounded-xl transition"
                    title="Edit product specs & price"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  {/* View on Site Link */}
                  <Link
                    href={`/product/${product.slug}`}
                    target="_blank"
                    className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-400 hover:text-white rounded-xl transition"
                    title="Open live product page"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(product.id, product.name)}
                    disabled={deletingId === product.id}
                    className="p-2 bg-slate-900 hover:bg-rose-500/20 border border-slate-700/80 text-rose-400 rounded-xl transition disabled:opacity-50"
                    title="Delete product"
                  >
                    {deletingId === product.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111927] border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Edit className="w-5 h-5 text-amber-400" />
              Edit Component Details
            </h3>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Component Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="w-full h-11 px-4 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Price (৳)</label>
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    required
                    step="any"
                    className="w-full h-11 px-4 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Compare Price</label>
                  <input
                    type="number"
                    value={editComparePrice}
                    onChange={(e) => setEditComparePrice(e.target.value)}
                    step="any"
                    placeholder="MSRP"
                    className="w-full h-11 px-4 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Stock</label>
                  <input
                    type="number"
                    value={editStock}
                    onChange={(e) => setEditStock(e.target.value)}
                    required
                    className="w-full h-11 px-4 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Category</label>
                <input
                  type="text"
                  list="edit-cat-list"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-cyan-400 focus:outline-none"
                />
                <datalist id="edit-cat-list">
                  {existingCategories.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Description</label>
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-cyan-400 focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <input
                  type="checkbox"
                  id="editFeatured"
                  checked={editFeatured}
                  onChange={(e) => setEditFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-cyan-500 bg-slate-800 border-slate-700"
                />
                <label htmlFor="editFeatured" className="text-xs text-slate-300 cursor-pointer select-none">
                  Highlight on Storefront (Featured Badge)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl text-xs transition flex items-center gap-2"
                >
                  {isSavingEdit ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
