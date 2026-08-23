import * as React from 'react';
import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/atoms/Card';
import { Button } from '@/components/ui/atoms/Button';
import { Badge } from '@/components/ui/atoms/Badge';

export function PricingSection() {
  const plans = [
    {
      title: 'Standard Operator',
      price: 'Pay Per Query',
      desc: 'Ideal for cyber cafe centers, small business merchants, and individual operators.',
      features: [
        'NIN Verification @ ₦300',
        'Basic BVN Slip @ ₦200',
        'Plastic Card BVN @ ₦300',
        'Automated Wallet Top-up',
        'PDF Slip Downloads',
      ],
      popular: false,
      buttonText: 'Get Started Free',
      href: '/signup',
    },
    {
      title: 'Verified Agent',
      price: 'Discounted Bulk',
      desc: 'Customized pricing for high-volume agents, aggregators, and enterprise teams.',
      features: [
        'Discounted NIN Rates (< ₦300)',
        'Discounted BVN Rates (< ₦200)',
        'Priority Gateway Routing',
        'Direct Account Officer Support',
        'Bulk Batch Processing Access',
      ],
      popular: true,
      buttonText: 'Register as Agent',
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
            No Monthly Fees. Pay As You Verify.
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Fund your wallet with any amount and only pay for the verification lookups you perform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.title}
              className={`p-6 sm:p-8 flex flex-col justify-between ${
                plan.popular ? 'border-2 border-primary shadow-lg bg-card' : 'border border-border/80'
              }`}
            >
              <div className="space-y-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{plan.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{plan.desc}</p>
                  </div>
                  {plan.popular && (
                    <Badge className="shrink-0 bg-primary text-white hover:bg-primary px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider shadow-xs border-0">
                      MOST POPULAR
                    </Badge>
                  )}
                </div>

                <div className="text-2xl sm:text-3xl font-black text-foreground">
                  {plan.price}
                </div>

                <ul className="space-y-3 pt-4 border-t border-border/60 text-xs">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-foreground/90 font-medium">
                      <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Check className="h-3 w-3" />
                      </div>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4">
                <Link href={plan.href}>
                  <Button
                    variant={plan.popular ? 'default' : 'outline'}
                    fullWidth
                    className="font-bold gap-2 text-xs"
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
