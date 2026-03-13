import { SystemPermissions } from "@/app/core/auth/systemPermissions";
import { SystemPermissionsActions } from "@/app/core/auth/systemPermissionsActions";
import { SystemPermissionsResources } from "@/app/core/auth/systemPermissionsResources";
import {
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { MoveHorizontal, Printer, Share2, Mail, Trash2 } from "lucide-react";
import type { Ticket } from "../data/ticket";
import type { AuthState } from "@/app/core/auth/authSlice";

export interface BusOccupiedContextMenuProps {
  authState: AuthState;
  ticket: Ticket;
  onMoveTicket?: (ticket: Ticket) => void;
  handleSendByWhatsappTicket: () => Promise<void>;
  handleSendByEmailTicket: () => Promise<void>;
  handlePrintTicket: (checkIn: boolean) => Promise<void>;
  handleContextMenuAction: (e: React.MouseEvent<Element, MouseEvent>) => void;
  handleShareTicket: (checkIn: boolean) => Promise<void>;
  onDeleteTicket?: (ticketId: number) => void;
}
export default function BusOccupiedContextMenu({
  authState,
  ticket,
  onMoveTicket,
  handleSendByWhatsappTicket,
  handleSendByEmailTicket,
  handlePrintTicket,
  handleShareTicket,
  onDeleteTicket,
}: BusOccupiedContextMenuProps) {
  return (
    <ContextMenuContent className="w-52">
      <ContextMenuItem onClick={() => onMoveTicket?.(ticket)} className="gap-2">
        <MoveHorizontal className="h-4 w-4" />
        <span className="flex-1">نقل المقعد</span>
      </ContextMenuItem>

      <ContextMenuSeparator />

      <ContextMenuGroup>
        {SystemPermissions.hasAuth(
          authState.loggedInUser?.role?.permissions ?? [],
          SystemPermissionsResources.TicketReport,
          SystemPermissionsActions.Get,
        ) && (
          <>
            <ContextMenuItem
              onClick={(e) => {
                e.stopPropagation();
                handlePrintTicket(false);
              }}
              className="gap-2"
            >
              <Printer className="h-4 w-4" />
              <span className="flex-1">طباعة التذكرة</span>
            </ContextMenuItem>

            <ContextMenuItem
              onClick={(e) => {
                e.stopPropagation();
                handleShareTicket(false);
              }}
              className="gap-2"
            >
              <Share2 className="h-4 w-4" />
              <span className="flex-1">مشاركة التذكرة</span>
            </ContextMenuItem>
          </>
        )}
      </ContextMenuGroup>

      <ContextMenuSeparator />

      <ContextMenuGroup>
        {SystemPermissions.hasAuth(
          authState.loggedInUser?.role?.permissions ?? [],
          SystemPermissionsResources.TicketReport,
          SystemPermissionsActions.Get,
        ) && (
          <>
            <ContextMenuItem
              onClick={(e) => {
                e.stopPropagation();
                handlePrintTicket(true);
              }}
              className="gap-2"
            >
              <Printer className="h-4 w-4" />
              <span className="flex-1 font-semibold">تحضير وطباعة التذكرة</span>
            </ContextMenuItem>

            <ContextMenuItem
              onClick={(e) => {
                e.stopPropagation();
                handleShareTicket(true);
              }}
              className="gap-2"
            >
              <Share2 className="h-4 w-4" />
              <span className="flex-1 font-semibold">
                تحضير ومشاركة التذكرة
              </span>
            </ContextMenuItem>
          </>
        )}
      </ContextMenuGroup>

      <ContextMenuSeparator />

      <ContextMenuGroup>
        {SystemPermissions.hasAuth(
          authState.loggedInUser?.role?.permissions ?? [],
          SystemPermissionsResources.TicketReport,
          SystemPermissionsActions.Get,
        ) && (
          <>
            <ContextMenuItem
              onClick={(e) => {
                e.stopPropagation();
                handleSendByWhatsappTicket();
              }}
              className="gap-2"
            >
              <i className="bi bi-whatsapp h-4 w-4"></i>
              <span className="flex-1 font-semibold">
                إرسال التذكرة عبر واتساب
              </span>
            </ContextMenuItem>

            <ContextMenuItem
              onClick={(e) => {
                e.stopPropagation();
                handleSendByEmailTicket();
              }}
              className="gap-2"
            >
              <Mail className="h-4 w-4" />
              <span className="flex-1 font-semibold">
                إرسال التذكرة عبر الإيميل
              </span>
            </ContextMenuItem>
          </>
        )}
      </ContextMenuGroup>

      <ContextMenuSeparator />

      <ContextMenuItem
        onClick={(e) => {
          e.stopPropagation();
          if (ticket?.id && onDeleteTicket) onDeleteTicket(ticket.id);
        }}
        className="gap-2 text-destructive"
      >
        <Trash2 className="h-4 w-4" />
        <span className="flex-1">حذف التذكرة</span>
      </ContextMenuItem>
    </ContextMenuContent>
  );
}
