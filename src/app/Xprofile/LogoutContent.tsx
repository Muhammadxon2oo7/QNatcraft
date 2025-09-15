import { LogOut } from "lucide-react";
import { useTranslations } from "next-intl";

interface LogoutContentProps {
  onLogout: () => void;
}

export default function LogoutContent({ onLogout }: LogoutContentProps) {
  const t = useTranslations("profile.logoutContent");
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center">{t("title")}</h1>
      <div className="p-4 sm:p-8 text-center text-gray-500">
        <LogOut className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 text-gray-400" />
        <p>{t("prompt")}</p>
        <button
          onClick={onLogout}
          className="mt-4 bg-red-800 text-white px-6 py-2 rounded-md hover:bg-red-900 transition-colors"
        >
          {t("confirm")}
        </button>
      </div>
    </div>
  );
}