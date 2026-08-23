import * as React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, Zap, CheckCircle2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/atoms/Button';
import { Badge } from '@/components/ui/atoms/Badge';

export function HeroSection() {
  return (
    <section id="home-section" className="relative overflow-hidden py-16 sm:py-24 lg:py-32">
      {/* Background Gradient Blurs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-primary/10 blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-light/60 px-4 py-1.5 text-xs font-bold text-primary mb-6">
          <Zap className="h-3.5 w-3.5" /> Direct NIMC &amp; BVN Gateway Access
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground max-w-4xl mx-auto leading-tight sm:leading-none">
          Nigeria&apos;s Fastest <span className="text-primary">NIN &amp; BVN</span> Verification Portal
        </h1>

        <p className="mt-6 text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Enterprise identity verification, instant biometric slip generation, BVN lookup, and seamless API integrations for business operators and agents across Nigeria.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/signup" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto gap-2 font-bold shadow-md h-12 px-8">
              Start Verifying Now <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto font-bold h-12 px-8">
              Operator Portal Login
            </Button>
          </Link>
        </div>

        {/* Features Row */}
        <div className="mt-12 pt-8 border-t border-border/60 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
            <span className="text-xs font-semibold text-foreground">99.9% Uptime SLA</span>
          </div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
            <span className="text-xs font-semibold text-foreground">Official NIMC Records</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Lock className="h-5 w-5 text-primary shrink-0" />
            <span className="text-xs font-semibold text-foreground">256-Bit Encrypted</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Zap className="h-5 w-5 text-primary shrink-0" />
            <span className="text-xs font-semibold text-foreground">Instant Automated Delivery</span>
          </div>
        </div>
      </div>
    </section>
  );
}
