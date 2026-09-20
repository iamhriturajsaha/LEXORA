import { ArrowLeft, Scale } from 'lucide-react';
import Link from 'next/link';
import { GlowingOrb } from '@/components/ui/GlowingOrb';

export default function CookiePolicy() {
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
        <h1 className="text-5xl md:text-6xl font-black font-display text-white mb-8">Cookie Policy</h1>
        <p className="text-accent-500 font-medium mb-12 tracking-widest uppercase text-sm">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-12 text-lexora-300 leading-relaxed font-light text-lg">
          <section>
            <h2 className="text-2xl font-bold font-display text-white mb-4">1. What Are Cookies</h2>
            <p>
              Cookies are small pieces of text sent to your web browser by a website you visit. A cookie file is stored in your web browser and allows the Service or a third-party to recognize you and make your next visit easier and the Service more useful to you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold font-display text-white mb-4">2. How Lexora Uses Cookies</h2>
            <p className="mb-4">When you use and access the Service, we may place a number of cookies files in your web browser. We use cookies for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-white">Essential Cookies:</strong> To enable certain functions of the Service, such as remembering your session state during document analysis.</li>
              <li><strong className="text-white">Analytics Cookies:</strong> To track information on how the Service is used so that we can make improvements. We may also use analytics cookies to test new pages or features.</li>
            </ul>
          </section>

          <section>
            <p>
              If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the help pages of your web browser. Please note, however, that if you delete cookies or refuse to accept them, you might not be able to use all of the features we offer, and some of our pages might not display properly.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
