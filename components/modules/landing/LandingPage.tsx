'use client';

import * as React from 'react';
import { LandingNavbar } from './LandingNavbar';
import { HeroSection } from './HeroSection';
import { ServicesSection } from './ServicesSection';
import { AboutSection } from './AboutSection';
import { PricingSection } from './PricingSection';
import { ContactSection } from './ContactSection';
import { LandingFooter } from './LandingFooter';

export function LandingPage() {
  const [activeSection, setActiveSection] = React.useState('home');

  React.useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'services', 'about', 'pricing', 'contact'];
      const scrollPos = window.scrollY + 160;

      for (const sectionId of sections) {
        const el = document.getElementById(
          sectionId === 'home' ? 'home-section' : `${sectionId}-section`
        );
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const target =
      sectionId === 'home'
        ? document.getElementById('home-section')
        : document.getElementById(`${sectionId}-section`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <LandingNavbar activeSection={activeSection} onNavigate={handleNavigate} />
      <main className="flex-1">
        <HeroSection />
        <ServicesSection />
        <AboutSection />
        <PricingSection />
        <ContactSection />
      </main>
      <LandingFooter />
    </div>
  );
}
