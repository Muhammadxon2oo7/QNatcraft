import { useTranslations } from "next-intl";
import Link from "next/link";
import ProfileForm from "./ProfileForm";

interface UserData {
  email: string;
  profile: {
    id: number | string;
    user_email: string;
    user_first_name: string;
    phone_number?: string | null;
    address?: string | null;
    profile_image?: string | null;
    experience?: number | null;
    mentees?: number | null;
    profession?: number | null;
    bio?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    award?: string | null;
    created_at?: string;
    updated_at?: string;
    user?: number | string;
    is_verified: boolean;
  };
  user_id: number | string;
}

export default function ProfileContentSimple({ userData }: { userData: UserData }) {
  const t = useTranslations("profile.profileContent");

  return (
    <div className="max-w-[1380px] px-[10px] mx-auto py-8">
      <nav className="flex items-center text-sm text-muted-foreground h-[56px] mb-[70px]">
        <Link href="/" className="hover:text-primary">
          {t("breadcrumbs.home")}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{t("breadcrumbs.profile")}</span>
      </nav>
      <ProfileForm userData={userData} isVerified={false} />
    </div>
  );
}
