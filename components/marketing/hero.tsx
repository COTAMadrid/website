'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { COPY } from '@/content/copy';

export function Hero() {
  const router = useRouter();
  const [value, setValue] = useState('');

  const submit = () => {
    if (value.trim()) sessionStorage.setItem('cota-hero-input', value.trim());
    router.push('/diagnostico');
  };

  return (
    <section className="relative min-h-[90vh] flex items-center px-6">
      <div className="mx-auto max-w-4xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-4xl md:text-6xl lg:text-7xl leading-tight"
        >
          {COPY.hero.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
          className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          {COPY.hero.subtitle}
        </motion.p>
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="mt-12 flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto"
        >
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={COPY.hero.inputPlaceholder}
            className="h-14 text-base"
          />
          <Button type="submit" size="lg" className="h-14 px-8">
            {COPY.hero.inputCta}
          </Button>
        </motion.form>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-4 text-sm text-muted-foreground"
        >
          {COPY.hero.microcopy}
        </motion.p>
      </div>
    </section>
  );
}
