import React from 'react'
import { FooterLink } from './FooterLink'
import { SocialIcon } from './SocialIcon'
import { APP_CONFIG } from '@/app/lib/app-constants'


const FooterComponent = () => {
  return (
    <footer className="bg-white pt-24 pb-12 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
            {/* Branding & Social Section */}
            <div className="space-y-8">
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold tracking-tight text-[#FF6B35]">{APP_CONFIG.BRAND.NAME}</span>
                </div>
                <p className="text-gray-500 leading-relaxed max-w-xs">
                    {APP_CONFIG.BRAND.DESCRIPTION}
                </p>
                <div className="flex items-center gap-4">
                    <SocialIcon href={APP_CONFIG.SOCIAL.TELEGRAM} icon={
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3.002-2.21-1.448 1.394c-.16.16-.295.295-.605.295l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.654-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.74z"/></svg>
                    } />
                    <SocialIcon href={APP_CONFIG.SOCIAL.FACEBOOK} icon={
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.324v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
                    } />
                    <SocialIcon href={APP_CONFIG.SOCIAL.TWITTER} icon={
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                    } />
                    <SocialIcon href={APP_CONFIG.SOCIAL.INSTAGRAM} icon={
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    } />
                </div>
            </div>

            {/* Link Column 1 */}
            <div className="space-y-8">
                <h4 className="text-xl font-bold text-gray-900">Useful links</h4>
                <div className="flex flex-col gap-6">
                    <FooterLink>About Us</FooterLink>
                    <FooterLink>Features</FooterLink>
                    <FooterLink>Terms & Conditions</FooterLink>
                    <FooterLink>Company Profile</FooterLink>
                </div>
            </div>

            {/* Link Column 2 */}
            <div className="space-y-8">
                <h4 className="text-xl font-bold text-gray-900">Content</h4>
                <div className="flex flex-col gap-6">
                    <FooterLink>Home</FooterLink>
                    <FooterLink>SyncUp Web</FooterLink>
                    <FooterLink>Beta tester</FooterLink>
                    <FooterLink>Join official Group</FooterLink>
                </div>
            </div>

             {/* Link Column 3 */}
            <div className="space-y-8">
                <h4 className="text-xl font-bold text-gray-900">Contact Us</h4>
                <div className="flex flex-col gap-6">
                    <FooterLink href={`mailto:${APP_CONFIG.CONTACT.EMAIL}`}>{APP_CONFIG.CONTACT.EMAIL}</FooterLink>
                    <FooterLink href={`tel:${APP_CONFIG.CONTACT.PHONE}`}>{APP_CONFIG.CONTACT.PHONE}</FooterLink>
                    <FooterLink href={APP_CONFIG.SOCIAL.TWITTER}>Social media</FooterLink>
                    <FooterLink>Unsubscribe mail</FooterLink>
                </div>
            </div>
        </div>

        <div className="mt-20 pt-8 border-t border-gray-100 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} {APP_CONFIG.BRAND.NAME}. All rights reserved.
        </div>
    </footer>
  )
}

export default FooterComponent