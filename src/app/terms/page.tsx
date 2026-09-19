import { ArrowLeft, Scale } from 'lucide-react';
import Link from 'next/link';
import { GlowingOrb } from '@/components/ui/GlowingOrb';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-lexora-950 font-body selection:bg-accent-500 selection:text-white relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <GlowingOrb color="var(--color-accent-700)" size={600} blur={200} x={-400} y={-300} duration={15} />
        <GlowingOrb color="var(--color-accent-500)" size={500} blur={180} x={400} y={200} delay={2} duration={20} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-lexora-950/40 backdrop-blur-2xl">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <Scale className="w-6 h-6 text-accent-500 group-hover:scale-110 transition-transform" />
            <span className="text-lg font-bold tracking-widest text-white uppercase font-display">LEXORA</span>
          </Link>
          <Link href="/" className="text-lexora-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </nav>

      <main className="relative z-10 pt-40 pb-32 max-w-3xl mx-auto px-6">
        <h1 className="text-5xl md:text-6xl font-black font-display text-white mb-8">Terms of Service</h1>
        <p className="text-accent-500 font-medium mb-12 tracking-widest uppercase text-sm">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-12 text-lexora-300 leading-relaxed font-light text-lg">
          <section>
            <h2 className="text-2xl font-bold font-display text-white mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Lexora, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-display text-white mb-4">2. Not Legal Advice</h2>
            <p className="text-accent-400 font-bold border-l-4 border-accent-500 pl-4 py-2">
              Lexora is a technology platform, not a law firm. The insights, summaries, and analyses provided by our intelligence engine do not constitute legal advice. You should always consult with a qualified attorney before making any legal decisions or signing any binding contracts.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-display text-white mb-4">3. User Responsibilities</h2>
            <p>
              You are responsible for the documents you upload. You warrant that you have the right to upload and process these documents, and that doing so does not violate any confidentiality agreements, third-party rights, or applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-display text-white mb-4">4. Limitation of Liability</h2>
            <p>
              In no event shall Lexora, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
