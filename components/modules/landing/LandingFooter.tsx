import * as React from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-card py-12 text-muted-foreground text-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 overflow-hidden rounded-xl border border-border">
              <img
                src="/img/ofonitech_logo.jpg"
                alt="Logo"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <span className="font-bold text-foreground block">OFONITECH SOLUTIONZ</span>
              <span className="text-[11px] text-primary">myninverify.com</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link href="/login" className="hover:text-foreground transition-colors">
              Operator Login
            </Link>
            <Link href="/signup" className="hover:text-foreground transition-colors">
              Create Account
            </Link>
            <Link href="/verify" className="hover:text-foreground transition-colors">
              NIN Verification
            </Link>
            <Link href="/bvn" className="hover:text-foreground transition-colors">
              BVN Services
            </Link>
          </div>

          <div className="text-center md:text-right">
            <p>&copy; {new Date().getFullYear()} OFONITECH SOLUTIONZ. All rights reserved.</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Authorized NIN &amp; BVN Verification Gateway
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
