import { ArrowLeft, Scale } from 'lucide-react';
import Link from 'next/link';
import { GlowingOrb } from '@/components/ui/GlowingOrb';

export default function PrivacyPolicy() {
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
        <h1 className="text-5xl md:text-6xl font-black font-display text-white mb-8">Privacy Policy</h1>
        <p className="text-accent-500 font-medium mb-12 tracking-widest uppercase text-sm">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-12 text-lexora-300 leading-relaxed font-light text-lg">
          <section>
            <h2 className="text-2xl font-bold font-display text-white mb-4">1. The Absolute Baseline</h2>
            <p>
              At Lexora, we believe that your legal documents are yours. We do not train our core intelligence models on your private agreements without your explicit consent, and we do not sell your personal data. This privacy policy outlines how we handle your information with the utmost respect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-display text-white mb-4">2. Data We Collect</h2>
            <p className="mb-4">We collect minimal information necessary to provide you with an exceptional experience:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-white">Account Information:</strong> If you create an account, we collect your name and email.</li>
              <li><strong className="text-white">Document Data:</strong> Documents you upload are processed transiently to generate your Clarity Map.</li>
              <li><strong className="text-white">Usage Analytics:</strong> Anonymous interactions to help us improve the interface.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-display text-white mb-4">3. Transient Processing</h2>
            <p>
              When you upload a document for analysis, it is securely transmitted to our servers, processed by our intelligence engine, and immediately purged from our active processing memory once the analysis is complete. Unless you explicitly choose to save a document to your account, it ceases to exist on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-display text-white mb-4">4. Third-Party Services</h2>
            <p>
              We utilize top-tier infrastructure providers (like Vercel and OpenAI) to process your requests. These providers are bound by strict confidentiality agreements and are not permitted to use your data for their own independent purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-display text-white mb-4">5. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please reach out via our contact form or email us at <a href="mailto:privacy@lexora.ai" className="text-accent-400 hover:text-accent-300 underline">privacy@lexora.ai</a>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
