"use client";

import React, { useState, useEffect, useMemo } from 'react';
import AddProductForm from './AddProductForm';
import ProductList, {type ProductItem} from './ProductList';
import AddMediaModal from './AddMediaModal';
import ManageImagesModal from './ManageImagesModal';

export default function ProductManager({ refreshKey }: { refreshKey?: number }) {
  const [categoryNames, setCategoryNames] = useState<string[]>([]);
  const [loadError, setLoadError] = useState('');
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [addingMediaToProduct, setAddingMediaToProduct] = useState<string | null>(null);
  const [managingImagesForProduct, setManagingImagesForProduct] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const res = await fetch('/api/products?t=' + Date.now());
      if (!res.ok) throw new Error('Unable to load products. Please sign in again.');
      const categoryRes = await fetch('/api/categories');
      if (categoryRes.ok) { const cats = await categoryRes.json(); setCategoryNames(cats.map((c: {name:string})=>c.name)); }
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Unable to load products.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [refreshKey]);

  const existingCategories = useMemo(() => {
    const cats = [...categoryNames, ...products.map((p) => p.category)].filter(c=>c && c !== 'Uncategorized');
    return [...new Set(cats)].sort() as string[];
  }, [products, categoryNames]);

  const productToManage = managingImagesForProduct
    ? products.find((p) => p.id === managingImagesForProduct)
    : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {loadError && <p role="alert" className="lg:col-span-3 text-red-300">{loadError}</p>}
      {isLoading && <p role="status" className="lg:col-span-3 text-orange-300">Loading products…</p>}
      {/* Add Product Form Column */}
      <div className="lg:col-span-1 min-w-0">
        <AddProductForm
          existingCategories={existingCategories}
          onProductAdded={fetchProducts}
        />
      </div>

      {/* Product List Column */}
      <ProductList
        products={products}
        existingCategories={existingCategories}
        onProductUpdated={fetchProducts}
        onAddMediaClicked={(id) => setAddingMediaToProduct(id)}
        onManageImagesClicked={(id) => setManagingImagesForProduct(id)}
      />

      {/* Add Media Modal */}
      {addingMediaToProduct && (
        <AddMediaModal
          productId={addingMediaToProduct}
          onClose={() => setAddingMediaToProduct(null)}
          onMediaAdded={() => {
            setAddingMediaToProduct(null);
            fetchProducts();
          }}
        />
      )}

      {/* Manage Images Modal */}
      {productToManage && (
        <ManageImagesModal
          product={productToManage}
          onClose={() => setManagingImagesForProduct(null)}
          onImageDeleted={fetchProducts}
        />
      )}
    </div>
  );
}
