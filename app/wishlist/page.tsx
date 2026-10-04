'use client';
import {useEffect,useState} from 'react';
import {useWishlist} from '@/lib/wishlist';
import {ProductCard} from '@/components/product/product-card';
import type {ProductForCard} from '@/lib/data';
import Link from 'next/link';
export default function WishlistPage(){
 const {ids}=useWishlist();const [products,setProducts]=useState<ProductForCard[]>([]);const [loading,setLoading]=useState(true);const [error,setError]=useState('');
 useEffect(()=>{fetch('/api/products').then(async r=>{if(!r.ok)throw new Error('Unable to load saved products. Please reload.');return r.json();}).then(data=>setProducts(data.map((p:ProductForCard & {imageUrl:string;categoryName:string;comparePrice:number|null})=>({...p,image:p.imageUrl,category:p.categoryName,oldPrice:p.comparePrice??undefined,rating:0,reviews:0})))).catch(e=>setError(e.message)).finally(()=>setLoading(false));},[]);
 const saved=products.filter(p=>ids.includes(p.id));
 return <div className="store-container shop-page"><h1 className="text-3xl font-bold text-text-primary mb-4">Your wishlist</h1><p className="text-text-secondary mb-8">Saved on this browser.</p>{error?<p role="alert">{error}</p>:loading?<p>Loading saved products…</p>:saved.length?<div className="product-grid">{saved.map(p=><ProductCard key={p.id} product={p}/>)}</div>:<p>No saved products yet. <Link className="text-primary-400 underline" href="/category/all">Browse the catalogue</Link></p>}</div>;
}
