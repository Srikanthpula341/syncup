'use client'

import Image from 'next/image'
import { FeatureCard } from './FeatureCard'
import { StatItem } from './StatItem'
import { APP_CONFIG } from '@/app/lib/app-constants'







const LandingComponent = () => {
  return (
    <div className="bg-[#FDF8F5] text-[#1A1A1A] font-sans overflow-x-hidden pt-12">
      {/* Hero Section */}

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-8 max-w-7xl mx-auto flex flex-col items-center md:items-start">
        <div className="z-10 max-w-2xl text-center md:text-left">
          <h1 className="text-6xl md:text-7xl font-extrabold leading-[1.1] mb-8">
            <span className="text-[#FF6B35]">Connect</span>, Execute,<br />
            and Track in one<br />
            Workspace.
          </h1>
          <p className="text-gray-500 text-lg mb-10 max-w-md leading-relaxed">
            {APP_CONFIG.BRAND.DESCRIPTION}
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
                <Image src="/landing/hero_memoji_female_heart.png" alt="Memoji" fill sizes="192px" className="object-contain" />
                <div className="absolute -top-4 -right-4 bg-white p-3 rounded-2xl shadow-lg border border-gray-100 rotate-12">
                   <span className="text-2xl">❤️</span>
                </div>
             </div>
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 right-64 w-40 h-40">
             <div className="relative w-full h-full">
                <Image src="/landing/hero_memoji_male.png" alt="Memoji" fill sizes="160px" className="object-contain" />
             </div>
          </div>

          <div className="absolute bottom-10 right-10 w-56 h-56">
             <div className="relative w-full h-full">
                <Image src="/landing/hero_memoji_female_wink.png" alt="Memoji" fill sizes="224px" className="object-contain" />
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
            {APP_CONFIG.BRAND.NAME} is more than just a chat app. It integrates task management and activity logging into a single workspace, ensuring that everyone stays aligned on what matters.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 flex-1">
          <StatItem 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>}
            value="100+"
            label="Actions Logged"
          />
          <StatItem 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>}
            value="2+"
            label="Active Teams"
          />
          <StatItem 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>}
            value="5+"
            label="Features Integrated"
          />
          <StatItem 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>}
            value="Real-time"
            label="Sync Speed"
          />
        </div>
      </section>

    </div>
  )
}

export default LandingComponent