'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Terminal, Globe, Coffee, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const METRICS = [
  { label: 'Real-time Latency', value: '< 50ms', icon: Zap },
  { label: 'Uptime', value: '99.9%', icon: Globe },
  { label: 'Social Interactions', value: '1M+', icon: Coffee }
];

export default function SyncUpWebPortal() {
  return (
    <div className="py-20 px-8 max-w-7xl mx-auto flex flex-col gap-32">
      {/* Portal Hero */}
      <section className="flex flex-col lg:flex-row items-center gap-16 px-4">
        <div className="flex-1 space-y-12 max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-3 px-4 py-2 bg-orange-100 text-[#FF6B35] rounded-full text-sm font-black uppercase tracking-widest"
          >
            <Terminal size={16} />
            Web Experience v1.0
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold text-zinc-900 leading-[1.1] tracking-tighter"
          >
            The world&apos;s fastest <br />
            <span className="text-[#FF6B35]">collaboration portal.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-lg md:text-xl font-medium leading-relaxed"
          >
            Experience the SyncUp web application—a high-fidelity engine built for performance and absolute alignment. 
            No installs. No latency. Just pure execution.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center gap-6"
          >
            <Link 
              href="/auth"
              className="group flex items-center gap-3 bg-zinc-900 text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-[#FF6B35] transition-all shadow-xl hover:shadow-[#FF6B35]/20"
            >
              Open Web Application
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/auth" className="text-zinc-400 font-black hover:text-zinc-900 transition-colors text-lg underline underline-offset-8 decoration-2">
               Create Workspace
            </Link>
          </motion.div>
        </div>

        {/* Portal Visualization */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="flex-1 relative aspect-video w-full rounded-[40px] overflow-hidden bg-white shadow-2xl p-4 border border-zinc-100"
        >
          <div className="absolute inset-0 bg-linear-to-br from-orange-50 to-white -z-10" />
          <div className="w-full h-full rounded-[30px] border border-zinc-200 bg-zinc-50 overflow-hidden flex items-center justify-center p-8">
             <div className="w-full h-full relative group">
                <Image 
                  src="/landing/feature_workspace.png" 
                  alt="SyncUp Dashboard" 
                  fill 
                  className="object-contain group-hover:scale-105 transition-transform duration-700" 
                />
             </div>
          </div>
        </motion.div>
      </section>

      {/* Real-time Metrics */}
      <section className="bg-white rounded-[60px] py-16 px-8 grid grid-cols-1 md:grid-cols-3 gap-12 border border-zinc-100 shadow-sm">
         {METRICS.map((metric, idx) => {
            const Icon = metric.icon;
            return (
               <motion.div 
                 key={metric.label}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: idx * 0.1 }}
                 className="flex flex-col items-center text-center space-y-4"
               >
                  <div className="w-12 h-12 bg-orange-50 text-[#FF6B35] rounded-xl flex items-center justify-center shadow-inner">
                     <Icon size={24} />
                  </div>
                  <div className="text-3xl font-black text-zinc-900">{metric.value}</div>
                  <div className="text-sm font-black uppercase text-zinc-400 tracking-widest">{metric.label}</div>
               </motion.div>
            );
         })}
      </section>

      {/* Security CTA */}
      <section className="bg-[#FF6B35] rounded-[60px] p-12 md:p-24 text-center text-white space-y-12 shadow-2xl shadow-orange-500/20">
         <h2 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tighter">
            Secure. Private. Professional.
         </h2>
         <p className="text-orange-100 text-lg md:text-xl font-bold opacity-80 max-w-2xl mx-auto">
            SyncUp Web leverages industry-standard encryption and our proprietary real-time sync architecture to keep your team&apos;s data isolated and safe.
         </p>
         <button className="bg-zinc-900 px-10 py-4 rounded-2xl font-black text-lg hover:bg-zinc-800 transition-all">
            Get Security Whitepaper
         </button>
      </section>
    </div>
  );
}
