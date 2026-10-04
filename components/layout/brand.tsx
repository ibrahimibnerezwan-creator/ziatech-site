import Link from 'next/link'

export function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link href="/" aria-label="ZiaTech home" className={`brand${inverse ? ' brand-inverse' : ''}`}>
      <svg width="39" height="39" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <path d="M3 3h34v34H3z" fill="currentColor" />
        <path d="M10 11h21L10 29h21M8 20h24" stroke="#272B30" strokeWidth="3" strokeLinejoin="bevel" />
        <path d="M3 3h7M30 37h7" stroke="#272B30" strokeWidth="3" />
      </svg>
      <span>ZiaTech</span>
    </Link>
  )
}
