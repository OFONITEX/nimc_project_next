'use client';

import * as React from 'react';
import Link from 'next/link';
import { CreditCard, FileText, IdCard, Sparkles, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/atoms/Card';
import { Badge } from '@/components/ui/atoms/Badge';
import { Button } from '@/components/ui/atoms/Button';
import { ContentWidthContainer } from '@/components/ui/molecules/ContentWidthContainer';

export function BvnSelectionPage() {
  const bvnOptions = [
    {
      title: 'Basic Slip',
      price: '₦200',
      desc: 'Standard BVN printout slip containing essential customer identity details and digital verification summary.',
      icon: <FileText className="h-6 w-6 text-sky-600" />,
      iconBg: 'bg-sky-50 dark:bg-sky-950/40 text-sky-600',
      borderTop: 'border-t-sky-600',
      buttonBg: 'bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-700 hover:to-blue-800',
      href: '/verify?type=bvn&slip=basic',
    },
    {
      title: 'Plastic Card',
      price: '₦300',
      desc: 'Wallet-sized BVN Plastic Card layout ready for instant high-resolution laminated plastic card printing.',
      icon: <IdCard className="h-6 w-6 text-purple-600" />,
      iconBg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600',
      borderTop: 'border-t-purple-600',
      buttonBg: 'bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800',
      href: '/verify?type=bvn&slip=plastic',
    },
    {
      title: 'Regular Pro Slip',
      price: '₦300',
      desc: 'Premium full-page BVN identity report with enhanced security QR code and complete banking metadata.',
      icon: <Sparkles className="h-6 w-6 text-emerald-600" />,
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600',
      borderTop: 'border-t-emerald-600',
      buttonBg: 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800',
      href: '/verify?type=bvn&slip=regular_pro',
    },
  ];

  return (
    <ContentWidthContainer variant="wide" className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
          <CreditCard className="h-6 w-6 text-purple-600 shrink-0" />
          Bank Verification Number (BVN) Services
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Select a BVN slip format below to perform instant lookup and print official documentation.
        </p>
      </div>

      {/* 3-Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {bvnOptions.map((opt) => (
          <Card
            key={opt.title}
            className={`p-6 flex flex-col justify-between border-t-4 ${opt.borderTop} shadow-card hover:-translate-y-1 transition-all duration-200`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${opt.iconBg}`}>
                  {opt.icon}
                </div>
                <Badge variant="secondary" className="px-3 py-1 font-black text-xs">
                  {opt.price} / lookup
                </Badge>
              </div>

              <div>
                <h3 className="text-base font-bold text-foreground">{opt.title}</h3>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  {opt.desc}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border/50">
              <Link href={opt.href}>
                <Button
                  className={`w-full gap-2 text-xs font-bold text-white shadow-sm ${opt.buttonBg}`}
                >
                  Select {opt.title} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </ContentWidthContainer>
  );
}
