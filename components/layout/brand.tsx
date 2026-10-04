import Link from 'next/link'

export function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link href="/" aria-label="ZiaTech home" className={`brand${inverse ? ' brand-inverse' : ''}`}>
      <svg width="37" height="37" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <rect x="1" y="1" width="38" height="38" rx="11" fill="currentColor" />
        <path d="M12 12h17L13 28h16M12 20h16" stroke="#102E35" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="10" cy="28" r="2" fill="#102E35" />
      </svg>
      <span>ZiaTech<span className="brand-dot">.</span></span>
    </Link>
  )
}
