import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
export function SideBarMainMenu(
  { items }: { items: { title: string; url: string; icon?: React.ReactNode; hasAuth: boolean; }[]; }
)
{
  return (
    <SidebarGroup className="mt-5">
      <SidebarGroupContent>
        <SidebarMenu>
          { items.map((item) =>
            item.hasAuth && (
              <SidebarMenuItem key={ item.title }>
                <SidebarMenuButton asChild tooltip={ item.title }>
                  <Link to={ item.url } className="flex items-center justify-start gap-3 w-full px-3">
                    <span className="flex items-center justify-center shrink-0 size-4">{ item.icon }</span>

                    <span className="font-medium truncate">{ item.title }</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          ) }
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
