"use client"
import { Toaster } from 'sonner'
export function ToasterProvider() {
  return <Toaster theme="light" position="bottom-left" closeButton toastOptions={{ style: { background: '#fff', color: '#102e35', border: '1px solid #d8e2df', borderRadius: '10px', fontFamily: 'var(--font-body-family), sans-serif' } }} />
}
