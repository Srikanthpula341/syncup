'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Heart, Globe } from 'lucide-react';

const WHY_US_CARDS = [
  {
    title: 'Extreme Transparency',
    description: 'Every action is logged. Every decision is traceable. Build trust through absolute visibility across your entire team.',
    icon: Shield,
    color: 'text-purple-500',
    bg: 'bg-purple-50'
  },
  {
    title: 'Blazing Sync Speed',
    description: 'Real-time updates that actually feel real. Experience zero-latency collaboration powered by our high-performance engine.',
    icon: Zap,
    color: 'text-orange-500',
    bg: 'bg-orange-50'
  },
  {
    title: 'Built with Empathy',
    description: 'SyncUp is designed for humans, not just resources. We prioritize focus and emotional well-being over noise.',
    icon: Heart,
    color: 'text-red-500',
    bg: 'bg-red-50'
  },
  {
    title: 'Global Alignment',
    description: 'Whether your team is in the same room or across time zones, SyncUp keeps everyone on the exact same page.',
    icon: Globe,
    color: 'text-blue-500',
    bg: 'bg-blue-50'
  }
];

export default function WhyUsPage() {
  return (
    <div className="py-20 px-8 max-w-7xl mx-auto flex flex-col gap-32">
      {/* Hero Narrative */}
      <section className="max-w-4xl">
        <motion.h4 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[#FF6B35] font-black uppercase tracking-[0.2em] mb-6 text-sm"
        >
          Our Philosophy
        </motion.h4>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold leading-tight text-zinc-900 mb-8"
        >
          Built for teams that <br />
          <span className="text-[#FF6B35]">value transparency.</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-500 text-lg md:text-xl leading-relaxed max-w-3xl"
        >
          SyncUp isn't just another productivity tool. It's a commitment to a better way of working. 
          We believe that when information flows freely, teams move faster, trust grows deeper, and execution becomes effortless.
        </motion.p>
      </section>

      {/* Narrative Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {WHY_US_CARDS.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div 
              key={card.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + (idx * 0.1) }}
              className="group p-8 rounded-[40px] bg-white border border-zinc-100 hover:border-orange-200 transition-all shadow-sm hover:shadow-xl hover:shadow-orange-500/5"
            >
              <div className={`w-16 h-16 ${card.bg} ${card.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={32} />
              </div>
              <h3 className="text-2xl font-black text-zinc-900 mb-4 tracking-tight">{card.title}</h3>
              <p className="text-gray-500 leading-relaxed font-medium">{card.description}</p>
            </motion.div>
          );
        })}
      </section>

      {/* Mission Statement */}
      <section className="bg-orange-600 rounded-[60px] p-12 md:p-24 text-center text-white space-y-12 shadow-2xl shadow-orange-500/20">
         <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-6xl font-black leading-tight">
               Our mission is to eliminate misalignment.
            </h2>
            <p className="text-orange-100 text-lg md:text-xl font-medium opacity-80 decoration-orange-300 underline-offset-8">
               We're building the infrastructure that lets every teammate see the big picture, 
               allowing you to focus on execution instead of status updates.
            </p>
         </div>
         <button className="bg-white text-orange-600 px-10 py-4 rounded-2xl font-black text-lg hover:bg-orange-50 transition-all shadow-xl">
            Join the movement
         </button>
      </section>
    </div>
  );
}
