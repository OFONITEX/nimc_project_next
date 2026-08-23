import * as React from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { Card } from '@/components/ui/atoms/Card';
import { Button } from '@/components/ui/atoms/Button';
import { Input } from '@/components/ui/atoms/Input';

export function ContactSection() {
  return (
    <section id="contact-section" className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Details */}
          <div className="space-y-6">
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary">
              GET IN TOUCH
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground leading-tight">
              We&apos;re Here to Support Your Operations
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Have questions about becoming an accredited agent, setting up API integrations, or resolving lookup issues? Our support desk is online 24/7.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Email Support</div>
                  <a href="mailto:support@myninverify.com" className="text-xs sm:text-sm font-bold text-foreground hover:text-primary transition-colors">
                    support@myninverify.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">WhatsApp &amp; Phone Desk</div>
                  <span className="text-xs sm:text-sm font-bold text-foreground font-mono">
                    +234 813 000 0000
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Headquarters</div>
                  <span className="text-xs sm:text-sm font-bold text-foreground">
                    Abuja &amp; Lagos, Nigeria
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Contact Form */}
          <Card className="p-6 sm:p-8 shadow-card border border-border">
            <h3 className="text-base font-bold text-foreground mb-4">Send a Message</h3>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-foreground/80 block mb-1.5">
                  Your Name
                </label>
                <Input placeholder="e.g. John Doe" />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-foreground/80 block mb-1.5">
                  Email Address
                </label>
                <Input type="email" placeholder="e.g. user@example.com" />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-foreground/80 block mb-1.5">
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="How can we assist you today?"
                  className="flex w-full rounded-xl border border-border bg-card px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <Button type="submit" variant="default" fullWidth className="font-bold gap-2">
                <Send className="h-4 w-4" /> Send Message
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
}
