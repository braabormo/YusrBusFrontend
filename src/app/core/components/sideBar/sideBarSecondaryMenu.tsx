"use client"

import * as React from "react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LogOutIcon } from "lucide-react"
import { Link } from "react-router-dom"
import { useAuth } from "../../auth/authContext"
import ApiConstants from "../../networking/apiConstants"
import YusrApiHelper from "../../networking/yusrApiHelper"
import ApplicationLang from "../../services/langService/applicationLang"
import UserBranchesSelect from "../select/userBranchesSelect"
import { ThemeToggle } from "../theme/themeToggle"

export function SideBarSecondaryMenu({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: React.ReactNode
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {

  const sideBarUserDataLang = ApplicationLang.getAppLangText().sideBarUserData;
  const { logout } = useAuth();
  
  const LogoutHandler = async () => {
    const result = await YusrApiHelper.Post(`${ApiConstants.baseUrl}/Logout`);

    if (result.status === 200 || result.status === 204) {
      logout();
    }
  };

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link to={item.url} className="flex items-center justify-start gap-3 w-full px-3">

                  <span className="flex items-center justify-center shrink-0 size-4">
                    {item.icon}
                  </span>
                  
                  <span className="font-medium truncate">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}

          <SidebarMenuItem>
              <UserBranchesSelect/>
          </SidebarMenuItem>

          <SidebarMenuItem>
              <ThemeToggle variant="sidebar"/>
          </SidebarMenuItem>

          <SidebarMenuItem key="logout">
              <SidebarMenuButton asChild onClick={LogoutHandler}>
                <div className="flex items-center justify-start gap-3 w-full px-3 text-destructive">
                  <span className="flex items-center justify-center shrink-0 size-4">
                    <LogOutIcon />
                  </span>
                  <span className="font-medium truncate">{sideBarUserDataLang.logout}</span>
                </div>
              </SidebarMenuButton>
          </SidebarMenuItem>

        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
