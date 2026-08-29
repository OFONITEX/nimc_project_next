'use client';

import * as React from 'react';
import { CheckCircle2, User, MapPin, Calendar, Phone, Hash, Printer } from 'lucide-react';
import { NinVerificationData } from '@/models/verification/Verification';
import { Card } from '@/components/ui/atoms/Card';
import { Button } from '@/components/ui/atoms/Button';

export interface VerifyResultCardProps {
  data: NinVerificationData;
  onReset: () => void;
}

export function VerifyResultCard({ data, onReset }: VerifyResultCardProps) {
  const fullName = `${data.firstname || ''} ${data.middlename || ''} ${data.lastname || ''}`.trim() || 'VERIFIED CITIZEN';
  const ninNumber = data.nin || data.vnin || '—';
  const phone = data.telephoneno || data.phone || '—';
  const dob = data.dob || data.birthdate || '—';
  const gender = (data.gender || '—').toUpperCase();
  const address = data.residence_address || '—';
  const stateLga = `${data.residence_lga || ''}, ${data.residence_state || ''}`.replace(/^,\s*|,\s*$/g, '') || '—';

  return (
    <div className="space-y-4 animate-in fade-in-50 duration-300">
      {/* Status Bar */}
      <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-3.5 py-2.5 text-green-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 text-white">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold">NIMC Identity Record Verified</h4>
            <p className="text-[11px] text-green-700">Record retrieved securely from national identity database</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onReset} className="h-7 text-xs bg-white text-gray-800">
          New Lookup
        </Button>
      </div>

      {/* Official Identity Card Display */}
      <Card className="overflow-hidden border border-border shadow-xs">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-primary px-4 py-3 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-white/10 p-0.5 backdrop-blur-xs flex items-center justify-center border border-white/20">
              <img src="/img/ofonitech_logo.jpg" alt="Logo" className="h-full w-full object-cover rounded-md" />
            </div>
            <div>
              <div className="text-[9px] font-bold tracking-widest uppercase text-white/80">Federal Republic of Nigeria</div>
              <h3 className="text-xs sm:text-sm font-black tracking-tight">National Identity Management Commission</h3>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <span className="rounded-md bg-white/20 px-2 py-0.5 text-[9px] font-extrabold tracking-wider">
              OFFICIAL VERIFICATION
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-3 gap-4 bg-card">
          {/* Photo Column */}
          <div className="flex flex-col items-center justify-center p-3 border border-border rounded-xl bg-muted/30">
            <div className="h-36 w-28 overflow-hidden rounded-lg border border-primary/40 bg-muted shadow-2xs flex items-center justify-center">
              {data.photo ? (
                <img
                  src={data.photo.startsWith('data:') ? data.photo : `data:image/jpeg;base64,${data.photo}`}
                  alt={fullName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-16 w-16 text-muted-foreground/50" />
              )}
            </div>
            <div className="mt-2 text-center">
              <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">National Identity Number</span>
              <div className="text-sm font-black tracking-widest text-primary font-mono">{ninNumber}</div>
            </div>
          </div>

          {/* Details Column */}
          <div className="md:col-span-2 space-y-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Full Legal Name</span>
              <div className="text-base font-black text-foreground uppercase">{fullName}</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/60">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Date of Birth
                </span>
                <div className="text-xs font-bold text-foreground mt-0.5">{dob}</div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <User className="h-3 w-3" /> Gender
                </span>
                <div className="text-xs font-bold text-foreground mt-0.5">{gender}</div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Phone className="h-3 w-3" /> Phone Number
                </span>
                <div className="text-xs font-bold text-foreground font-mono mt-0.5">{phone}</div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Hash className="h-3 w-3" /> Tracking ID
                </span>
                <div className="text-xs font-bold text-foreground font-mono mt-0.5">{data.tracking_id || '—'}</div>
              </div>
            </div>

            <div className="pt-2 border-t border-border/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" /> Residential Address &amp; LGA
              </span>
              <div className="text-xs font-medium text-foreground mt-0.5">{address} ({stateLga})</div>
            </div>

            {/* Print Action */}
            <div className="pt-2 flex flex-wrap gap-2">
              <Button variant="default" size="sm" onClick={() => window.print()} className="gap-1.5 text-xs h-8">
                <Printer className="h-3.5 w-3.5" /> Print Verification Slip
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
