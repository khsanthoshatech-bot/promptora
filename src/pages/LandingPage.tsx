import React, { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth, SignInButton, SignedIn, SignedOut } from '../lib/auth';
import { Terminal, Key, LayoutDashboard, ShieldCheck, Zap, Server, ChevronRight, CheckCircle2, ArrowRight, Network, Mail, Cpu, BarChart } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export default function LandingPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  if (isLoaded && isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-[#000000] text-neutral-200 font-sans selection:bg-neutral-800 overflow-x-hidden">
      
      {/* --- Minimalist Background --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-screen"></div>
        <div className="absolute top-0 inset-x-0 h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06)_0%,transparent_60%)]"></div>
      </div>

      {/* --- Navbar --- */}
      <header className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b",
        scrolled ? "bg-black/60 backdrop-blur-xl border-white/10 py-4" : "bg-transparent border-transparent py-6"
      )}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-8 h-8 rounded bg-white flex items-center justify-center transition-transform group-hover:scale-105">
              <Terminal className="w-4 h-4 text-black" />
            </div>
            <span className="text-white font-medium tracking-tight text-lg">Promptora</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            {['Features', 'Architecture', 'Benefits', 'Pricing'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-sm font-medium text-neutral-400 hover:text-white px-2 hidden sm:block transition-colors">Log in</button>
              </SignInButton>
              <SignInButton mode="modal">
                <button className="bg-white text-black px-4 py-2 rounded text-sm font-medium hover:bg-neutral-200 transition-colors">
                  Get Started
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link to="/dashboard" className="bg-white text-black px-4 py-2 rounded text-sm font-medium hover:bg-neutral-200 transition-colors">
                Dashboard
              </Link>
            </SignedIn>
          </div>
        </div>
      </header>
      
      {/* --- Main Content --- */}
      <main className="relative z-10 pt-32 pb-24 flex flex-col items-center">
        
        {/* --- Hero Section --- */}
        <section className="relative w-full max-w-5xl mx-auto px-6 text-center pt-24 pb-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900/50 mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              <span className="text-neutral-300 text-xs font-medium tracking-wide">Unified Gateway</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl md:text-8xl font-medium tracking-tighter mb-6 text-white leading-[1.05]"
            >
              Every AI Model.<br />
              <span className="text-neutral-500 relative inline-block">
                One API.
                <motion.div 
                  className="absolute bottom-2 left-0 right-0 h-[2px] bg-neutral-700 origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1, duration: 0.8, ease: "circOut" }}
                />
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-10 font-light leading-relaxed"
            >
              Route requests to leading AI providers through a single unified gateway. Manage API keys, monitor usage, and control costs from one robust platform.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full"
            >
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="w-full sm:w-auto px-6 py-3 rounded bg-white text-black font-medium hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 group">
                    Start Building <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link to="/dashboard" className="w-full sm:w-auto px-6 py-3 rounded bg-white text-black font-medium hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 group">
                  Go to Dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </SignedIn>
              <a href="#architecture" className="w-full sm:w-auto px-6 py-3 rounded border border-neutral-800 text-white font-medium hover:bg-neutral-900 transition-colors flex items-center justify-center">
                Explore Architecture
              </a>
            </motion.div>
          </motion.div>
        </section>

        {/* --- Stats Section --- */}
        <section className="w-full border-y border-neutral-900 bg-neutral-950/30 py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:divide-x divide-neutral-900">
              {[
                { label: "Uptime SLA", value: "99.99%" },
                { label: "Providers", value: "Native" },
                { label: "Analytics", value: "Real-Time" },
                { label: "Security", value: "Enterprise" }
              ].map((stat, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex flex-col items-center text-center">
                  <div className="text-3xl md:text-4xl font-medium text-white tracking-tight mb-2">{stat.value}</div>
                  <div className="text-xs text-neutral-500 font-medium uppercase tracking-widest">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* --- Architecture Section --- */}
        <section id="architecture" className="w-full py-32 border-b border-neutral-900">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-24">
              <h2 className="text-3xl md:text-5xl font-medium text-white tracking-tight mb-6">Seamless Routing</h2>
              <p className="text-lg text-neutral-400 max-w-2xl mx-auto font-light">
                Your application talks to Promptora. Promptora talks to the world.
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 max-w-4xl mx-auto">
              
              {/* Client Apps */}
              <div className="w-full md:w-64 p-6 rounded-xl bg-neutral-950 border border-neutral-800 text-center relative z-10 hover:border-neutral-700 transition-colors">
                <Cpu className="w-8 h-8 text-neutral-300 mx-auto mb-4" />
                <h3 className="font-medium text-white mb-1">Your App</h3>
                <p className="text-xs text-neutral-500">Single Endpoint Integration</p>
              </div>

              {/* Connector */}
              <div className="hidden md:flex flex-col items-center justify-center w-16">
                <div className="w-full h-[1px] bg-neutral-800 relative">
                  <motion.div animate={{ x: [0, 64] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="absolute -top-[1.5px] left-0 w-1 h-[4px] bg-white rounded-full" />
                </div>
              </div>

              {/* Gateway */}
              <div className="w-full md:w-72 p-8 rounded-xl bg-black border border-neutral-700 text-center relative z-10 shadow-[0_0_40px_rgba(255,255,255,0.03)] focus:border-white">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.05)_0%,transparent_70%)] rounded-xl pointer-events-none"></div>
                <Server className="w-10 h-10 text-white mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">Promptora API</h3>
                <p className="text-xs text-neutral-400">Gateway Layer</p>
              </div>

              {/* Connector */}
              <div className="hidden md:flex flex-col items-center justify-center w-16">
                <div className="w-full h-[1px] bg-neutral-800 relative">
                  <motion.div animate={{ x: [0, 64] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.75 }} className="absolute -top-[1.5px] left-0 w-1 h-[4px] bg-white rounded-full" />
                </div>
              </div>

              {/* Providers */}
              <div className="w-full md:w-64 flex flex-col gap-3 relative z-10">
                {['OpenAI', 'Anthropic', 'Gemini', 'DeepSeek'].map((provider, i) => (
                  <div key={i} className="px-4 py-3 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-between group hover:border-neutral-600 transition-colors">
                    <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">{provider}</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-neutral-700 group-hover:bg-white transition-colors"></div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* --- Features Section --- */}
        <section id="features" className="w-full py-32">
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-20 max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-medium text-white tracking-tight leading-tight mb-6">Designed for scale. <br/>Built for performance.</h2>
              <p className="text-lg text-neutral-400 font-light">
                Enterprise-grade infrastructure giving you complete control over your cross-provider AI deployments.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Network, title: "Unified Gateway", desc: "One uniform REST API for all major LLM providers. Stop rewriting integration code." },
                { icon: Key, title: "API Key Management", desc: "Generate, rotate, and revoke secure API keys instantly for all your environments." },
                { icon: BarChart, title: "Usage Analytics", desc: "Deep insights into token usage, latency, and request volume in real-time." },
                { icon: Zap, title: "Cost Tracking", desc: "Monitor your spend across all AI providers in a single unified dashboard." },
                { icon: ShieldCheck, title: "Enterprise Security", desc: "DDoS protection, rate limiting, and 99.9% SLA for mission-critical apps." },
                { icon: LayoutDashboard, title: "Developer Dashboard", desc: "A beautifully designed interface to manage your entire AI infrastructure." }
              ].map((feat, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} 
                  className="p-8 rounded-2xl bg-neutral-950/50 border border-neutral-900 hover:bg-neutral-900 transition-colors duration-300"
                >
                  <div className="w-10 h-10 rounded border border-neutral-800 bg-black flex items-center justify-center mb-6">
                    <feat.icon className="w-5 h-5 text-neutral-300" />
                  </div>
                  <h3 className="text-lg font-medium mb-3 text-white">{feat.title}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">{feat.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* --- Why Choose Section --- */}
        <section id="benefits" className="w-full py-32 bg-neutral-950 border-y border-neutral-900">
          <div className="max-w-6xl mx-auto px-6">
             <div className="grid lg:grid-cols-2 gap-16 items-start">
                <div>
                   <h2 className="text-3xl md:text-5xl font-medium mb-8 leading-tight text-white tracking-tight">
                     Why developers choose <span className="text-neutral-500">Promptora</span>
                   </h2>
                   <p className="text-lg text-neutral-400 font-light mb-10 leading-relaxed">
                     Building with multiple providers natively is complex. We abstract away rate limits, provider-specific quirks, and disparate billing systems into one elegant solution.
                   </p>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
                   {[
                     "One API Key for All Models",
                     "Unified Billing & Tracking",
                     "Real-Time Analytics",
                     "Automated Cost Optimization",
                     "Enterprise Grade Security",
                     "Scalable Infrastructure",
                     "Zero-Downtime Switching",
                     "Developer-Friendly Specs"
                   ].map((benefit, i) => (
                      <div key={i} className="flex gap-4 items-start pb-4 border-b border-neutral-900 last:border-0 last:pb-0">
                        <CheckCircle2 className="w-5 h-5 text-white shrink-0 mt-0.5" />
                        <span className="text-neutral-300 font-medium">{benefit}</span>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </section>

        {/* --- Pricing Details / Contact Focus --- */}
        <section id="pricing" className="w-full py-32">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-medium text-white tracking-tight mb-8">Pricing designed for scale.</h2>
            <p className="text-lg text-neutral-400 font-light leading-relaxed mb-6">
              Every business has different AI usage patterns.
            </p>
            <p className="text-lg text-neutral-400 font-light leading-relaxed mb-12">
              We offer flexible, usage-based billing and custom plans tailored to your exact needs. Contact us to discuss volume discounts, enterprise deployments, and partnerships.
            </p>
            
            <a href="#contact" className="inline-flex px-8 py-3 rounded bg-white text-black font-medium hover:bg-neutral-200 transition-colors gap-2 items-center group overflow-hidden relative">
               <span className="relative z-10 flex items-center gap-2">Contact Us <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
               <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
            </a>
          </div>
        </section>

        {/* --- Contact / Support Section --- */}
        <section id="contact" className="w-full py-32 bg-neutral-950 border-t border-neutral-900">
           <div className="max-w-3xl mx-auto px-6 text-center">
              <Mail className="w-8 h-8 text-white mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-medium text-white tracking-tight mb-6">Get in Touch</h2>
              <p className="text-lg text-neutral-400 mb-10 font-light">
                 Have questions, feedback, partnership opportunities, or need help getting started with Promptora API?
              </p>
              
              <a href="mailto:khsanthosha.plans@gmail.com" className="inline-block px-6 py-4 border border-neutral-800 rounded bg-black text-white font-medium hover:border-neutral-600 transition-colors">
                 khsanthosha.plans@gmail.com
              </a>
              
              <p className="text-xs text-neutral-500 mt-8 uppercase tracking-widest font-medium">We typically respond within 24–48 hours.</p>
           </div>
        </section>

      </main>

      {/* --- Footer --- */}
      <footer className="w-full border-t border-neutral-900 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
             <div className="flex items-center gap-3 opacity-80">
               <div className="w-6 h-6 rounded border border-neutral-700 bg-black flex items-center justify-center">
                 <Terminal className="w-3 h-3 text-white" />
               </div>
               <span className="text-white font-medium tracking-tight text-sm">Promptora API</span>
             </div>
             
             <div className="flex flex-wrap justify-center gap-8 text-sm text-neutral-500">
               <a href="#" className="hover:text-white transition-colors">Documentation</a>
               <a href="#" className="hover:text-white transition-colors">API Reference</a>
               <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
               <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
             </div>
          </div>
          
          <div className="mt-8 text-center md:text-left text-xs text-neutral-600">
            &copy; {new Date().getFullYear()} Promptora Inc. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
