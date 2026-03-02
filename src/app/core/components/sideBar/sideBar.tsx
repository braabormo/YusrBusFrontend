import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Building2Icon,
  BusFrontIcon,
  LayoutDashboardIcon,
  MapPinnedIcon,
  Settings2Icon,
  UserCogIcon,
  UsersIcon,
} from "lucide-react";
import * as React from "react";
import { useLoggedInUser } from "../../contexts/loggedInUserContext";
import { useSetting } from "../../contexts/settingContext";
import ApplicationLang from "../../services/langService/applicationLang";
import SidebarLogo from "./sidebarLogo";

import { SideBarCompanyData } from "./sideBarCompanyData";
import { SideBarMainMenu } from "./sideBarMainMenu";
import { SideBarSecondaryMenu } from "./sideBarSecondaryMenu";
import { SideBarUserData } from "./sideBarUserData";

const appLang = ApplicationLang.getAppLangText();
const appLangSections = appLang.sections;
const data = {
  navMain: [
    {
      title: appLangSections.dashboard,
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: appLangSections.trips,
      url: "/trips",
      icon: <BusFrontIcon />,
    },
    {
      title: appLangSections.passengers,
      url: "/passengers",
      icon: <UsersIcon />,
    },
    {
      title: appLangSections.routes,
      url: "/routes",
      icon: <MapPinnedIcon />,
    },
    {
      title: appLangSections.branches,
      url: "/branches",
      icon: <Building2Icon />,
    },
    {
      title: appLangSections.users,
      url: "/users",
      icon: <UserCogIcon />,
    },
    {
      title: appLangSections.roles,
      url: "/roles",
      icon: <Settings2Icon />,
    },
  ],
  navSecondary: [
    {
      title: appLangSections.settings,
      url: "/settings",
      icon: <Settings2Icon />,
    },
  ],
};

export function SideBar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { setting } = useSetting();
  const { loggedInUser } = useLoggedInUser();

  const displayCompany = {
    name: setting?.companyName || "Default Name",
    logo: setting?.logo?.url || "/default-avatar.jpg",
  };

  return (
    <Sidebar collapsible="icon" side="right" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarLogo />

            <SideBarCompanyData company={displayCompany} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SideBarMainMenu items={data.navMain} />
        <SideBarSecondaryMenu
          items={data.navSecondary}
          className="pt-10 mt-auto text-center"
        />
      </SidebarContent>
      <SidebarFooter>
        <SideBarUserData user={loggedInUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
