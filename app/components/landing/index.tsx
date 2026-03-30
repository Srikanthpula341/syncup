'use client'

import React from 'react'
import Image from 'next/image'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import FooterComponent from '../footer'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-[#FF6B35] rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xl">S</span>
        </div>
        <span className="text-2xl font-bold tracking-tight text-[#FF6B35]">SYNCUP</span>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-gray-600 font-medium">
        <a href="#" className="hover:text-[#FF6B35] transition-colors">Home</a>
        <a href="#" className="hover:text-[#FF6B35] transition-colors">Why us?</a>
        <a href="#" className="hover:text-[#FF6B35] transition-colors">Features</a>
        <a href="#" className="hover:text-[#FF6B35] transition-colors">SyncUp web</a>
      </div>

      <button className="bg-[#FF6B35] text-white px-6 py-2.5 rounded-full font-semibold hover:bg-[#e85a2a] transition-all shadow-lg shadow-orange-200">
        Download
      </button>
    </nav>
  )
}

const FeatureCard = ({ icon, title, description, color }: { icon: string, title: string, description: string, color: string }) => (
  <div className="flex flex-col items-center text-center p-6 transition-transform hover:scale-105">
    <div className={cn("w-32 h-32 rounded-3xl mb-6 relative overflow-hidden shadow-xl", color)}>
      <Image 
        src={icon} 
        alt={title} 
        fill 
        className="object-cover p-4"
      />
    </div>
    <h3 className="font-bold text-lg mb-2">{title}</h3>
    <p className="text-sm text-gray-500 max-w-[150px]">{description}</p>
  </div>
)

const StatItem = ({ icon: Icon, value, label }: { icon: React.ReactNode, value: string, label: string }) => (
  <div className="flex items-start gap-4 p-4">
    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
      {Icon}
    </div>
    <div>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  </div>
)

const LandingComponent = () => {
  return (
    <div className="min-h-screen bg-[#FDF8F5] text-[#1A1A1A] font-sans overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-8 max-w-7xl mx-auto flex flex-col items-center md:items-start">
        <div className="z-10 max-w-2xl text-center md:text-left">
          <h1 className="text-6xl md:text-7xl font-extrabold leading-[1.1] mb-8">
            <span className="text-[#FF6B35]">Connect</span>, Execute,<br />
            and Track in one<br />
            Workspace.
          </h1>
          <p className="text-gray-500 text-lg mb-10 max-w-md leading-relaxed">
            SyncUp is the ultimate collaboration platform for modern teams. Combine real-time chat with powerful task management and a transparent activity timeline.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <button className="bg-[#FF6B35] text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-[#e85a2a] transition-all shadow-xl shadow-orange-200">
              Get the app
            </button>
            <div className="flex gap-4 text-gray-400">
              <div className="w-6 h-6">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              </div>
              <div className="w-6 h-6">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="hidden lg:block absolute right-0 top-0 w-1/2 h-full">
          {/* Memojis */}
          <div className="absolute top-10 right-20 w-48 h-48 animate-bounce-slow">
             <div className="relative w-full h-full">
                <Image src="/landing/hero_memoji_female_heart.png" alt="Memoji" fill className="object-contain" />
                <div className="absolute -top-4 -right-4 bg-white p-3 rounded-2xl shadow-lg border border-gray-100 rotate-12">
                   <span className="text-2xl">❤️</span>
                </div>
             </div>
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 right-64 w-40 h-40">
             <div className="relative w-full h-full">
                <Image src="/landing/hero_memoji_male.png" alt="Memoji" fill className="object-contain" />
             </div>
          </div>

          <div className="absolute bottom-10 right-10 w-56 h-56">
             <div className="relative w-full h-full">
                <Image src="/landing/hero_memoji_female_wink.png" alt="Memoji" fill className="object-contain" />
                <div className="absolute -left-10 -top-10 bg-orange-500 text-white p-4 rounded-2xl shadow-2xl font-bold">
                   Coffee shop at 5?
                </div>
             </div>
          </div>

          {/* Reaction bubbles */}
          <div className="absolute top-1/3 right-1/4 animate-pulse">🔥</div>
          <div className="absolute bottom-1/4 right-1/3 animate-bounce-slow delay-150">❤️</div>
          <div className="absolute top-1/4 right-1/2">🔥</div>
          
          <div className="absolute bottom-1/3 right-48 bg-white/80 backdrop-blur-md p-4 rounded-3xl shadow-xl border border-white/50 flex gap-3 items-center">
             <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" />
                ))}
             </div>
             <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white">+</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white rounded-[60px] py-24 px-8 max-w-7xl mx-auto my-12 shadow-sm">
        <h4 className="text-center font-bold text-gray-400 tracking-widest uppercase mb-12">Highlight Features</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <FeatureCard 
            icon="/landing/feature_thread.png"
            title="Threaded Conversations"
            description="Move beyond simple chat with nested discussions."
            color="bg-purple-50"
          />
          <FeatureCard 
            icon="/landing/feature_kanban.png"
            title="Kanban Task Boards"
            description="Manage team execution with drag-and-drop boards."
            color="bg-orange-50"
          />
          <FeatureCard 
            icon="/landing/feature_timeline.png"
            title="Activity Timelines"
            description="Every action is logged. Never lose track of what happened."
            color="bg-blue-50"
          />
          <FeatureCard 
            icon="/landing/feature_workspace.png"
            title="Multi-Tenant Workspaces"
            description="Create isolated environments for every project."
            color="bg-teal-50"
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-8 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-16">
        <div className="max-w-md">
          <h5 className="text-[#FF6B35] font-bold mb-4">Why SyncUp?</h5>
          <h2 className="text-5xl font-extrabold leading-tight mb-8">Built for teams that value transparency</h2>
          <p className="text-gray-500 leading-relaxed">
            SyncUp is more than just a chat app. It integrates task management and activity logging into a single workspace, ensuring that everyone stays aligned on what matters.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 flex-1">
          <StatItem 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>}
            value="1M+"
            label="Actions Logged"
          />
          <StatItem 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>}
            value="50K+"
            label="Active Teams"
          />
          <StatItem 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>}
            value="100+"
            label="Features Integrated"
          />
          <StatItem 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>}
            value="Real-time"
            label="Sync Speed"
          />
        </div>
      </section>
      <FooterComponent/>

      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default LandingComponent