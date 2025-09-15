// import { cn } from "@/lib/utils";
// import { useTranslations } from "next-intl";

// import { BarChart3, Clock, LogOut, Settings, User } from "lucide-react";
// import { CartIcon } from "../../../public/img/header/CartIcon";

// interface SidebarItem {
//   id: string;
//   icon: React.ComponentType<{ className?: string }>;
// }

// const sidebarItems: SidebarItem[] = [
//   { id: "profile", icon: User },
//   { id: "workshop", icon: CartIcon },
//   { id: "products", icon: CartIcon },
//   { id: "payments", icon: Clock },
//   { id: "statistics", icon: BarChart3 },
//   { id: "orders", icon: Settings },
//   { id: "logout", icon: LogOut },
// ];

// interface SidebarProps {
//   activeTab: string;
//   setActiveTab: (tab: string) => void;
// }

// export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
//   const t = useTranslations("profile");

//   return (
//     <div className="border rounded-lg h-fit bg-white overflow-hidden">
//       <nav className="flex flex-col">
//         {sidebarItems.map((item) => (
//           <button
//             key={item.id}
//             onClick={() => setActiveTab(item.id)}
//             className={cn(
//               "flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-red-50",
//               activeTab === item.id ? "bg-red-50 text-red-800" : "text-gray-700"
//             )}
//           >
//             <item.icon className="h-5 w-5" />
//             <span>{t(`sidebar.${item.id}`)}</span>
//           </button>
//         ))}
//       </nav>
//     </div>
//   );
// }

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { User,  BarChart3, Settings, LogOut, Clock } from "lucide-react";
import { CartIcon } from "../../../public/img/header/CartIcon";

interface SidebarItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
}

const sidebarItems: SidebarItem[] = [
  { id: "profile", icon: User },
  { id: "workshop", icon: CartIcon },
  { id: "products", icon: CartIcon },
  { id: "payments", icon: Clock },
  { id: "statistics", icon: BarChart3 },
  { id: "orders", icon: Settings },
  { id: "logout", icon: LogOut },
];

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const t = useTranslations("profile");

  return (
    <div className="border rounded-lg h-fit bg-white overflow-hidden w-full lg:w-auto">
      <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-red-50 flex-shrink-0",
              activeTab === item.id ? "bg-red-50 text-red-800" : "text-gray-700"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="whitespace-nowrap">{t(`sidebar.${item.id}`)}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}