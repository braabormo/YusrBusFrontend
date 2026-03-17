import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { Building2Icon, BusFrontIcon, LayoutDashboardIcon, MapPinnedIcon, SettingsIcon, ShieldCheck, UserCogIcon, UsersIcon } from "lucide-react";
import * as React from "react";
import ApplicationLang from "../../services/langService/applicationLang";
import SidebarLogo from "./sidebarLogo";

import { SystemPermissions } from "../../auth/systemPermissions";
import { SystemPermissionsActions } from "../../auth/systemPermissionsActions";
import { SystemPermissionsResources } from "../../auth/systemPermissionsResources";
import { useAppSelector } from "../../state/hooks";
import { SideBarCompanyData } from "./sideBarCompanyData";
import { SideBarMainMenu } from "./sideBarMainMenu";
import { SideBarSecondaryMenu } from "./sideBarSecondaryMenu";
import { SideBarUserData } from "./sideBarUserData";

const appLang = ApplicationLang.getAppLangText();
const appLangSections = appLang.sections;

export function SideBar({ ...props }: React.ComponentProps<typeof Sidebar>)
{
  const authState = useAppSelector((state) => state.auth);
  const permissions: string[] = authState.loggedInUser?.role?.permissions || [];

  const data = {
    navMain: [{
      title: appLangSections.dashboard,
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
      hasAuth: SystemPermissions.hasAuth(
        permissions,
        SystemPermissionsResources.Dashboard,
        SystemPermissionsActions.Get
      )
    }, {
      title: appLangSections.trips,
      url: "/trips",
      icon: <BusFrontIcon />,
      hasAuth: SystemPermissions.hasAuth(permissions, SystemPermissionsResources.Trips, SystemPermissionsActions.Get)
    }, {
      title: appLangSections.passengers,
      url: "/passengers",
      icon: <UsersIcon />,
      hasAuth: SystemPermissions.hasAuth(
        permissions,
        SystemPermissionsResources.Passengers,
        SystemPermissionsActions.Get
      )
    }, {
      title: appLangSections.routes,
      url: "/routes",
      icon: <MapPinnedIcon />,
      hasAuth: SystemPermissions.hasAuth(permissions, SystemPermissionsResources.Routes, SystemPermissionsActions.Get)
    }, {
      title: appLangSections.branches,
      url: "/branches",
      icon: <Building2Icon />,
      hasAuth: SystemPermissions.hasAuth(permissions, SystemPermissionsResources.Branches, SystemPermissionsActions.Get)
    }, {
      title: appLangSections.users,
      url: "/users",
      icon: <UserCogIcon />,
      hasAuth: SystemPermissions.hasAuth(permissions, SystemPermissionsResources.Users, SystemPermissionsActions.Get)
    }, {
      title: appLangSections.roles,
      url: "/roles",
      icon: <ShieldCheck />,
      hasAuth: SystemPermissions.hasAuth(permissions, SystemPermissionsResources.Roles, SystemPermissionsActions.Get)
    }],
    navSecondary: [{ title: appLangSections.settings, url: "/settings", icon: <SettingsIcon /> }]
  };

  const displayCompany = {
    name: authState.setting?.companyName || "Default Name",
    logo: authState.setting?.logo?.url || "/default-avatar.jpg"
  };

  return (
    <Sidebar collapsible="icon" side="right" { ...props }>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarLogo />

            <SideBarCompanyData company={ displayCompany } />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SideBarMainMenu items={ data.navMain } />
        <SideBarSecondaryMenu items={ data.navSecondary } className="pt-10 mt-auto text-center" />
      </SidebarContent>
      <SidebarFooter>
        <SideBarUserData user={ authState.loggedInUser } />
      </SidebarFooter>
    </Sidebar>
  );
}
