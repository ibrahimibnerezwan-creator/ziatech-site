'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ProductGalleryProps { images: Array<{ id: string; url: string }>; name: string; isFeatured?: boolean; comparePrice?: number | null; price: number }
export function ProductGallery({ images, name, comparePrice, price }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const discount = comparePrice && comparePrice > price ? Math.round((comparePrice - price) / comparePrice * 100) : 0
  return <div className="product-gallery">
    <div className="product-gallery-main"><Image src={images[selectedIndex]?.url || '/placeholder.svg'} alt={name} fill sizes="(max-width: 767px) 92vw, 50vw" priority />{discount > 0 && <span className="product-badge">Save {discount}%</span>}</div>
    {images.length > 1 && <div className="gallery-thumbnails">{images.map((image, index) => <button key={image.id} type="button" aria-label={`View ${name} image ${index + 1}`} aria-pressed={index === selectedIndex} onClick={() => setSelectedIndex(index)}><img src={image.url} alt="" width="72" height="72" /></button>)}</div>}
  </div>
}
