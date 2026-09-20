'use client';

import { useApp } from '@/lib/store';
import { parseDocumentFromText } from '@/lib/documents/parser';
import { FREELANCE_AGREEMENT_TEXT, RESIDENTIAL_LEASE_TEXT, EMPLOYMENT_OFFER_TEXT, NDA_TEXT, SAAS_TOS_TEXT } from '@/data/sample-documents';
import { FREELANCE_ANALYSIS } from '@/data/demo-analysis';
import { FileUploadZone } from '@/components/shared/FileUploadZone';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  FileText, Shield, Scale, Search, ArrowRight, CheckCircle2,
  AlertTriangle, Zap, MessageSquare, BookOpen,
  Sparkles,
} from 'lucide-react';
import { useState, useRef } from 'react';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { GlowingOrb } from '@/components/ui/GlowingOrb';
import clsx from 'clsx';
import Link from 'next/link';

export function LandingPage() {
  const { dispatch } = useApp();
  const [activeAnnotation, setActiveAnnotation] = useState<number | null>(null);
  const [isMessageSent, setIsMessageSent] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  function loadDemo(docText: string, docId: string, fileName: string) {
    const parsed = parseDocumentFromText(docText, fileName, docId);
    dispatch({ type: 'SET_IS_DEMO', payload: true });
    dispatch({ 
      type: 'ADD_DOCUMENT', 
      payload: { document: parsed, analysis: { ...FREELANCE_ANALYSIS, documentId: docId } } 
    });
  }

  function loadFreelanceDemo() {
    loadDemo(FREELANCE_AGREEMENT_TEXT, 'demo-freelance-v1', 'Freelance_Services_Agreement.pdf');
  }

  return (
    <div ref={containerRef} className="relative min-h-screen bg-transparent overflow-hidden font-body selection:bg-accent-500 selection:text-white">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-lexora-950/40 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <MagneticButton strength={20}>
            <div className="flex items-center gap-3">
              <Scale className="w-6 h-6 text-accent-500" />
              <span className="text-lg font-bold tracking-widest text-white uppercase font-display">LEXORA</span>
            </div>
          </MagneticButton>
          <div className="hidden md:flex items-center gap-12 text-sm text-lexora-400 font-medium tracking-wide">
            <a href="#features" className="hover:text-white transition-colors relative group">
              Features
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-accent-500 transition-all group-hover:w-full"></span>
            </a>
            <a href="#how-it-works" className="hover:text-white transition-colors relative group">
              How It Works
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-accent-500 transition-all group-hover:w-full"></span>
            </a>
          </div>
          <MagneticButton strength={30}>
            <button
              onClick={loadFreelanceDemo}
              className="relative px-6 py-2.5 rounded-full bg-white/10 text-white font-medium hover:bg-white hover:text-black transition-all duration-300 border border-white/20 backdrop-blur-md"
            >
              Try the demo
            </button>
          </MagneticButton>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 z-10">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-16 items-center w-full">
          
          {/* Left — Massive Typography */}
          <motion.div
            className="lg:col-span-7"
            style={{ y: y1, opacity }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent-500/30 bg-accent-500/10 backdrop-blur-md text-accent-400 text-xs font-semibold tracking-[0.2em] uppercase"
            >
              <Sparkles className="w-3 h-3" /> Redefining Legal Intelligence
            </motion.div>
            
            <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-black tracking-tight leading-[1.1] text-white mb-8 font-display">
              <motion.span 
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="block"
              >
                KNOW
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="block text-lexora-400"
              >
                WHAT YOU
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="block text-transparent bg-clip-text bg-gradient-to-r from-accent-500 to-accent-800"
              >
                SIGN.
              </motion.span>
            </h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-lg md:text-xl text-lexora-300 max-w-xl mb-12 leading-relaxed font-light"
            >
              Lexora breathes life into dense legal texts, extracting profound insights, hidden risks, and undeniable truth — without replacing the human touch.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex flex-col sm:flex-row gap-6"
            >
              <MagneticButton strength={40}>
                <label
                  className="relative group overflow-hidden inline-flex items-center gap-3 px-8 py-4 rounded-full bg-accent-500 text-white font-semibold text-lg cursor-pointer shadow-[0_0_40px_-10px_var(--color-accent-500)]"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                  <FileText className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">Upload Document</span>
                  <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-2 transition-transform" />
                  <input type="file" className="hidden" accept=".pdf,.txt,.md,.docx" multiple onChange={(e) => {
                    const files = e.target.files ? Array.from(e.target.files) : [];
                    if (files.length > 0) handleFileUpload(files, dispatch);
                  }} />
                </label>
              </MagneticButton>
            </motion.div>
          </motion.div>

          {/* Right — Floating Glassmorphic UI */}
          <motion.div
            className="lg:col-span-5 relative hidden lg:block"
            style={{ y: y2 }}
          >
            <div className="relative w-full h-[550px] flex items-center justify-center [perspective:2500px]">
              {/* Background ambient glow */}
              <div className="absolute inset-0 bg-accent-500/15 blur-[120px] rounded-full scale-90 opacity-60 animate-pulse" />
              
              {/* 3D Stack */}
              <motion.div 
                animate={{ 
                  rotateY: [18, -12, 18],
                  rotateX: [8, -4, 8],
                  y: [-15, 15, -15]
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-[340px] h-[460px] [transform-style:preserve-3d]"
              >
                {/* Layer 3 (Bottom) */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-md rounded-xl border border-white/10 [transform:translateZ(-100px)_translateX(40px)_translateY(40px)] shadow-[30px_30px_100px_rgba(0,0,0,0.8)] flex flex-col p-8 opacity-40">
                  <div className="w-full h-full border border-white/5 rounded flex flex-col gap-3 p-4">
                     <div className="w-3/4 h-[2px] bg-white/20"/>
                     <div className="w-full h-[2px] bg-white/20"/>
                     <div className="w-5/6 h-[2px] bg-white/20"/>
                  </div>
                </div>
                
                {/* Layer 2 */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-lg rounded-xl border border-white/20 [transform:translateZ(-50px)_translateX(20px)_translateY(20px)] shadow-[20px_20px_80px_rgba(0,0,0,0.7)] flex flex-col p-8 opacity-70">
                  <div className="w-full h-full border border-white/10 rounded flex flex-col gap-3 p-4">
                     <div className="w-2/3 h-[2px] bg-white/30"/>
                     <div className="w-full h-[2px] bg-white/30"/>
                     <div className="w-4/5 h-[2px] bg-white/30"/>
                  </div>
                </div>
                
                {/* Layer 1 (Top / Main Document) */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-black/40 to-black/80 backdrop-blur-2xl rounded-xl border border-t-white/30 border-l-white/30 border-b-black/50 border-r-black/50 overflow-hidden shadow-[0_0_60px_-15px_var(--color-accent-500)] flex flex-col p-8 [transform:translateZ(0px)]">
                  
                  {/* Shimmer effect on glass */}
                  <motion.div 
                    animate={{ left: ['-100%', '200%'] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
                    className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                  />

                  {/* Header Area */}
                  <div className="flex justify-between items-start mb-8 border-b border-white/10 pb-4">
                    <div>
                      <div className="text-[9px] font-mono text-lexora-400 mb-1 tracking-widest uppercase">Contract ID: 894-X</div>
                      <div className="h-[3px] w-32 bg-white/80 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                    </div>
                    <div className="h-[3px] w-12 bg-accent-500 rounded-full shadow-[0_0_10px_var(--color-accent-500)]" />
                  </div>
                  
                  {/* Paragraph 1 */}
                  <div className="space-y-2.5 mb-8 relative z-10">
                    <div className="h-[2px] w-full bg-lexora-300/60 rounded-full" />
                    <div className="h-[2px] w-full bg-lexora-300/60 rounded-full" />
                    <div className="h-[2px] w-11/12 bg-lexora-300/60 rounded-full" />
                    <div className="h-[2px] w-4/5 bg-lexora-300/60 rounded-full" />
                  </div>

                  {/* Highlighted Clause */}
                  <div className="relative p-4 rounded-lg border border-accent-500/50 bg-accent-500/10 backdrop-blur-md mb-8 group z-10">
                    <div className="absolute -inset-px bg-gradient-to-r from-accent-500 to-transparent opacity-20 rounded-lg" />
                    <div className="absolute top-0 left-0 w-1 h-full bg-accent-500 shadow-[0_0_15px_var(--color-accent-500)] rounded-l-lg" />
                    
                    <div className="flex items-center justify-between mb-3 relative z-10">
                      <div className="flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5 text-accent-400 drop-shadow-[0_0_5px_var(--color-accent-500)]" />
                        <span className="text-[10px] text-accent-300 font-bold tracking-widest uppercase drop-shadow-[0_0_5px_rgba(var(--color-accent-500-rgb),0.5)]">Liability Cap</span>
                      </div>
                      <span className="text-[9px] font-mono text-accent-500/70">98.5% CONFIDENCE</span>
                    </div>
                    
                    <div className="space-y-2 relative z-10">
                      <div className="h-[2px] w-full bg-white/60 rounded-full" />
                      <div className="h-[2px] w-full bg-white/60 rounded-full" />
                      <div className="h-[2px] w-2/3 bg-white/60 rounded-full" />
                    </div>
                  </div>

                  {/* Paragraph 2 */}
                  <div className="space-y-2.5 relative z-10">
                    <div className="h-[2px] w-full bg-lexora-300/60 rounded-full" />
                    <div className="h-[2px] w-full bg-lexora-300/60 rounded-full" />
                    <div className="h-[2px] w-5/6 bg-lexora-300/60 rounded-full" />
                  </div>
                  
                  {/* Signature Block Simulation */}
                  <div className="absolute bottom-8 right-8 flex flex-col items-end gap-2 z-10">
                     <div className="w-24 h-6 border-b border-white/20 relative">
                       <svg className="absolute bottom-1 left-2 w-20 h-8 stroke-accent-500/40 fill-none" viewBox="0 0 100 40">
                         <path d="M10,25 C20,10 30,35 40,20 S50,30 60,15 S80,35 90,20" strokeWidth="2" strokeLinecap="round"/>
                       </svg>
                     </div>
                     <div className="text-[7px] text-lexora-500 uppercase tracking-widest font-mono">Signatory Authorized</div>
                  </div>

                  {/* Premium Laser Scanner */}
                  <motion.div 
                    animate={{ top: ['-10%', '110%', '-10%'] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 z-20 pointer-events-none flex flex-col items-center"
                  >
                    <div className="w-full h-[1px] bg-accent-400 shadow-[0_0_15px_2px_var(--color-accent-500)]" />
                    <div className="w-full h-32 bg-gradient-to-b from-accent-500/20 via-accent-500/5 to-transparent" />
                  </motion.div>
                </div>
                
                {/* Floating AR Node 1 */}
                <motion.div 
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -right-20 top-24 [transform:translateZ(100px)]"
                >
                  {/* Connection Line */}
                  <svg className="absolute -left-12 top-1/2 w-12 h-px overflow-visible"><line x1="0" y1="0" x2="100%" y2="0" stroke="rgba(var(--color-accent-500-rgb), 0.3)" strokeWidth="1" strokeDasharray="2 2" /></svg>
                  
                  <div className="bg-gradient-to-br from-black/80 to-black/40 backdrop-blur-xl border border-white/10 border-t-white/20 p-3.5 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex items-start gap-3 relative before:absolute before:inset-0 before:rounded-xl before:border before:border-accent-500/20 before:-z-10">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-500/30 to-transparent flex items-center justify-center border border-accent-500/30 shadow-[0_0_15px_var(--color-accent-500)]">
                      <AlertTriangle className="w-3.5 h-3.5 text-accent-400" />
                    </div>
                    <div>
                      <div className="text-[9px] text-accent-400 font-bold tracking-widest uppercase mb-1 drop-shadow-md">Hidden Obligation</div>
                      <div className="flex gap-1.5 mt-2">
                        <div className="h-1 w-2 bg-accent-500 rounded-full shadow-[0_0_5px_var(--color-accent-500)]" />
                        <div className="h-1 w-2 bg-accent-500 rounded-full shadow-[0_0_5px_var(--color-accent-500)]" />
                        <div className="h-1 w-6 bg-white/20 rounded-full" />
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                {/* Floating AR Node 2 */}
                <motion.div 
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -left-16 bottom-32 [transform:translateZ(80px)]"
                >
                  {/* Connection Line */}
                  <svg className="absolute -right-12 top-1/2 w-12 h-px overflow-visible"><line x1="0" y1="0" x2="100%" y2="0" stroke="rgba(var(--color-accent-500-rgb), 0.3)" strokeWidth="1" strokeDasharray="2 2" /></svg>
                  
                  <div className="bg-gradient-to-br from-black/80 to-black/40 backdrop-blur-xl border border-white/10 border-t-white/20 p-3.5 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex items-start gap-3 relative before:absolute before:inset-0 before:rounded-xl before:border before:border-accent-500/10 before:-z-10">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center border border-white/20">
                      <Shield className="w-3.5 h-3.5 text-white/80" />
                    </div>
                    <div>
                      <div className="text-[9px] text-white/80 font-bold tracking-widest uppercase mb-1">Standard Clause</div>
                      <div className="text-[8px] font-mono text-lexora-500 mt-1">VERIFIED</div>
                    </div>
                  </div>
                </motion.div>
                
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative py-32 z-10 border-t border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-8 tracking-tight">
              The Philosophy
            </h2>
            <p className="text-xl text-lexora-300 font-light leading-relaxed mb-6">
              Legal documents are intentionally opaque. They are designed to protect the drafter, often at the expense of the signer. 
              We believe that <span className="text-accent-500 font-medium">clarity is a fundamental right</span>, not a luxury reserved for those who can afford massive legal retainers.
            </p>
            <p className="text-lg text-lexora-400 font-light leading-relaxed">
              Lexora was born from a singular passion: to level the playing field. By harnessing advanced document intelligence, we illuminate the hidden traps, obligations, and financial commitments buried in the fine print.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-6 tracking-tight">The Engine</h2>
            <p className="text-lg text-lexora-400 font-light max-w-2xl mx-auto">
              Precision tooling designed to extract truth from complexity.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: 'Plain-Language Translation', desc: 'Toggle instantly between dense legalese and crystal-clear explanations.' },
              { icon: AlertTriangle, title: 'Risk Radar', desc: 'Financial exposure, IP assignment, and termination constraints, highlighted instantly.' },
              { icon: MessageSquare, title: 'Grounded Interrogation', desc: 'Ask questions. Get answers backed by direct citations to the source text.' },
              { icon: Zap, title: 'Obligation Extraction', desc: 'Never miss a deadline. Automatically map all dates and deliverables.' },
              { icon: Shield, title: 'Absolute Privacy', desc: 'Zero data retention. Your documents are processed server-side and wiped clean.' },
              { icon: Sparkles, title: 'Beautiful Clarity', desc: 'An interface designed for human focus, stripping away the noise.' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden hover:bg-white/10 transition-colors"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <feature.icon className="w-8 h-8 text-accent-500 mb-6 relative z-10" />
                <h3 className="text-xl font-display font-bold text-white mb-3 relative z-10">{feature.title}</h3>
                <p className="text-lexora-400 font-light leading-relaxed relative z-10">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="relative py-32 z-10 border-t border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-6 tracking-tight">The Process</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent-500/50 to-transparent -translate-y-1/2 z-0"></div>
            
            {[
              { num: '01', title: 'Upload', desc: 'Drop your PDF or contract into the secure portal.' },
              { num: '02', title: 'Analyze', desc: 'The engine parses, maps, and cross-references every clause.' },
              { num: '03', title: 'Understand', desc: 'Navigate the Clarity Map and make informed decisions.' },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 rounded-full bg-lexora-950 border border-accent-500/50 flex items-center justify-center mb-6 shadow-[0_0_30px_-5px_var(--color-accent-500)]">
                  <span className="text-2xl font-display font-black text-accent-400">{step.num}</span>
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-3">{step.title}</h3>
                <p className="text-lexora-400 font-light max-w-xs">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="relative py-32 z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-6 tracking-tight">Experience Lexora</h2>
            <p className="text-lg text-lexora-400 font-light max-w-2xl mx-auto">
              Don't have a document ready? Step into the workspace with our pre-analyzed samples.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Freelance Agreement', desc: 'Web development contract with IP, payment, and termination clauses.', text: FREELANCE_AGREEMENT_TEXT, id: 'demo-freelance-v1', file: 'Freelance_Agreement.pdf' },
              { title: 'Residential Lease', desc: 'Apartment lease with rent, deposit, and maintenance terms.', text: RESIDENTIAL_LEASE_TEXT, id: 'demo-lease-v1', file: 'Residential_Lease.pdf' },
              { title: 'Employment Offer', desc: 'Job offer with salary, equity, non-compete, and benefits.', text: EMPLOYMENT_OFFER_TEXT, id: 'demo-employment-v1', file: 'Employment_Offer.pdf' },
              { title: 'Non-Disclosure Agreement', desc: 'Standard mutual NDA with confidentiality obligations and terms.', text: NDA_TEXT, id: 'demo-nda-v1', file: 'Mutual_NDA.pdf' },
              { title: 'SaaS Terms of Service', desc: 'B2B software terms covering licensing, uptime, and data privacy.', text: SAAS_TOS_TEXT, id: 'demo-saas-v1', file: 'CloudSync_ToS.pdf' },
            ].map((doc, i) => (
              <MagneticButton key={i} strength={15} className="w-full">
                <button
                  onClick={() => loadDemo(doc.text, doc.id, doc.file)}
                  className="w-full text-left p-8 rounded-3xl border border-white/10 bg-white/5 hover:bg-accent-500/10 hover:border-accent-500/30 transition-all group backdrop-blur-md"
                >
                  <FileText className="w-6 h-6 text-accent-500 mb-4" />
                  <h3 className="text-xl font-display font-bold text-white mb-3 group-hover:text-accent-400 transition-colors">{doc.title}</h3>
                  <p className="text-sm text-lexora-400 font-light leading-relaxed mb-6">{doc.desc}</p>
                  <span className="text-sm text-accent-500 font-medium flex items-center gap-2">
                    Initialize Demo <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </span>
                </button>
              </MagneticButton>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative py-32 z-10 border-t border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-6 tracking-tight">The Connection</h2>
            <p className="text-lg text-lexora-400 font-light">
              Interested in enterprise deployment or API access? Reach out.
            </p>
          </div>
          <form 
            className="space-y-6 relative" 
            onSubmit={(e) => {
              e.preventDefault();
              setIsMessageSent(true);
              setTimeout(() => setIsMessageSent(false), 5000);
            }}
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-medium text-lexora-400 uppercase tracking-widest">Name</label>
                <input type="text" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-accent-500 focus:bg-white/10 transition-all font-light" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-lexora-400 uppercase tracking-widest">Email</label>
                <input type="email" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-accent-500 focus:bg-white/10 transition-all font-light" placeholder="john@example.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-lexora-400 uppercase tracking-widest">Message</label>
              <textarea rows={4} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-accent-500 focus:bg-white/10 transition-all font-light resize-none" placeholder="How can we help?"></textarea>
            </div>
            <MagneticButton strength={20} className="w-full">
              <button type="submit" className="w-full py-4 rounded-xl bg-accent-500 text-white font-bold text-lg hover:bg-accent-400 transition-colors shadow-[0_0_30px_-5px_var(--color-accent-500)]">
                {isMessageSent ? 'Transmission Sent!' : 'Send Transmission'}
              </button>
            </MagneticButton>
            
            {/* Success Notification Toast */}
            {isMessageSent && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -bottom-16 left-0 right-0 flex justify-center pointer-events-none"
              >
                <div className="px-6 py-3 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-medium backdrop-blur-md flex items-center gap-2 shadow-[0_0_20px_-5px_rgba(34,197,94,0.5)]">
                  <CheckCircle2 className="w-4 h-4" /> Message successfully sent!
                </div>
              </motion.div>
            )}
          </form>
        </div>
      </section>
      <section className="relative py-32 z-10 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-6">Enter the Portal</h2>
            <p className="text-lg text-lexora-400 font-light max-w-2xl mx-auto">
              Drop any legal document into the glowing core below, and watch the intelligence engine map out the hidden complexities.
            </p>
          </div>
          <div className="relative p-[1px] rounded-3xl bg-gradient-to-b from-accent-500/50 to-transparent">
            <div className="bg-lexora-950/80 backdrop-blur-2xl rounded-3xl p-8 md:p-16 border border-white/5">
              <FileUploadZone />
            </div>
          </div>
        </div>
      </section>

      {/* Expressive Footer */}
      <footer className="relative pt-32 pb-12 border-t border-white/5 overflow-hidden z-10 bg-lexora-950">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 pointer-events-none z-0"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-24">
            
            {/* Brand Column */}
            <div className="md:col-span-5 flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <Scale className="w-10 h-10 text-accent-500" />
                <h2 className="text-3xl font-display font-black text-white tracking-widest uppercase">Lexora</h2>
              </div>
              <p className="text-lg text-lexora-400 font-light max-w-sm leading-relaxed">
                We believe that clarity is a fundamental right. Not a law firm. Just artificial intelligence designed with human passion.
              </p>
            </div>

            {/* Navigation Column */}
            <div className="md:col-span-2 md:col-start-7 flex flex-col gap-4">
              <h3 className="text-white font-bold tracking-widest uppercase text-xs mb-2">Platform</h3>
              <a href="#about" className="text-lexora-400 hover:text-white transition-colors text-sm font-light">The Philosophy</a>
              <a href="#features" className="text-lexora-400 hover:text-white transition-colors text-sm font-light">The Engine</a>
              <a href="#how-it-works" className="text-lexora-400 hover:text-white transition-colors text-sm font-light">The Process</a>
              <a href="#contact" className="text-lexora-400 hover:text-white transition-colors text-sm font-light">Contact</a>
            </div>

            {/* Connect Column */}
            <div className="md:col-span-2 flex flex-col gap-4">
              <h3 className="text-white font-bold tracking-widest uppercase text-xs mb-2">Connect</h3>
              <a href="https://github.com/iamhriturajsaha" target="_blank" rel="noopener noreferrer" className="text-lexora-400 hover:text-accent-500 transition-colors text-sm font-light flex items-center gap-2 group">
                GitHub <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </a>
              <a href="https://www.linkedin.com/in/hrituraj-saha-5794b53a0" target="_blank" rel="noopener noreferrer" className="text-lexora-400 hover:text-accent-500 transition-colors text-sm font-light flex items-center gap-2 group">
                LinkedIn <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </a>
              <a href="mailto:iamhriturajsaha@gmail.com" className="text-lexora-400 hover:text-accent-500 transition-colors text-sm font-light flex items-center gap-2 group">
                Email <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </a>
            </div>

            {/* Legal Column */}
            <div className="md:col-span-2 flex flex-col gap-4">
              <h3 className="text-white font-bold tracking-widest uppercase text-xs mb-2">Legal</h3>
              <Link href="/privacy" className="text-lexora-400 hover:text-white transition-colors text-sm font-light">Privacy Policy</Link>
              <Link href="/terms" className="text-lexora-400 hover:text-white transition-colors text-sm font-light">Terms of Service</Link>
              <Link href="/cookies" className="text-lexora-400 hover:text-white transition-colors text-sm font-light">Cookie Policy</Link>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10 gap-4">
            <p className="text-xs text-lexora-500 font-light">
              Designed with passion. © {new Date().getFullYear()} Hrituraj Saha.
            </p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs text-lexora-500 font-light uppercase tracking-widest">Systems Online</span>
            </div>
          </div>
        </div>

        {/* Massive Watermark */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none flex justify-center translate-y-1/3 opacity-[0.02]">
          <h1 className="text-[15vw] font-display font-black text-white whitespace-nowrap tracking-tighter leading-none">
            LEXORA
          </h1>
        </div>
      </footer>
    </div>
  );
}

/** Handle file upload from any upload input */
async function handleFileUpload(files: File[], dispatch: ReturnType<typeof useApp>['dispatch']) {
  if (!files.length) return;
  dispatch({ type: 'SET_ANALYZING', payload: true });
  dispatch({ type: 'SET_VIEW', payload: 'workspace' as const });

  const stages = [
    'Igniting the core...',
    'Parsing legalese...',
    'Illuminating risks...',
    'Mapping obligations...',
    'Distilling truth...',
  ];

  // Animate stages
  for (const stage of stages) {
    dispatch({ type: 'SET_ANALYSIS_STAGE', payload: stage });
    await new Promise(r => setTimeout(r, 400));
  }

  try {
    const results = await Promise.all(files.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Analysis failed');
      }

      return response.json();
    }));

    results.forEach(data => {
      dispatch({ 
        type: 'ADD_DOCUMENT', 
        payload: { document: data.document, analysis: data.analysis } 
      });
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    dispatch({ type: 'SET_ERROR', payload: message });
  }
}

export { handleFileUpload };
