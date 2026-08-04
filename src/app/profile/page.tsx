import { redirect } from 'next/navigation';

// /profile — id siz kirilganda o'z kabinetiga yo'naltiradi.
// /profile/[id] — bu boshqa foydalanuvchining ochiq profili, /Xprofile esa o'zimizniki.
export default function ProfileIndexPage() {
  redirect('/Xprofile');
}
