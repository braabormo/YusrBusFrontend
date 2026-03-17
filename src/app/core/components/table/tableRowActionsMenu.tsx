import { Button } from "@/components/ui/button";
import { ContextMenuContent, ContextMenuGroup, ContextMenuItem, ContextMenuLabel, ContextMenuSeparator } from "@/components/ui/context-menu";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { selectPermissionsByResource } from "../../auth/authSelectors";
import { useAppSelector } from "../../state/hooks";

type ListType = "dropdown" | "context";

interface Props
{
  onEditClicked: () => void;
  onDeleteClicked: () => void;
  type: ListType;
  permissionsResource: string;
}

export default function TableRowActionsMenu({ onEditClicked, onDeleteClicked, type, permissionsResource }: Props)
{
  const perm = useAppSelector((state) => selectPermissionsByResource(state, permissionsResource));

  return (
    <>
      { type === "dropdown" && (
        <DropdownMenu dir="rtl">
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
            <DropdownMenuSeparator></DropdownMenuSeparator>
            { perm.updatePermission && <DropdownMenuItem onSelect={ onEditClicked }>تعديل</DropdownMenuItem> }
            { perm.deletePermission && (
              <DropdownMenuItem className="text-destructive" onSelect={ onDeleteClicked }>حذف</DropdownMenuItem>
            ) }
          </DropdownMenuContent>
        </DropdownMenu>
      ) }

      { type === "context" && (
        <ContextMenuContent>
          <ContextMenuGroup>
            <ContextMenuLabel>الإجراءات</ContextMenuLabel>
            <ContextMenuSeparator></ContextMenuSeparator>
            { perm.updatePermission && <ContextMenuItem onSelect={ onEditClicked }>تعديل</ContextMenuItem> }
            { perm.deletePermission && (
              <ContextMenuItem className="text-destructive" onSelect={ onDeleteClicked }>حذف</ContextMenuItem>
            ) }
          </ContextMenuGroup>
        </ContextMenuContent>
      ) }
    </>
  );
}
