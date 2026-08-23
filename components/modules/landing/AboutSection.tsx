import * as React from 'react';
import { Award, CheckCircle2, ShieldCheck, Users } from 'lucide-react';
import { Card } from '@/components/ui/atoms/Card';

export function AboutSection() {
  return (
    <section id="about-section" className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content Column */}
          <div className="space-y-6">
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary">
              ABOUT OFONITECH SOLUTIONZ
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground leading-tight">
              Leading the Standard for Nigerian Identity Tech
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              OFONITECH SOLUTIONZ (operating <strong>myninverify.com</strong>) is an authorized identity and software engineering enterprise registered with the Corporate Affairs Commission (CAC) and licensed to deliver secure verification gateways and digital services.
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              We empower over 10,000+ verification agents, cafe operators, telecom merchants, and corporate fintechs with instantaneous, uninterrupted access to NIMC and NIBSS records with 99.9% uptime.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Regulated &amp; Verified</h4>
                  <p className="text-[11px] text-muted-foreground">Compliant with NDPR data privacy standards</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Dedicated Support</h4>
                  <p className="text-[11px] text-muted-foreground">24/7 technical operator assistance</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats / Visual Card */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-6 text-center space-y-2 border-border/80">
              <div className="text-3xl sm:text-4xl font-black text-primary">1M+</div>
              <div className="text-xs font-bold text-foreground">Identities Verified</div>
              <p className="text-[11px] text-muted-foreground">Across all Nigerian states</p>
            </Card>

            <Card className="p-6 text-center space-y-2 border-border/80">
              <div className="text-3xl sm:text-4xl font-black text-amber-500">10K+</div>
              <div className="text-xs font-bold text-foreground">Registered Agents</div>
              <p className="text-[11px] text-muted-foreground">Active portal operators</p>
            </Card>

            <Card className="p-6 text-center space-y-2 border-border/80">
              <div className="text-3xl sm:text-4xl font-black text-sky-600">99.9%</div>
              <div className="text-xs font-bold text-foreground">Service Uptime</div>
              <p className="text-[11px] text-muted-foreground">Enterprise cloud SLA</p>
            </Card>

            <Card className="p-6 text-center space-y-2 border-border/80">
              <div className="text-3xl sm:text-4xl font-black text-purple-600">&lt; 2s</div>
              <div className="text-xs font-bold text-foreground">Response Speed</div>
              <p className="text-[11px] text-muted-foreground">Instant query results</p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
