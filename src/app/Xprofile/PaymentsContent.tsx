import { Clock } from "lucide-react";
import { useTranslations } from "next-intl";

export default function PaymentsContent() {
  const t = useTranslations("profile.paymentsContent");
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center">{t("title")}</h1>
      <div className="p-4 sm:p-8 text-center text-gray-500">
        <Clock className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 text-gray-400" />
        <p>{t("placeholder")}</p>
        <h4 className="text-base sm:text-lg"><strong>Ushbu funksiya tez orada ishga tushadi</strong></h4>
      </div>
    </div>
  );
}