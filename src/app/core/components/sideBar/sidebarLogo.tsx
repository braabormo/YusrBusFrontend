import { useSidebar } from "@/components/ui/sidebar";

import logoFullDark from "@/assets/yusrBusLogoRTL_Dark.png";
import logoFullLight from "@/assets/yusrBusLogoRTL_Light.png";
import logoOnlyDark from "@/assets/yusrLogoOnly_Dark.png";
import logoOnlyLight from "@/assets/yusrLogoOnly_Light.png";

export default function SidebarLogo()
{
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <div
      className={ `
        animate-fadeSlide transition-all duration-300 pb-3
        ${isCollapsed ? "w-8" : "w-35 px-2"} 
    ` }
    >
      <img
        src={ isCollapsed ? logoOnlyLight : logoFullLight }
        alt="Yusr Logo"
        className="block dark:hidden transition-all duration-300 h-auto object-contain w-full"
      />

      <img
        src={ isCollapsed ? logoOnlyDark : logoFullDark }
        alt="Yusr Logo"
        className="hidden dark:block transition-all duration-300 h-auto object-contain w-full"
      />
    </div>
  );
}
