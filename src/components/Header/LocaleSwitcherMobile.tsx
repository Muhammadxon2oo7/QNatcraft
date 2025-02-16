'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { setUserLocale } from '@/services/locale';
import { Locale } from '@/i18n/config';
import { Button } from '@/components/ui/button';

export default function LocaleSwitcherMobile() {
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  function onChange(value: string) {
    const newLocale = value as Locale;
    startTransition(() => {
      setUserLocale(newLocale);
    });
  }

  const languages = [
    { code: 'en', label: 'En' },
    { code: 'uz', label: 'Uz' },
    { code: 'qr', label: 'Qr' },
    { code: 'ru', label: 'Ru' },
  ];

  return (
    <div className="flex justify-center gap-4 mb-4">
      {languages.map(({ code, label }) => (
        <Button
          key={code}
          variant="outline"
          size="sm"
          className={`w-20 ${locale === code ? 'bg-primary text-white border-primary' : 'border-primary text-primary'} ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => onChange(code)}
          disabled={isPending}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
