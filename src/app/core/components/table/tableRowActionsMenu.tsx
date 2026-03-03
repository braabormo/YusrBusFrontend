import { Button } from "@/components/ui/button";
import {
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import useUserPermissions from "../../hooks/useUserPermissions";
import { SystemPermissionsResources } from "../../auth/systemPermissionsResources";

type ListType = "dropdown" | "context";

interface Props {
  onEditClicked: () => void;
  onDeleteClicked: () => void;
  type: ListType;
}

export default function TableRowActionsMenu({
  onEditClicked,
  onDeleteClicked,
  type,
}: Props) {
  const { updatePermission, deletePermission } = useUserPermissions(
    SystemPermissionsResources.Branches,
  );
  return (
    <>
      {type === "dropdown" && (
        <DropdownMenu dir="rtl">
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
            <DropdownMenuSeparator></DropdownMenuSeparator>
            {updatePermission && (
              <DropdownMenuItem onSelect={onEditClicked}>
                تعديل
              </DropdownMenuItem>
            )}
            {deletePermission && (
              <DropdownMenuItem
                className="text-destructive"
                onSelect={onDeleteClicked}
              >
                حذف
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {type === "context" && (
        <ContextMenuContent>
          <ContextMenuGroup>
            <ContextMenuLabel>الإجراءات</ContextMenuLabel>
            <ContextMenuSeparator></ContextMenuSeparator>
            {updatePermission && (
              <ContextMenuItem onSelect={onEditClicked}>تعديل</ContextMenuItem>
            )}
            {deletePermission && (
              <ContextMenuItem
                className="text-destructive"
                onSelect={onDeleteClicked}
              >
                حذف
              </ContextMenuItem>
            )}
          </ContextMenuGroup>
        </ContextMenuContent>
      )}
    </>
  );
}
