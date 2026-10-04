'use client';
import {Heart} from 'lucide-react';
import {useWishlist} from '@/lib/wishlist';
import {toast} from 'sonner';
export function WishlistButton({id,className='',label=false}:{id:string;className?:string;label?:boolean}){
 const {ids,toggle}=useWishlist();const saved=ids.includes(id);
 return <button type="button" aria-label={saved?'Remove from wishlist':'Save to wishlist'} aria-pressed={saved} className={className} onClick={e=>{e.preventDefault();e.stopPropagation();try{toggle(id);toast.success(saved?'Removed from wishlist':'Saved to wishlist');}catch{toast.error('Your browser could not save this item.');}}}><Heart className={`w-4 h-4 ${saved?'fill-orange-500 text-orange-500':''}`}/>{label && <span>{saved?'Saved':'Save'}</span>}</button>;
}
