// 'use client';

// import {useLocale, useTranslations} from 'next-intl';
// import {useTransition} from 'react';
// import {setUserLocale} from '@/services/locale';
// import {Locale} from '@/i18n/config';
// import {Select, SelectTrigger, SelectValue, SelectContent, SelectItem} from "@/components/ui/select";

// export default function LocaleSwitcher() {
//   const t = useTranslations('LocaleSwitcher');
//   const locale = useLocale();
//   const [isPending, startTransition] = useTransition();

//   function onChange(value: string) {
//     const newLocale = value as Locale;
//     startTransition(() => {
//       setUserLocale(newLocale);
//     });
//   }

//   return (
//     <Select defaultValue={locale} onValueChange={onChange} disabled={isPending} >
//       <SelectTrigger language className="responsive-btn">
//         <SelectValue placeholder={t('label') || 'Theme'} />
//       </SelectTrigger>
//       <SelectContent className="absolute block index">
//       <SelectItem className="cursor-pointer" value="qr">QQ</SelectItem>
//         <SelectItem className="cursor-pointer" value="uz">UZ</SelectItem>
//         <SelectItem className="cursor-pointer" value="en">EN</SelectItem>
//         <SelectItem className="cursor-pointer" value="ru">RU</SelectItem>
//       </SelectContent>
//     </Select>
//   );
// }

'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { setUserLocale } from '@/services/locale';
import { Locale } from '@/i18n/config';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

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
      <SelectTrigger className="w-[80px] h-[40px] rounded-[16px] bg-[#f6f6f6] border-none focus:ring-0">
        <SelectValue placeholder={t('label') || 'Language'} />
      </SelectTrigger>
      <SelectContent className="bg-white shadow-md rounded-[8px] z-[1000]">
        <SelectItem className="cursor-pointer hover:bg-muted" value="qr">
          QQ
        </SelectItem>
        <SelectItem className="cursor-pointer hover:bg-muted" value="uz">
          UZ
        </SelectItem>
        <SelectItem className="cursor-pointer hover:bg-muted" value="en">
          EN
        </SelectItem>
        <SelectItem className="cursor-pointer hover:bg-muted" value="ru">
          RU
        </SelectItem>
      </SelectContent>
    </Select>
  );
}