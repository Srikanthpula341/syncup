import Link from 'next/link'
import React from 'react'

interface FooterLinkProps {
  href?: string
  children: React.ReactNode
}

export const FooterLink = ({ href = "#", children }: FooterLinkProps) => {
  const isExternal = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')
  
  const content = (
    <>
      <span className="text-[#FF6B35] transition-transform group-hover:translate-x-1">
        <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 9L5 5L1 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="font-medium">{children}</span>
    </>
  )

  const className = "group flex items-center gap-3 text-gray-600 hover:text-[#FF6B35] transition-all"

  if (isExternal || href.startsWith('#')) {
    return (
      <a href={href} className={className}>
        {content}
      </a>
    )
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  )
}