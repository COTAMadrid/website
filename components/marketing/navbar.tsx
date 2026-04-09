'use client';

import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Sobre Cota', href: '/sobre-cota' },
  { label: 'Cómo trabajamos', href: '/#como-funciona' },
  { label: 'Casos', href: '/#escenarios' },
  { label: 'Agenda', href: '/#agenda' },
];

/**
 * Premium glassmorphism navbar that reveals on scroll.
 * Transparent over the hero, frosted glass after scrolling past 5vh.
 */
export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 80);
  });

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[oklch(0.14_0.018_168/0.85)] backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_4px_30px_-8px_oklch(0_0_0/0.4)]'
            : 'bg-transparent'
        }`}
      >
        {/* Logo overlay — absolute so it doesn't push the nav row height.
            Free to grow much bigger than the menu line. */}
        <Link
          href="/"
          aria-label="Cota Madrid"
          className="group absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-10 pointer-events-auto"
        >
          <span
            aria-hidden
            className="block h-28 w-80 md:h-48 md:w-[34rem] bg-foreground transition-colors group-hover:bg-accent"
            style={{
              WebkitMaskImage: 'url(/images/cota/logo-cota.svg)',
              maskImage: 'url(/images/cota/logo-cota.svg)',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskPosition: 'left center',
              maskPosition: 'left center',
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
            }}
          />
        </Link>

        <div className="mx-auto max-w-7xl flex items-center justify-end px-6 py-3">
          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-foreground/55 hover:text-accent transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/diagnostico"
              className="inline-flex items-center gap-2 rounded-full bg-accent/10 border border-accent/25 px-4 py-2 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-accent hover:bg-accent/20 hover:border-accent/40 transition-all duration-300"
            >
              Diagnóstico gratis
              <ArrowRight className="size-3" strokeWidth={1.5} />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            className="md:hidden p-2 text-foreground/70 hover:text-foreground transition-colors"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        <motion.div
          initial={false}
          animate={mobileOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="md:hidden overflow-hidden bg-[oklch(0.14_0.018_168/0.98)] backdrop-blur-2xl border-t border-white/[0.06]"
        >
          <div className="px-6 py-4 space-y-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block font-mono text-[0.72rem] uppercase tracking-[0.2em] text-foreground/70 hover:text-accent transition-colors py-2"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/diagnostico"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-accent-foreground mt-2"
            >
              Diagnóstico gratis
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </motion.div>
      </motion.nav>
    </>
  );
}
