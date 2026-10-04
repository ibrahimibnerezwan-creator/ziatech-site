'use client';
import Link from 'next/link';
export default function ErrorPage({reset}:{error:Error;reset:()=>void}){return <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6"><h1 className="text-3xl font-bold">This page could not load</h1><p className="text-text-secondary">Please retry. If the issue continues, contact the store for help.</p><button onClick={reset} className="px-5 py-3 rounded-xl bg-orange-500 text-black font-bold">Try again</button><p><Link href="/contact" className="text-primary-400 underline">Contact support</Link></p></div>;}
