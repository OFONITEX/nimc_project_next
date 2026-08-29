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
      desc: 'Standard BVN printout slip containing essential customer identity details and verification summary.',
      icon: <FileText className="h-5 w-5 text-sky-600" />,
      iconBg: 'bg-sky-50 text-sky-600',
      borderTop: 'border-t-sky-600',
      buttonBg: 'bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-700 hover:to-blue-800',
      href: '/verify?type=bvn&slip=basic',
    },
    {
      title: 'Plastic Card',
      price: '₦300',
      desc: 'Wallet-sized BVN Plastic Card layout ready for high-resolution laminated plastic card printing.',
      icon: <IdCard className="h-5 w-5 text-purple-600" />,
      iconBg: 'bg-purple-50 text-purple-600',
      borderTop: 'border-t-purple-600',
      buttonBg: 'bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800',
      href: '/verify?type=bvn&slip=plastic',
    },
    {
      title: 'Regular Pro Slip',
      price: '₦300',
      desc: 'Full-page BVN identity report with enhanced security QR code and complete banking metadata.',
      icon: <Sparkles className="h-5 w-5 text-emerald-600" />,
      iconBg: 'bg-emerald-50 text-emerald-600',
      borderTop: 'border-t-emerald-600',
      buttonBg: 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800',
      href: '/verify?type=bvn&slip=regular_pro',
    },
  ];

  return (
    <ContentWidthContainer variant="wide" className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-lg sm:text-xl font-black tracking-tight text-foreground flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-purple-600 shrink-0" />
          Bank Verification Number (BVN) Services
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Select a BVN slip format below to perform instant lookup and print official documentation.
        </p>
      </div>

      {/* 3-Card Grid (Tight & Fitted) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {bvnOptions.map((opt) => (
          <Card
            key={opt.title}
            className={`p-3 sm:p-4 flex flex-col justify-between border-t-4 ${opt.borderTop} shadow-2xs hover:-translate-y-0.5 hover:shadow-xs transition-all duration-200`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${opt.iconBg}`}>
                  {opt.icon}
                </div>
                <Badge variant="secondary" className="px-2.5 py-0.5 font-extrabold text-[11px]">
                  {opt.price} / lookup
                </Badge>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-foreground">{opt.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {opt.desc}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border/50">
              <Link href={opt.href}>
                <Button
                  className={`w-full gap-2 text-xs font-bold text-white shadow-2xs h-9 ${opt.buttonBg}`}
                >
                  Select {opt.title} <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </ContentWidthContainer>
  );
}
