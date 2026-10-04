'use client';
import {useSyncExternalStore} from 'react';
const KEY='ziatech-wishlist';
function read(){try{return localStorage.getItem(KEY)||'[]';}catch{return '[]';}}
function subscribe(listener:()=>void){window.addEventListener('storage',listener);window.addEventListener('wishlist-changed',listener);return()=>{window.removeEventListener('storage',listener);window.removeEventListener('wishlist-changed',listener);};}
export function useWishlist(){
 const saved=useSyncExternalStore(subscribe,read,()=> '[]');
 let ids:string[]=[];
 try{const parsed=JSON.parse(saved);if(Array.isArray(parsed)) ids=parsed.filter(i=>typeof i==='string');}catch{}
 function toggle(id:string){const next=ids.includes(id)?ids.filter(i=>i!==id):[...ids,id];localStorage.setItem(KEY,JSON.stringify(next));window.dispatchEvent(new Event('wishlist-changed'));}
 return {ids,toggle};
}
