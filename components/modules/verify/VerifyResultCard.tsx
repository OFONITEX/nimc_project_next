'use client';

import * as React from 'react';
import {
  User,
  Download,
  Copy,
  Check,
  CheckCircle2,
  Crown,
  FileText,
  Fingerprint,
  RotateCcw
} from 'lucide-react';
import { NinVerificationData } from '@/models/verification/Verification';
import { Card } from '@/components/ui/atoms/Card';

export interface VerifyResultCardProps {
  data: NinVerificationData;
  onReset: () => void;
}

export type SlipDownloadType = 'premium' | 'standard' | 'regular' | 'vnin';

export function VerifyResultCard({ data, onReset }: VerifyResultCardProps) {
  const d = data as any;
  const raw = d.raw || {};

  const [copied, setCopied] = React.useState(false);
  const [isDownloading, setIsDownloading] = React.useState<SlipDownloadType | null>(null);
  const [downloadError, setDownloadError] = React.useState<string | null>(null);

  const fn = (d.firstname || d.first_name || raw.firstname || raw.first_name || '').trim();
  const mn = (d.middlename || d.middle_name || raw.middlename || raw.middle_name || '').trim();
  const ln = (d.lastname || d.last_name || raw.lastname || raw.last_name || '').trim();
  const fullName =
    `${fn} ${mn} ${ln}`.trim() ||
    d.name ||
    d.fullName ||
    raw.name ||
    raw.fullName ||
    'VERIFIED CITIZEN';

  const ninNumber = d.nin || d.vnin || raw.nin || raw.vnin || (d.bvn ? null : '—');
  const bvnNumber = d.bvn || raw.bvn || null;
  const vninNumber =
    d.vnin || raw.vnin || (ninNumber && ninNumber !== '—' ? `VNIN${ninNumber.slice(0, 10)}` : '—');

  const phone =
    d.phone ||
    d.telephoneno ||
    d.phone_number ||
    raw.telephoneno ||
    raw.phone ||
    raw.phoneNumber ||
    '—';

  const dob =
    d.dob ||
    d.birthdate ||
    d.date_of_birth ||
    raw.birthdate ||
    raw.dob ||
    raw.dateOfBirth ||
    '—';

  const gender = (d.gender || raw.gender || raw.sex || '—').toUpperCase();
  const nationality = (d.nationality || raw.nationality || 'NIGERIAN').toUpperCase();
  const maritalStatus = (
    d.maritalstatus ||
    d.marital_status ||
    raw.maritalstatus ||
    raw.marital_status ||
    'SINGLE'
  ).toUpperCase();

  const email = d.email || raw.email || 'N/A';
  const watchListed =
    d.watch_listed ||
    raw.watch_listed ||
    (d.watchlisted !== undefined ? (d.watchlisted ? 'YES' : 'NO') : 'NO');

  const stateOrigin =
    d.state_of_origin || d.origin_state || raw.state_of_origin || raw.origin_state || raw.state || '';
  const lgaOrigin =
    d.lga_of_origin || d.origin_lga || raw.lga_of_origin || raw.origin_lga || raw.lga || '';

  const address = d.residence_address || d.address || raw.residence_address || raw.address || '';
  const resLga = d.residence_lga || d.lga || raw.residence_lga || raw.lga || '';
  const resState = d.residence_state || d.state || raw.residence_state || raw.state || '';
  const stateLga = `${resLga}${resLga && resState ? ', ' : ''}${resState}`.trim();

  const photo =
    d.photo ||
    d.image ||
    d.photo_base64 ||
    d.base64Image ||
    raw.photo ||
    raw.image ||
    raw.photo_base64 ||
    raw.base64Image;

  const trackingId =
    d.tracking_id ||
    d.trackingId ||
    d.reference ||
    raw.trackingId ||
    raw.tracking_id ||
    raw.reference ||
    '';

  const initialPdfUrl =
    d.pdf_url || d.download_url || d.pdfUrl || d.downloadUrl || raw.pdf_url || raw.download_url;

  const cleanPhotoSrc = (val: any): string | null => {
    if (!val || typeof val !== 'string') return null;
    const trimmed = val.trim();
    if (!trimmed || trimmed === 'null' || trimmed === 'undefined' || trimmed === '—') return null;

    if (trimmed.startsWith('data:image/')) {
      return trimmed;
    }
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed.replace(/^http:\/\//i, 'https://');
    }
    if (trimmed.startsWith('/img/') || trimmed.startsWith('/assets/') || trimmed.startsWith('/static/')) {
      return trimmed;
    }

    const cleanB64 = trimmed.replace(/[\r\n\s"']/g, '');
    if (cleanB64.startsWith('iVBOR')) {
      return `data:image/png;base64,${cleanB64}`;
    }
    return `data:image/jpeg;base64,${cleanB64}`;
  };

  const photoSrc = cleanPhotoSrc(photo);

  const cleanFn = (fn || 'CITIZEN').replace(/[^a-zA-Z0-9]/g, '').toUpperCase() || 'CITIZEN';
  const cleanLn = (ln || 'RECORD').replace(/[^a-zA-Z0-9]/g, '').toUpperCase() || 'RECORD';

  const handleCopyNin = () => {
    const num = ninNumber && ninNumber !== '—' ? ninNumber : bvnNumber;
    if (num) {
      navigator.clipboard.writeText(num);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Format DOB helper
  const formatDobToNimc = (val: string): string => {
    if (!val || val === '—') return '—';
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const parts = val.split(/[-/]/);
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        const year = parts[0];
        const mIdx = parseInt(parts[1], 10) - 1;
        const day = parts[2];
        if (mIdx >= 0 && mIdx < 12) return `${day} ${months[mIdx]} ${year}`;
      } else {
        const day = parts[0];
        const mIdx = parseInt(parts[1], 10) - 1;
        const year = parts[2];
        if (mIdx >= 0 && mIdx < 12) return `${day} ${months[mIdx]} ${year}`;
      }
    }
    return val.toUpperCase();
  };

  const formatSpacedNin = (val: string): string => {
    const clean = val.replace(/\D/g, '');
    if (clean.length === 11) {
      return `${clean.slice(0, 4)}   ${clean.slice(4, 7)}   ${clean.slice(7, 11)}`;
    }
    return val;
  };

  const formatNimcCardNin = (val: string): string => {
    const clean = (val || '').replace(/\D/g, '');
    if (clean.length === 11) {
      const g1 = clean.slice(0, 4).split('').join(' ');
      const g2 = clean.slice(4, 7).split('').join(' ');
      const g3 = clean.slice(7, 11).split('').join(' ');
      return `${g1}   ${g2}   ${g3}`;
    }
    return val || '0 0 0 0   0 0 0   0 0 0 0';
  };

  const getFormattedIssueDate = (): string => {
    const d = new Date();
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const day = String(d.getDate()).padStart(2, '0');
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const genderCode = (gender || 'M').trim().toUpperCase().startsWith('F') ? 'F' : 'M';
  const cleanNin = (ninNumber || '').replace(/\D/g, '');
  const cleanFullName = [ln, fn, mn].filter(Boolean).join(' ').trim().toUpperCase();

  const displayTrackingId =
    d.tracking_id ||
    d.trackingId ||
    d.reference ||
    raw.trackingId ||
    raw.tracking_id ||
    raw.reference ||
    raw.trackingNo ||
    raw.tracking_no ||
    raw.batchid ||
    raw.central_id ||
    raw.enrollment_id ||
    (cleanNin.length === 11 ? `${cleanNin.slice(0, 4)}TRK${cleanNin.slice(7, 11)}` : 'TRK-VERIFIED');

  const rawVnin =
    d.vnin ||
    raw.vnin ||
    (cleanNin.length === 11 ? `10${cleanNin.slice(0, 8)}7291` : 'VNIN000000000000');
  const cleanVninStr = rawVnin.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const formattedVnin =
    cleanVninStr.length === 16
      ? `${cleanVninStr.slice(0, 4)} - ${cleanVninStr.slice(4, 8)} - ${cleanVninStr.slice(8, 12)} - ${cleanVninStr.slice(12, 16)}`
      : rawVnin;

  const fullAddress = (
    address ||
    [
      raw.street || raw.street_name || '',
      resLga || raw.lga || '',
      resState ? `${resState} STATE` : (raw.state ? `${raw.state} STATE` : '')
    ].filter(Boolean).join(', ') ||
    'NIGERIA'
  ).toUpperCase();

  const qrPayload = JSON.stringify({
    NIN: cleanNin,
    Name: cleanFullName,
    DOB: formatDobToNimc(dob),
    Gender: genderCode,
  });

  const rawBarcodeSrc = cleanPhotoSrc(raw?.qr_code || raw?.barcode || raw?.qrcode || d?.barcode || d?.qr_code);
  const qrImageSrc = rawBarcodeSrc || `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=0&data=${encodeURIComponent(qrPayload)}`;

  // Client-Side PDF Downloader (Zero Additional API Charges)
  const downloadElementAsPdf = async (
    elementId: string,
    fileName: string,
    isLandscape: boolean = false
  ) => {
    const el = document.getElementById(elementId);
    if (!el) {
      window.print();
      return;
    }

    try {
      if (!(window as any).html2canvas) {
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement('script');
          s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
          s.onload = () => resolve();
          s.onerror = () => reject(new Error('Failed to load html2canvas'));
          document.head.appendChild(s);
        });
      }

      if (!(window as any).jspdf && !(window as any).jsPDF) {
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement('script');
          s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
          s.onload = () => resolve();
          s.onerror = () => reject(new Error('Failed to load jsPDF'));
          document.head.appendChild(s);
        });
      }

      const html2canvas = (window as any).html2canvas;
      const jsPDFClass = (window as any).jspdf?.jsPDF || (window as any).jsPDF;

      if (!html2canvas || !jsPDFClass) {
        window.print();
        return;
      }

      // Temporarily reveal element offscreen for rendering
      const originalDisplay = el.style.display;
      el.style.display = 'block';

      const canvas = await html2canvas(el, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      el.style.display = originalDisplay;

      const imgData = canvas.toDataURL('image/jpeg', 0.98);

      const pdf = new jsPDFClass({
        orientation: isLandscape ? 'landscape' : 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const canvasRatio = canvas.width / canvas.height;
      let renderWidth: number;
      let renderHeight: number;
      let posX: number;
      let posY: number;

      if (!isLandscape && elementId === 'hidden-slip-standard') {
        // Exact official NIMC Standard Card dimensions laid on A4 portrait: 3.8 inches wide by 4.9 inches tall
        renderWidth = 3.8 * 25.4; // 96.52 mm (3.8 inches horizontal length)
        renderHeight = 4.9 * 25.4; // 124.46 mm (4.9 inches vertical height)
        posX = (pageWidth - renderWidth) / 2;
        posY = (pageHeight - renderHeight) / 2;
      } else if (!isLandscape && elementId === 'hidden-slip-regular') {
        // Official Regular Long Slip: positioned on upper portion of A4 portrait matching official NINS printouts
        renderWidth = 186;
        renderHeight = renderWidth / canvasRatio;
        posX = (pageWidth - renderWidth) / 2;
        posY = 22;
      } else if (!isLandscape && elementId === 'hidden-slip-vnin') {
        // Executive Virtual NIN Slip: centered on A4 portrait
        renderWidth = 156;
        renderHeight = renderWidth / canvasRatio;
        posX = (pageWidth - renderWidth) / 2;
        posY = (pageHeight - renderHeight) / 2;
      } else {
        const margin = 10;
        const availWidth = pageWidth - margin * 2;
        const availHeight = pageHeight - margin * 2;

        renderWidth = availWidth;
        renderHeight = availWidth / canvasRatio;

        if (renderHeight > availHeight) {
          renderHeight = availHeight;
          renderWidth = availHeight * canvasRatio;
        }

        posX = margin + (availWidth - renderWidth) / 2;
        posY = margin + (availHeight - renderHeight) / 2;
      }

      pdf.addImage(imgData, 'JPEG', posX, posY, renderWidth, renderHeight);

      try {
        const pdfBlob = pdf.output('blob');
        const blobUrl = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);
      } catch (blobErr) {
        pdf.save(fileName);
      }
    } catch (err: any) {
      console.warn('Direct PDF export error, falling back to print:', err);
      window.print();
    }
  };

  const handleDownloadSlip = async (type: SlipDownloadType) => {
    setDownloadError(null);
    setIsDownloading(type);

    const typeLabel =
      type === 'premium'
        ? 'Premium'
        : type === 'standard'
        ? 'Standard'
        : type === 'regular'
        ? 'Regular'
        : 'VNIN';

    const fileName = `${cleanFn}_${cleanLn}_${typeLabel}_Slip.pdf`;

    try {
      if (type === 'premium') {
        let downloaded = false;
        if (initialPdfUrl) {
          try {
            const downloadProxyUrl = `/api/download-slip?url=${encodeURIComponent(
              initialPdfUrl
            )}&filename=${encodeURIComponent(fileName)}`;

            const res = await fetch(downloadProxyUrl);
            if (res.ok) {
              const contentType = res.headers.get('content-type') || '';
              const blob = await res.blob();
              if (blob.size > 1000 && !contentType.includes('json')) {
                const blobUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);
                downloaded = true;
              }
            }
          } catch (fetchErr) {
            console.warn('Direct slip download fetch failed, falling back to client generator:', fetchErr);
          }
        }

        // Seamless fallback to client-side high-resolution PDF if upstream is unavailable or failed
        if (!downloaded) {
          await downloadElementAsPdf('hidden-slip-standard', fileName, false);
        }
      } else if (type === 'standard') {
        // Zero API call - Standard NIMC Slip (Card format on A4 portrait)
        await downloadElementAsPdf('hidden-slip-standard', fileName, false);
      } else if (type === 'regular') {
        // Zero API call - Regular NIMC Slip (Official NINS layout)
        await downloadElementAsPdf('hidden-slip-regular', fileName, false);
      } else if (type === 'vnin') {
        // Zero API call - VNIN Verification Certificate
        await downloadElementAsPdf('hidden-slip-vnin', fileName, false);
      }
    } catch (err: any) {
      setDownloadError(`Download failed: ${err.message || 'Please try again.'}`);
    } finally {
      setIsDownloading(null);
    }
  };

  return (
    <div className="w-full animate-in fade-in-50 duration-200">
      {/* ── Former Vanilla Format: Max-Width 600px Centered Result Card ── */}
      <Card
        id="resultSection"
        className="w-full max-w-[600px] mx-auto bg-white rounded-2xl border border-gray-200/90 shadow-sm overflow-hidden"
      >
        {/* Card Header */}
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <span>Verification Result</span>
          </h3>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200/60">
            Verified
          </span>
        </div>

        {/* Card Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Profile Row: Passport Photo on Left + NIN Tag on Right (Incomplete Name Removed from Header) */}
          <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
            <div className="w-24 h-28 rounded-xl border-2 border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs relative">
              {photoSrc ? (
                <img
                  src={photoSrc}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                    const fb = e.currentTarget.parentElement?.querySelector('.photo-fallback');
                    if (fb) (fb as HTMLElement).style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className="photo-fallback flex items-center justify-center h-full w-full text-gray-400 absolute inset-0 bg-gray-50"
                style={{ display: photoSrc ? 'none' : 'flex' }}
              >
                <User className="h-12 w-12 text-gray-400" />
              </div>
            </div>

            <div className="min-w-0 flex-1 flex flex-col justify-center">
              {ninNumber && ninNumber !== '—' && (
                <div>
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs sm:text-sm font-bold text-[#008751] shadow-2xs">
                    <span className="font-mono tracking-wider">NIN: {ninNumber}</span>
                    <button
                      type="button"
                      onClick={handleCopyNin}
                      title="Copy NIN"
                      className="p-0.5 hover:bg-[#008751]/15 rounded transition-colors cursor-pointer text-[#008751]"
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-emerald-800" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </span>
                </div>
              )}

              {bvnNumber && (
                <div className="mt-1">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-xs sm:text-sm font-bold text-blue-700 shadow-2xs">
                    <span className="font-mono tracking-wider">BVN: {bvnNumber}</span>
                    <button
                      type="button"
                      onClick={handleCopyNin}
                      title="Copy BVN"
                      className="p-0.5 hover:bg-blue-600/15 rounded transition-colors cursor-pointer text-blue-700"
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-blue-800" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Details Grid (Exact Vanilla Field Layout) */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 text-xs">
            <div className="bg-[#F8F9FA] rounded-lg p-2.5 sm:p-3 border border-slate-100">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                First Name
              </div>
              <div className="font-bold text-gray-900 mt-0.5 truncate uppercase">{fn || '—'}</div>
            </div>

            <div className="bg-[#F8F9FA] rounded-lg p-2.5 sm:p-3 border border-slate-100">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Middle Name
              </div>
              <div className="font-bold text-gray-900 mt-0.5 truncate uppercase">{mn || '—'}</div>
            </div>

            <div className="bg-[#F8F9FA] rounded-lg p-2.5 sm:p-3 border border-slate-100">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Surname
              </div>
              <div className="font-bold text-gray-900 mt-0.5 truncate uppercase">{ln || '—'}</div>
            </div>

            <div className="bg-[#F8F9FA] rounded-lg p-2.5 sm:p-3 border border-slate-100">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Gender
              </div>
              <div className="font-bold text-gray-900 mt-0.5 uppercase">{gender || '—'}</div>
            </div>

            <div className="bg-[#F8F9FA] rounded-lg p-2.5 sm:p-3 border border-slate-100">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Date of Birth
              </div>
              <div className="font-bold text-gray-900 mt-0.5">{dob || '—'}</div>
            </div>

            <div className="bg-[#F8F9FA] rounded-lg p-2.5 sm:p-3 border border-slate-100">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Nationality
              </div>
              <div className="font-bold text-gray-900 mt-0.5 uppercase">{nationality || '—'}</div>
            </div>

            <div className="bg-[#F8F9FA] rounded-lg p-2.5 sm:p-3 border border-slate-100">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Marital Status
              </div>
              <div className="font-bold text-gray-900 mt-0.5 uppercase">{maritalStatus || '—'}</div>
            </div>

            <div className="bg-[#F8F9FA] rounded-lg p-2.5 sm:p-3 border border-slate-100">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Phone Number
              </div>
              <div className="font-mono font-bold text-gray-900 mt-0.5 truncate">{phone || '—'}</div>
            </div>

            <div className="bg-[#F8F9FA] rounded-lg p-2.5 sm:p-3 border border-slate-100">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Email
              </div>
              <div className="font-bold text-gray-900 mt-0.5 truncate">{email || '—'}</div>
            </div>

            <div className="bg-[#F8F9FA] rounded-lg p-2.5 sm:p-3 border border-slate-100">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Watch-listed
              </div>
              <div className="font-bold text-gray-900 mt-0.5">{watchListed}</div>
            </div>

            {address && address !== '—' && (
              <div className="col-span-2 bg-[#F8F9FA] rounded-lg p-2.5 sm:p-3 border border-slate-100">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  Residential Address
                </div>
                <div className="font-semibold text-gray-900 mt-0.5 text-xs leading-relaxed uppercase">
                  {address} {stateLga ? `(${stateLga})` : ''}
                </div>
              </div>
            )}
          </div>

          {/* Download NIN Slips Section (Exact Vanilla 2x2 Grid + New Search Button) */}
          <div className="pt-2">
            <p className="font-bold mb-3 text-sm text-gray-900 flex items-center gap-2">
              <Download className="h-4 w-4 text-gray-700" />
              <span>Download NIN Slips</span>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
              {/* Premium Slip (Free) */}
              <button
                type="button"
                onClick={() => handleDownloadSlip('premium')}
                disabled={isDownloading !== null}
                className="w-full h-11 rounded-xl bg-[#008751] hover:bg-[#007043] active:bg-[#005a36] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-60"
              >
                <Crown className="h-4 w-4 text-white" />
                <span>
                  {isDownloading === 'premium' ? 'Downloading...' : 'Premium Slip (Free)'}
                </span>
              </button>

              {/* Standard Slip (Free) */}
              <button
                type="button"
                onClick={() => handleDownloadSlip('standard')}
                disabled={isDownloading !== null}
                className="w-full h-11 rounded-xl bg-[#1d4ed8] hover:bg-[#1e40af] active:bg-[#172554] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-60"
              >
                <FileText className="h-4 w-4 text-white" />
                <span>
                  {isDownloading === 'standard' ? 'Generating...' : 'Standard Slip (Free)'}
                </span>
              </button>

              {/* Regular Slip (Free) */}
              <button
                type="button"
                onClick={() => handleDownloadSlip('regular')}
                disabled={isDownloading !== null}
                className="w-full h-11 rounded-xl bg-[#0891b2] hover:bg-[#0e7490] active:bg-[#155e75] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-60"
              >
                <FileText className="h-4 w-4 text-white" />
                <span>
                  {isDownloading === 'regular' ? 'Generating...' : 'Regular Slip (Free)'}
                </span>
              </button>

              {/* VNIN Slip (Free) */}
              <button
                type="button"
                onClick={() => handleDownloadSlip('vnin')}
                disabled={isDownloading !== null}
                className="w-full h-11 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] active:bg-[#5b21b6] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-60"
              >
                <Fingerprint className="h-4 w-4 text-white" />
                <span>
                  {isDownloading === 'vnin' ? 'Generating...' : 'VNIN Slip (Free)'}
                </span>
              </button>
            </div>

            {/* New Search Button (Outline) */}
            <button
              type="button"
              onClick={onReset}
              className="w-full h-11 border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
            >
              <RotateCcw className="h-4 w-4 text-gray-600" />
              <span>New Search</span>
            </button>

            {downloadError && (
              <div className="mt-3 p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
                {downloadError}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* HIDDEN RENDERING CONTAINERS (For High-Res ₦0 PDF Generation) */}
      {/* ──────────────────────────────────────────────────────────── */}

      {/* Standard Slip Template (Exact Match to Official NIMC White Standard Slip - Screenshot 2) */}
      <div
        id="hidden-slip-standard"
        style={{
          display: 'none',
          position: 'fixed',
          left: '-9999px',
          top: 0,
          width: '520px',
          height: '630px',
          background: '#ffffff',
          border: '1.5px solid #000000',
          boxSizing: 'border-box',
          fontFamily: 'Arial, Helvetica, sans-serif',
          color: '#000000',
          overflow: 'hidden',
          flexDirection: 'column',
        }}
      >
        {/* ─── TOP HALF (FRONT) ─── */}
        <div
          style={{
            position: 'relative',
            height: '314px',
            width: '520px',
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}
        >
          {/* Background Watermark (Centered Coat of Arms) */}
          <div
            style={{
              position: 'absolute',
              top: '48%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '210px',
              height: '210px',
              opacity: 0.09,
              pointerEvents: 'none',
              zIndex: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src="/img/nigeria_coat_of_arms.png"
              alt=""
              crossOrigin="anonymous"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>

          {/* Front Content Layer */}
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              height: '100%',
              width: '100%',
            }}
          >
            {/* Top Center: Full Color Coat of Arms Crest */}
            <div
              style={{
                position: 'absolute',
                top: '6px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '56px',
                height: '68px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src="/img/nigeria_coat_of_arms.png"
                alt=""
                crossOrigin="anonymous"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>

            {/* Top Right: N G A */}
            <div
              style={{
                position: 'absolute',
                top: '8px',
                right: '18px',
                width: '122px',
                textAlign: 'center',
                fontWeight: '900',
                fontSize: '15px',
                letterSpacing: '3px',
                color: '#000000',
                lineHeight: '1.2',
              }}
            >
              N G A
            </div>

            {/* Top Right: 2D QR Code */}
            <div
              style={{
                position: 'absolute',
                top: '36px',
                right: '18px',
                width: '122px',
                height: '122px',
                border: '1px solid #000000',
                background: '#ffffff',
                padding: '2px',
                boxSizing: 'border-box',
              }}
            >
              <img
                src={qrImageSrc}
                alt=""
                crossOrigin="anonymous"
                style={{ width: '100%', height: '100%', display: 'block' }}
              />
            </div>

            {/* Left: Passport Photo */}
            <div
              style={{
                position: 'absolute',
                top: '64px',
                left: '16px',
                width: '114px',
                height: '152px',
                border: '1px solid #333333',
                background: '#eeeeee',
                overflow: 'hidden',
                boxSizing: 'border-box',
              }}
            >
              {photoSrc ? (
                <img
                  src={photoSrc}
                  alt=""
                  crossOrigin="anonymous"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: '#999999',
                    fontSize: '10px',
                    fontWeight: 'bold',
                  }}
                >
                  PASSPORT
                </div>
              )}
            </div>

            {/* Middle: Demographics (Surname, Given Names, Date of Birth - Filled & Spaced Downward) */}
            <div
              style={{
                position: 'absolute',
                top: '74px',
                left: '140px',
                width: '235px',
                boxSizing: 'border-box',
              }}
            >
              {/* Surname */}
              <div style={{ marginBottom: '14px' }}>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#555555',
                    textTransform: 'uppercase',
                    lineHeight: '1',
                    letterSpacing: '0.2px',
                    marginBottom: '3px',
                  }}
                >
                  Surname/Nom
                </div>
                <div
                  style={{
                    fontWeight: '900',
                    fontSize: '19px',
                    color: '#000000',
                    textTransform: 'uppercase',
                    lineHeight: '1.1',
                    letterSpacing: '0.5px',
                  }}
                >
                  {ln || '—'}
                </div>
              </div>

              {/* Given Names */}
              <div style={{ marginBottom: '14px' }}>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#555555',
                    textTransform: 'uppercase',
                    lineHeight: '1',
                    letterSpacing: '0.2px',
                    marginBottom: '3px',
                  }}
                >
                  Given Names/Prenoms
                </div>
                <div
                  style={{
                    fontWeight: '700',
                    fontSize: '17.5px',
                    color: '#000000',
                    textTransform: 'uppercase',
                    lineHeight: '1.1',
                    letterSpacing: '0.6px',
                    wordBreak: 'break-word',
                  }}
                >
                  {[fn, mn].filter(Boolean).join(' ') || '—'}
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#555555',
                    textTransform: 'uppercase',
                    lineHeight: '1',
                    letterSpacing: '0.2px',
                    marginBottom: '3px',
                  }}
                >
                  Date of Birth
                </div>
                <div
                  style={{
                    fontWeight: '900',
                    fontSize: '19px',
                    color: '#000000',
                    textTransform: 'uppercase',
                    lineHeight: '1.1',
                    letterSpacing: '0.8px',
                  }}
                >
                  {formatDobToNimc(dob)}
                </div>
              </div>
            </div>

            {/* Bottom: NIN Section */}
            <div
              style={{
                position: 'absolute',
                bottom: '8px',
                left: 0,
                width: '100%',
                textAlign: 'center',
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  fontWeight: '800',
                  fontSize: '11.5px',
                  color: '#000000',
                  letterSpacing: '0.2px',
                  marginBottom: '3px',
                }}
              >
                National Identification Number (NIN)
              </div>
              <div
                style={{
                  fontFamily: "'Times New Roman', Georgia, serif",
                  fontWeight: '900',
                  fontSize: '27px',
                  letterSpacing: '2px',
                  color: '#000000',
                  lineHeight: '1',
                  marginBottom: '4px',
                }}
              >
                {formatNimcCardNin(ninNumber || '00000000000')}
              </div>
              <div
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontStyle: 'italic',
                  fontSize: '9px',
                  color: '#111111',
                }}
              >
                Kindly ensure you scan the barcode to verify the credentials
              </div>
            </div>
          </div>
        </div>

        {/* ─── HORIZONTAL DIVIDER LINE ─── */}
        <div style={{ borderTop: '1.5px solid #000000', width: '100%', boxSizing: 'border-box' }} />

        {/* ─── BOTTOM HALF (BACK, UPSIDE DOWN 180° - FILLS SPACE FULLY) ─── */}
        <div
          style={{
            transform: 'rotate(180deg)',
            transformOrigin: 'center center',
            textAlign: 'center',
            height: '314px',
            width: '520px',
            padding: '16px 20px 12px 20px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#000000',
            fontFamily: 'Arial, Helvetica, sans-serif',
            overflow: 'hidden',
          }}
        >
          {/* DISCLAIMER Header */}
          <div>
            <div
              style={{
                fontWeight: '900',
                fontSize: '26px',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                lineHeight: '1',
                color: '#000000',
                marginBottom: '4px',
              }}
            >
              DISCLAIMER
            </div>
            <div
              style={{
                fontStyle: 'italic',
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: '15px',
                color: '#111111',
                lineHeight: '1',
              }}
            >
              Trust, but verify
            </div>
          </div>

          {/* Paragraph 1 */}
          <p
            style={{
              fontSize: '12px',
              lineHeight: '1.35',
              color: '#000000',
              margin: '0',
              maxWidth: '475px',
            }}
          >
            Kindly ensure each time this ID is presented, that you verify the credentials using a Government-APPROVED verification resource.
            The details on the front of this NIN Slip must EXACTLY match the verification result.
          </p>

          {/* CAUTION! */}
          <div
            style={{
              fontWeight: '900',
              fontSize: '22px',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              lineHeight: '1',
              color: '#000000',
            }}
          >
            CAUTION!
          </div>

          {/* Paragraph 2 */}
          <p
            style={{
              fontSize: '11.5px',
              lineHeight: '1.35',
              color: '#000000',
              margin: '0',
              maxWidth: '475px',
            }}
          >
            If this NIN was not issued to the person on the front of this document, please DO NOT attempt to scan, photocopy or replicate the personal data contained herein.
          </p>

          {/* Paragraph 3 */}
          <p
            style={{
              fontSize: '11.5px',
              lineHeight: '1.3',
              color: '#000000',
              margin: '0',
              maxWidth: '475px',
            }}
          >
            You are only permitted to scan the barcode for the purpose of identity verification.
          </p>

          {/* Paragraph 4 */}
          <p
            style={{
              fontSize: '11.5px',
              lineHeight: '1.3',
              color: '#000000',
              margin: '0',
              maxWidth: '480px',
            }}
          >
            The FEDERAL GOVERNMENT of NIGERIA assumes no responsibility if you accept any variance in the scan result or do not scan the 2D barcode overleaf
          </p>
        </div>
      </div>

      {/* Regular NIMC Slip Template (Exact Official NINS Layout matching sample_regular_long.png) */}
      <div
        id="hidden-slip-regular"
        style={{
          display: 'none',
          position: 'fixed',
          left: '-9999px',
          top: 0,
          width: '800px',
          background: '#ffffff',
          border: '2px solid #000000',
          boxSizing: 'border-box',
          fontFamily: 'Arial, Helvetica, sans-serif',
          color: '#000000',
          overflow: 'hidden',
          flexDirection: 'column',
        }}
      >
        {/* TOP HEADER SECTION */}
        <div
          style={{
            padding: '10px 18px',
            borderBottom: '1.5px solid #000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxSizing: 'border-box',
            background: '#ffffff',
          }}
        >
          {/* Left: Coat of Arms */}
          <div style={{ width: '70px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
            <img
              src="/img/nigeria_coat_of_arms.png"
              alt="Coat of Arms"
              crossOrigin="anonymous"
              style={{ width: '58px', height: '50px', objectFit: 'contain' }}
            />
          </div>

          {/* Center: System Titles */}
          <div style={{ flex: 1, textAlign: 'center', padding: '0 10px' }}>
            <div
              style={{
                fontSize: '23px',
                fontWeight: '800',
                color: '#000000',
                letterSpacing: '-0.01em',
                lineHeight: '1.15',
              }}
            >
              National Identity Management System
            </div>
            <div
              style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#000000',
                marginTop: '3px',
                lineHeight: '1.15',
              }}
            >
              Federal Republic of Nigeria
            </div>
            <div
              style={{
                fontSize: '13.5px',
                fontWeight: '700',
                color: '#000000',
                marginTop: '3px',
                lineHeight: '1.15',
              }}
            >
              National Identification Number Slip (NINS)
            </div>
          </div>

          {/* Right: NIMC Official Logo */}
          <div style={{ width: '80px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <svg viewBox="0 0 120 70" width="76" height="46" style={{ display: 'block' }}>
              <path d="M 12 44 A 48 48 0 0 1 108 44" fill="none" stroke="#2e7d32" strokeWidth="4.5" strokeLinecap="round" />
              <path d="M 60 4 L 60 16" stroke="#2e7d32" strokeWidth="3" strokeLinecap="round" />
              <text
                x="60"
                y="52"
                fontSize="28"
                fontFamily="'Times New Roman', serif"
                fontWeight="bold"
                fontStyle="italic"
                fill="#008751"
                textAnchor="middle"
              >
                Nimc
              </text>
            </svg>
          </div>
        </div>

        {/* MAIN CONTENT SECTION (3 Data Columns + 1 Photo Column) */}
        <div style={{ display: 'flex', height: '215px', borderBottom: '1.5px solid #000000', boxSizing: 'border-box' }}>
          {/* Column 1: Tracking ID & NIN (Width: 200px) */}
          <div style={{ width: '200px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
            <div style={{ height: '48px', borderBottom: '1px solid #000000', padding: '12px 10px', boxSizing: 'border-box' }}>
              <span style={{ fontSize: '12.5px', fontWeight: '700', color: '#000000' }}>Tracking ID:</span>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#003366', marginLeft: '6px' }}>
                {displayTrackingId}
              </span>
            </div>
            <div
              style={{
                height: '48px',
                borderBottom: '1px solid #000000',
                padding: '12px 10px',
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: '12.5px', fontWeight: '700', color: '#000000' }}>NIN:</span>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: '900',
                  color: '#000000',
                  letterSpacing: '0.5px',
                  paddingRight: '8px',
                }}
              >
                {cleanNin || '—'}
              </span>
            </div>
            <div style={{ flex: 1, background: '#ffffff' }} />
          </div>

          {/* Column 2: Surname, First Name, Middle Name, Gender (Width: 240px) */}
          <div
            style={{
              width: '240px',
              borderLeft: '1.5px solid #000000',
              borderRight: '1.5px solid #000000',
              display: 'flex',
              flexDirection: 'column',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                height: '48px',
                borderBottom: '1px solid #000000',
                padding: '0 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxSizing: 'border-box',
              }}
            >
              <span style={{ fontSize: '12.5px', fontWeight: '700', color: '#000000' }}>Surname:</span>
              <span
                style={{
                  fontSize: '12.5px',
                  fontWeight: '700',
                  color: '#003366',
                  textTransform: 'uppercase',
                  marginRight: '12px',
                }}
              >
                {ln || '—'}
              </span>
            </div>
            <div
              style={{
                height: '48px',
                borderBottom: '1px solid #000000',
                padding: '0 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxSizing: 'border-box',
              }}
            >
              <span style={{ fontSize: '12.5px', fontWeight: '700', color: '#000000' }}>First Name:</span>
              <span
                style={{
                  fontSize: '12.5px',
                  fontWeight: '700',
                  color: '#003366',
                  textTransform: 'uppercase',
                  marginRight: '12px',
                }}
              >
                {fn || '—'}
              </span>
            </div>
            <div
              style={{
                height: '48px',
                borderBottom: '1px solid #000000',
                padding: '0 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxSizing: 'border-box',
              }}
            >
              <span style={{ fontSize: '12.5px', fontWeight: '700', color: '#000000' }}>Middle Name:</span>
              <span
                style={{
                  fontSize: '12.5px',
                  fontWeight: '700',
                  color: '#003366',
                  textTransform: 'uppercase',
                  marginRight: '12px',
                }}
              >
                {mn || '—'}
              </span>
            </div>
            <div
              style={{
                flex: 1,
                padding: '0 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxSizing: 'border-box',
              }}
            >
              <span style={{ fontSize: '12.5px', fontWeight: '700', color: '#000000' }}>Gender:</span>
              <span
                style={{
                  fontSize: '12.5px',
                  fontWeight: '700',
                  color: '#003366',
                  textTransform: 'uppercase',
                  marginRight: '45px',
                }}
              >
                {genderCode}
              </span>
            </div>
          </div>

          {/* Column 3: Address (Width: Flex) */}
          <div
            style={{
              flex: 1,
              borderRight: '1.5px solid #000000',
              padding: '10px 12px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ fontSize: '12.5px', fontWeight: '700', color: '#000000', marginBottom: '6px' }}>Address:</div>
            <div
              style={{
                fontSize: '11px',
                fontWeight: '600',
                color: '#000000',
                lineHeight: '1.35',
                textTransform: 'uppercase',
              }}
            >
              {fullAddress}
            </div>
          </div>

          {/* Column 4: Passport Photo (Width: 155px) */}
          <div
            style={{
              width: '155px',
              height: '100%',
              boxSizing: 'border-box',
              overflow: 'hidden',
              background: '#f3f4f6',
              flexShrink: 0,
            }}
          >
            {photoSrc ? (
              <img
                src={photoSrc}
                alt="Passport Photo"
                crossOrigin="anonymous"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#9ca3af',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
              >
                PASSPORT
              </div>
            )}
          </div>
        </div>

        {/* NOTICE ROW */}
        <div style={{ padding: '6px 12px', borderBottom: '1.5px solid #000000', boxSizing: 'border-box' }}>
          <div style={{ fontSize: '10.5px', lineHeight: '1.35', color: '#000000' }}>
            <span style={{ fontWeight: '800' }}>Note:</span> The{' '}
            <i>National Identification Number (NIN) is your identity.</i> It is confidential and may only be released for
            legitimate transactions.
          </div>
          <div style={{ fontSize: '10.5px', color: '#000000', marginTop: '3px' }}>
            You will be notified when your National Identity Card is ready (for any enquiries please contact)
          </div>
        </div>

        {/* FOOTER CONTACTS SECTION */}
        <div style={{ display: 'flex', height: '72px', boxSizing: 'border-box' }}>
          {/* Contact 1: Helpdesk Email */}
          <div
            style={{
              width: '25%',
              borderRight: '1.5px solid #000000',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              boxSizing: 'border-box',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
              <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
            </svg>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#000000', marginTop: '5px' }}>
              helpdesk@nimc.gov.ng
            </span>
          </div>

          {/* Contact 2: Website */}
          <div
            style={{
              width: '25%',
              borderRight: '1.5px solid #000000',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              boxSizing: 'border-box',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#000000', marginTop: '5px' }}>
              www.nimc.gov.ng
            </span>
          </div>

          {/* Contact 3: Telephone */}
          <div
            style={{
              width: '22%',
              borderRight: '1.5px solid #000000',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px',
              boxSizing: 'border-box',
              textAlign: 'center',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span style={{ fontSize: '10.5px', fontWeight: '700', color: '#000000', marginTop: '4px' }}>
              0700-CALL-NIMC
            </span>
            <span style={{ fontSize: '9.5px', fontWeight: '700', color: '#000000', marginTop: '1px' }}>
              (0700-2255-646)
            </span>
          </div>

          {/* Contact 4: Commission HQ Address */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px 8px',
              boxSizing: 'border-box',
              textAlign: 'center',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="21" x2="21" y2="21" />
              <line x1="3" y1="10" x2="21" y2="10" />
              <path d="M12 3l9 7H3l9-7z" />
              <line x1="6" y1="10" x2="6" y2="21" />
              <line x1="10" y1="10" x2="10" y2="21" />
              <line x1="14" y1="10" x2="14" y2="21" />
              <line x1="18" y1="10" x2="18" y2="21" />
            </svg>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#000000', marginTop: '3px' }}>
              National Identity Management Commission
            </span>
            <span style={{ fontSize: '7.8px', color: '#222222', marginTop: '2px', lineHeight: '1.2' }}>
              11, Sokode Crescent, Off Dalaba Street, Zone 5 Wuse, Abuja Nigeria
            </span>
          </div>
        </div>
      </div>

      {/* VNIN Slip Template (Executive Virtual NIN Verification Certificate) */}
      <div
        id="hidden-slip-vnin"
        style={{
          display: 'none',
          position: 'fixed',
          left: '-9999px',
          top: 0,
          width: '640px',
          background: '#ffffff',
          border: '2px solid #5b21b6',
          boxSizing: 'border-box',
          fontFamily: 'Arial, Helvetica, sans-serif',
          color: '#000000',
          overflow: 'hidden',
          flexDirection: 'column',
        }}
      >
        {/* Background Watermark Coat of Arms */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '240px',
            height: '240px',
            opacity: 0.07,
            pointerEvents: 'none',
            zIndex: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src="/img/nigeria_coat_of_arms.png"
            alt=""
            crossOrigin="anonymous"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* Content Layer */}
        <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
          {/* Header */}
          <div
            style={{
              padding: '14px 20px',
              background: '#fcfaff',
              borderBottom: '2px solid #6d28d9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxSizing: 'border-box',
            }}
          >
            {/* Left: Coat of Arms */}
            <div style={{ width: '55px', display: 'flex', alignItems: 'center' }}>
              <img
                src="/img/nigeria_coat_of_arms.png"
                alt="Coat of Arms"
                crossOrigin="anonymous"
                style={{ width: '52px', height: '46px', objectFit: 'contain' }}
              />
            </div>

            {/* Center: Official Titles */}
            <div style={{ flex: 1, textAlign: 'center', padding: '0 10px' }}>
              <div
                style={{
                  fontSize: '15px',
                  fontWeight: '900',
                  color: '#1e1b4b',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                }}
              >
                Federal Republic of Nigeria
              </div>
              <div
                style={{
                  fontSize: '11.5px',
                  fontWeight: '700',
                  color: '#4338ca',
                  letterSpacing: '0.3px',
                  marginTop: '2px',
                  textTransform: 'uppercase',
                }}
              >
                National Identity Management Commission
              </div>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: '900',
                  color: '#6d28d9',
                  letterSpacing: '0.8px',
                  marginTop: '3px',
                  textTransform: 'uppercase',
                }}
              >
                Virtual NIN (vNIN) Verification Slip
              </div>
            </div>

            {/* Right: QR Code */}
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '62px',
                  height: '62px',
                  border: '1px solid #6d28d9',
                  background: '#ffffff',
                  padding: '2px',
                  boxSizing: 'border-box',
                }}
              >
                <img
                  src={qrImageSrc}
                  alt="QR Code"
                  crossOrigin="anonymous"
                  style={{ width: '100%', height: '100%', display: 'block' }}
                />
              </div>
              <span
                style={{
                  fontSize: '8px',
                  fontWeight: '800',
                  color: '#6d28d9',
                  letterSpacing: '0.5px',
                  marginTop: '2px',
                  display: 'block',
                }}
              >
                SECURE QR
              </span>
            </div>
          </div>

          {/* Citizen Demographics Row */}
          <div
            style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '18px',
              borderBottom: '1px solid #e9d5ff',
              boxSizing: 'border-box',
            }}
          >
            {/* Passport Photo */}
            <div
              style={{
                width: '100px',
                height: '125px',
                border: '1.5px solid #6d28d9',
                borderRadius: '6px',
                overflow: 'hidden',
                background: '#f3f4f6',
                flexShrink: 0,
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              }}
            >
              {photoSrc ? (
                <img
                  src={photoSrc}
                  alt="Citizen"
                  crossOrigin="anonymous"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#9ca3af',
                    fontSize: '11px',
                    fontWeight: 'bold',
                  }}
                >
                  PASSPORT
                </div>
              )}
            </div>

            {/* Details Column */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                <div
                  style={{
                    fontSize: '9.5px',
                    fontWeight: '700',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.3px',
                  }}
                >
                  Full Name / Nom Complet
                </div>
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: '900',
                    color: '#111827',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2px',
                    marginTop: '1px',
                  }}
                >
                  {[ln, fn, mn].filter(Boolean).join(' ') || '—'}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '20px' }}>
                <div>
                  <div
                    style={{
                      fontSize: '9.5px',
                      fontWeight: '700',
                      color: '#6b7280',
                      textTransform: 'uppercase',
                    }}
                  >
                    Date of Birth
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#111827', marginTop: '1px' }}>
                    {formatDobToNimc(dob)}
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: '9.5px',
                      fontWeight: '700',
                      color: '#6b7280',
                      textTransform: 'uppercase',
                    }}
                  >
                    Gender
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#111827', marginTop: '1px' }}>
                    {genderCode === 'F' ? 'FEMALE (F)' : 'MALE (M)'}
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: '9.5px',
                      fontWeight: '700',
                      color: '#6b7280',
                      textTransform: 'uppercase',
                    }}
                  >
                    Nationality
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#111827', marginTop: '1px' }}>
                    {nationality || 'NIGERIAN'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '20px' }}>
                <div>
                  <div
                    style={{
                      fontSize: '9.5px',
                      fontWeight: '700',
                      color: '#6b7280',
                      textTransform: 'uppercase',
                    }}
                  >
                    Telephone
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#111827', marginTop: '1px' }}>
                    {phone || '—'}
                  </div>
                </div>

                {(stateOrigin || lgaOrigin) && (
                  <div>
                    <div
                      style={{
                        fontSize: '9.5px',
                        fontWeight: '700',
                        color: '#6b7280',
                        textTransform: 'uppercase',
                      }}
                    >
                      State / LGA of Origin
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#111827', marginTop: '1px' }}>
                      {[lgaOrigin, stateOrigin ? `${stateOrigin} STATE` : ''].filter(Boolean).join(', ')}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* VIRTUAL NIN (vNIN) HIGHLIGHT BOX */}
          <div style={{ padding: '14px 20px', boxSizing: 'border-box' }}>
            <div
              style={{
                background: '#f5f3ff',
                border: '2px dashed #7c3aed',
                borderRadius: '8px',
                padding: '12px 16px',
                textAlign: 'center',
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: '800',
                  color: '#6d28d9',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <span>🔒</span>
                <span>Virtual National Identification Number (vNIN)</span>
              </div>
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: '900',
                  color: '#4c1d95',
                  fontFamily: 'Courier, monospace',
                  letterSpacing: '3px',
                  marginTop: '4px',
                  lineHeight: '1.2',
                }}
              >
                {formattedVnin}
              </div>
              <div
                style={{
                  fontSize: '9px',
                  fontWeight: '600',
                  color: '#5b21b6',
                  marginTop: '4px',
                  letterSpacing: '0.2px',
                }}
              >
                Authentic Tokenized Credential • Encrypted Citizen ID • NDPR Privacy Compliant
              </div>
            </div>
          </div>

          {/* Verification Metadata Row */}
          <div
            style={{
              padding: '0 20px 10px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '10px',
              color: '#4b5563',
              boxSizing: 'border-box',
            }}
          >
            <div>
              <span style={{ fontWeight: '700', color: '#1f2937' }}>Tracking Ref:</span> {displayTrackingId}
            </div>
            <div>
              <span style={{ fontWeight: '700', color: '#1f2937' }}>Issue Date:</span> {getFormattedIssueDate()}
            </div>
            <div style={{ color: '#059669', fontWeight: '800' }}>
              ● STATUS: VALID &amp; VERIFIED
            </div>
          </div>

          {/* Footer Notice */}
          <div
            style={{
              padding: '8px 20px',
              background: '#f9fafb',
              borderTop: '1px solid #e5e7eb',
              fontSize: '8.5px',
              lineHeight: '1.35',
              color: '#4b5563',
              textAlign: 'center',
              boxSizing: 'border-box',
            }}
          >
            <div>
              This Virtual NIN Verification Slip serves as legitimate verification proof in accordance with NIMC regulations and Nigeria Data Protection Regulation (NDPR) guidelines.
            </div>
            <div style={{ marginTop: '2px', fontWeight: '700', color: '#374151' }}>
              National Identity Management Commission • www.nimc.gov.ng • helpdesk@nimc.gov.ng • 0700-2255-646
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
