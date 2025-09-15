import { useTranslations } from "next-intl";
import { Settings } from "lucide-react";

export default function OrdersContent() {
  const t = useTranslations("profile.ordersContent");
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center">{t("title")}</h1>
      <div className="p-8 text-center text-gray-500">
        <Settings className="h-16 w-16 mx-auto mb-4 text-gray-400" />
        <p>{t("placeholder")}</p>
        <h4><strong>Ushbu funksiya tez orada ishga tushadi</strong></h4>
      </div>
    </div>
  );
}
