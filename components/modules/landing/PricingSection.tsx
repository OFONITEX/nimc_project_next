import * as React from 'react';
import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/atoms/Card';
import { Button } from '@/components/ui/atoms/Button';
import { Badge } from '@/components/ui/atoms/Badge';

export function PricingSection() {
  const plans = [
    {
      title: 'Identity Verification',
      price: '₦200',
      period: '/ lookup',
      desc: 'Standard NIN, BVN, Phone & Demographic verifications.',
      features: [
        'Instant NIN & BVN Verification',
        'FREE All Slip Downloads (Standard, Premium, Regular, Plastic)',
        'Zero Extra Charges for Slip PDFs',
        'Automated Instant Wallet Funding',
      ],
      popular: true,
      buttonText: 'SignUp',
      href: '/signup',
      badge: 'Flat Rate',
    },
    {
      title: 'NIN Validation',
      price: '₦1,500',
      period: '/ request',
      desc: 'No Record, SIM Linkage, Photo Error & Modification Validation.',
      features: [
        'Fixed ₦1,500 Rate for All Validation Types',
        'Includes Modification Validation (₦1,500)',
        '2–3 Days Fast Processing',
        'Live Reference Code Status Tracker',
      ],
      popular: false,
      buttonText: 'Submit Validation',
      href: '/signup',
    },
    {
      title: 'NIN Personalization',
      price: '₦1,000',
      period: '/ slip',
      desc: 'Generate personalized NIN slips using NIMC Tracking ID.',
      features: [
        'Fast ₦1,000 Personalization Processing',
        'Supports Premium, Standard & Regular Slips',
        'V2 Status Check with Direct Download URL',
        '24/7 Dedicated Support',
      ],
      popular: false,
      buttonText: 'Personalize Now',
      href: '/signup',
    },
  ];

  return (
    <section id="pricing-section" className="py-16 sm:py-24 bg-muted/40 border-y border-border/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="default" className="mb-3">
            TRANSPARENT PRICING
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">
            Flexible Plans for Every Scale
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Fund your wallet seamlessly and pay only for what you verify.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.title}
              className={`p-6 sm:p-7 flex flex-col justify-between ${
                plan.popular ? 'border-2 border-primary shadow-lg bg-card' : 'border border-border/80'
              }`}
            >
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-foreground">{plan.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{plan.desc}</p>
                  </div>
                  {plan.badge && (
                    <Badge className="shrink-0 bg-primary text-white hover:bg-primary px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider shadow-xs border-0">
                      {plan.badge}
                    </Badge>
                  )}
                </div>

                <div className="flex items-baseline gap-1 text-2xl sm:text-3xl font-black text-foreground">
                  <span>{plan.price}</span>
                  <span className="text-xs font-semibold text-muted-foreground">{plan.period}</span>
                </div>

                <ul className="space-y-2.5 pt-4 border-t border-border/60 text-xs">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-foreground/90 font-medium leading-snug">
                      <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5">
                        <Check className="h-3 w-3" />
                      </div>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4">
                <Link href={plan.href}>
                  <Button
                    variant={plan.popular ? 'default' : 'outline'}
                    fullWidth
                    className="font-bold gap-2 text-xs h-10"
                  >
                    {plan.buttonText} <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
