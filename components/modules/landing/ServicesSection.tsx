import * as React from 'react';
import Link from 'next/link';
import {
  FileCheck2,
  CreditCard,
  ShieldCheck,
  IdCard,
  GraduationCap,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Card } from '@/components/ui/atoms/Card';
import { Badge } from '@/components/ui/atoms/Badge';

export function ServicesSection() {
  const services = [
    {
      title: 'NIN Verification',
      desc: 'Verify identity records instantly by 11-digit NIN, registered phone number, or citizen demographics with official slip outputs.',
      icon: <FileCheck2 className="h-6 w-6 text-sky-600" />,
      tag: 'CORE SERVICE',
      href: '/verify',
    },
    {
      title: 'BVN Verification',
      desc: 'Instant Bank Verification Number lookup with options for Basic Slip, Plastic Card format, and Regular Pro reports.',
      icon: <CreditCard className="h-6 w-6 text-purple-600" />,
      tag: 'FINANCIAL',
      href: '/bvn',
    },
    {
      title: 'NIN Validation',
      desc: 'Comprehensive SIM validation, No-Record clearing, and NIMC backend synchronization for telecommunications operators.',
      icon: <ShieldCheck className="h-6 w-6 text-emerald-600" />,
      tag: 'OPERATOR',
      href: '/validation',
    },
    {
      title: 'Slip Personalization',
      desc: 'Generate customized high-resolution standard, premium, and wallet-sized plastic card slips ready for laminating and printing.',
      icon: <IdCard className="h-6 w-6 text-amber-600" />,
      tag: 'PRINTING',
      href: '/personalization',
    },
    {
      title: 'JAMB UTME Services',
      desc: 'Direct profile code generation and candidate record validation for higher institution entrance examinations.',
      icon: <GraduationCap className="h-6 w-6 text-indigo-600" />,
      tag: 'EDUCATION',
      href: '/jamb',
    },
    {
      title: 'Enterprise APIs',
      desc: 'High-throughput REST APIs with automated wallet billing, webhooks, and sub-account management for corporate systems.',
      icon: <Sparkles className="h-6 w-6 text-rose-600" />,
      tag: 'DEVELOPER',
      href: '/signup',
    },
  ];

  return (
    <section id="services-section" className="py-16 sm:py-24 bg-muted/40 border-y border-border/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="default" className="mb-3">
            PORTAL SOLUTIONS
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">
            Complete Identity Services Suite
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Everything you need for identity compliance, verification, validation, and official printouts in one unified platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc) => (
            <Link key={svc.title} href={svc.href} className="group">
              <Card className="p-4 h-full flex flex-col justify-between hover:-translate-y-1 hover:shadow-md transition-all duration-200 border-border/80">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-card border border-border shadow-xs">
                      {svc.icon}
                    </div>
                    <span className="text-[10px] font-extrabold tracking-wider text-muted-foreground">
                      {svc.tag}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      {svc.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                      {svc.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/40 flex items-center gap-1 text-xs font-bold text-primary group-hover:gap-2 transition-all">
                  <span>Access Service</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
