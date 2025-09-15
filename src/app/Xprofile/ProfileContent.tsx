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

export default function ProfileContent({ userData }: { userData: UserData | null }) {
  if (!userData) return null;
  return <ProfileForm userData={userData} isVerified={true} />;
}