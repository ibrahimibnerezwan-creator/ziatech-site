"use client";

import React, { useState, useEffect, useMemo } from 'react';
import AddProductForm from './AddProductForm';
import ProductList from './ProductList';
import AddMediaModal from './AddMediaModal';
import ManageImagesModal from './ManageImagesModal';

export default function ProductManager({ refreshKey }: { refreshKey?: number }) {
  const [products, setProducts] = useState<any[]>([]);
  const [addingMediaToProduct, setAddingMediaToProduct] = useState<string | null>(null);
  const [managingImagesForProduct, setManagingImagesForProduct] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/products?t=' + Date.now());
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Error fetching inventory:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [refreshKey]);

  const existingCategories = useMemo(() => {
    const cats = products.map((p) => p.category || p.categoryName).filter(Boolean);
    return [...new Set(cats)].sort() as string[];
  }, [products]);

  const productToManage = managingImagesForProduct
    ? products.find((p) => p.id === managingImagesForProduct)
    : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Add Product Form Column */}
      <div className="lg:col-span-1 sticky top-8">
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
