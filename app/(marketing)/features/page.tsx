'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Layout, History, Building, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

const FEATURES = [
  {
    title: 'Threaded Conversations',
    description: 'Move beyond simple chat. Organize discussions into nested threads that keep noise down and focus high.',
    icon: MessageSquare,
    image: '/landing/feature_thread.png',
    bg: 'bg-purple-50',
    color: 'text-purple-600',
    details: [
       'Contextual replies for every message',
       'Auto-organized activity logs',
       'Noise reduction filters'
    ]
  },
  {
    title: 'Kanban Task Boards',
    description: 'Transform talk into action. Manage team execution with drag-and-drop boards integrated directly into your chat.',
    icon: Layout,
    image: '/landing/feature_kanban.png',
    bg: 'bg-orange-50',
    color: 'text-orange-600',
    details: [
       'Status tracking (To Do, Doing, Done)',
       'Teammate assignments',
       'Deadline management'
    ]
  },
  {
    title: 'Activity Timelines',
    description: 'Never lose track of a milestone. Every action, update, and decision is recorded in a transparent timeline.',
    icon: History,
    image: '/landing/feature_timeline.png',
    bg: 'bg-blue-50',
    color: 'text-blue-600',
    details: [
       'Auditable history for every project',
       'Instant search for past decisions',
       'Visual progress indicators'
    ]
  },
  {
    title: 'Multi-Tenant Workspaces',
    description: 'Create professional, isolated environments for every client or project with zero data leakage.',
    icon: Building,
    image: '/landing/feature_workspace.png',
    bg: 'bg-teal-50',
    color: 'text-teal-600',
    details: [
       'Secure data isolation',
       'Custom workspace branding',
       'Role-based access controls'
    ]
  }
];

export default function FeaturesPage() {
  return (
    <div className="py-20 px-8 max-w-7xl mx-auto flex flex-col gap-32">
      {/* Header Section */}
      <section className="text-center space-y-8 max-w-4xl mx-auto px-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-extrabold text-zinc-900 leading-[1.1] tracking-tight"
        >
          Powerful tools for <br />
          <span className="text-[#FF6B35]">modern execution.</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-500 text-lg md:text-xl font-medium leading-relaxed"
        >
          We've carefully integrated chat and task management into a single, high-fidelity experience. 
          Everything you need to move from idea to execution.
        </motion.p>
      </section>

      {/* Feature Sections */}
      <section className="space-y-32">
        {FEATURES.map((feat, idx) => {
          const Icon = feat.icon;
          const isEven = idx % 2 === 0;
          return (
            <motion.div 
              key={feat.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className={`flex flex-col lg:flex-row items-center gap-16 ${isEven ? 'lg:flex-row-reverse' : ''}`}
            >
              {/* Feature Text */}
              <div className="flex-1 space-y-8">
                 <div className={`w-16 h-16 ${feat.bg} ${feat.color} rounded-2xl flex items-center justify-center shadow-sm`}>
                    <Icon size={32} />
                 </div>
                 <h2 className="text-3xl md:text-5xl font-black text-zinc-900 tracking-tighter leading-tight">
                    {feat.title}
                 </h2>
                 <p className="text-gray-500 text-lg leading-relaxed font-medium">
                    {feat.description}
                 </p>
                 <div className="space-y-4 pt-4 border-t border-zinc-100">
                    {feat.details.map(detail => (
                       <div key={detail} className="flex items-center gap-3 text-zinc-700 font-bold">
                          <CheckCircle2 size={18} className="text-[#FF6B35]" />
                          {detail}
                       </div>
                    ))}
                 </div>
              </div>

              {/* Feature Visualization */}
              <div className={`flex-1 w-full aspect-square relative rounded-[60px] overflow-hidden ${feat.bg} flex items-center justify-center p-12 shadow-2xl`}>
                 <div className="relative w-full h-full transform hover:scale-105 transition-transform duration-700 ease-in-out">
                    <Image 
                      src={feat.image} 
                      alt={feat.title} 
                      fill 
                      className="object-contain" 
                      priority={idx === 0}
                    />
                 </div>
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* Final CTA */}
      <section className="bg-zinc-900 rounded-[60px] p-12 md:p-24 text-center text-white space-y-12">
         <h2 className="text-4xl md:text-6xl font-black leading-tight max-w-2xl mx-auto">
            Ready to experience <br />
            the speed?
         </h2>
         <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="bg-[#FF6B35] text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20">
               Get Started Now
            </button>
            <button className="text-zinc-400 font-black hover:text-white transition-all text-lg">
               Book a demo
            </button>
         </div>
      </section>
    </div>
  );
}
