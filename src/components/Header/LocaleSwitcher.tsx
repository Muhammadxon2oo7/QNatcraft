'use client';

import {useLocale, useTranslations} from 'next-intl';
import {useTransition} from 'react';
import {setUserLocale} from '@/services/locale';
import {Locale} from '@/i18n/config';
import {Select, SelectTrigger, SelectValue, SelectContent, SelectItem} from "@/components/ui/select";

export default function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher');
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  function onChange(value: string) {
    const newLocale = value as Locale;
    startTransition(() => {
      setUserLocale(newLocale);
    });
  }

  return (
    <Select defaultValue={locale} onValueChange={onChange} disabled={isPending}>
      <SelectTrigger className="w-[117px] h-[52px]">
        <SelectValue placeholder={t('label') || 'Theme'} />
      </SelectTrigger>
      <SelectContent className="absolute block index">
      <SelectItem className="cursor-pointer" value="qr">Qr</SelectItem>
        <SelectItem className="cursor-pointer" value="uz">Uz</SelectItem>
        <SelectItem className="cursor-pointer" value="en">En</SelectItem>
        <SelectItem className="cursor-pointer" value="ru">Ru</SelectItem>
      </SelectContent>
    </Select>
  );
}
