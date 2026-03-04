import { SystemPermissions } from "@/app/core/auth/systemPermissions";
import { SystemPermissionsActions } from "@/app/core/auth/systemPermissionsActions";
import { SystemPermissionsResources } from "@/app/core/auth/systemPermissionsResources";
import { useLoggedInUser } from "@/app/core/contexts/loggedInUserContext";
import TicketReportApiService from "@/app/core/networking/services/reports/ticketReportApiService";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";
import { MoveHorizontal, Printer, Share2, Trash2 } from "lucide-react";
import type { SeatProps } from "./busTypes";

export default function BusSeat({
  seat,
  ticket,
  onClick,
  highlighted,
  isDimmed,
  isMoveTarget,
  onDeleteTicket,
  onMoveTicket,
  onHoverData,
}: SeatProps) {
  const isOccupied = !!ticket;

  const {loggedInUser} = useLoggedInUser();

  const handleContextMenuAction = (e: React.MouseEvent) => {
    if (!isOccupied) e.preventDefault();
  };

  const handlePrintTicket = async (ticketId: number) => {
    const currentUserId = loggedInUser?.id; 
    await TicketReportApiService.getReport(ticketId, currentUserId ?? 0);
  };

  const handleShareTicket = async (ticketId: number) => {
    const currentUserId = loggedInUser?.id;
    await TicketReportApiService.getReport(ticketId, currentUserId ?? 0, "share", `ticket_${ticketId}`);
  };

  return (
    <ContextMenu dir="rtl">
      <ContextMenuTrigger asChild>
        <button
          dir="rtl"
          type="button"
          onClick={() => onClick(seat)}
          onContextMenu={handleContextMenuAction}
          className={cn(
            "group relative flex h-22 w-18 flex-col items-center transition-all duration-300 ease-in-out outline-none",
            isDimmed
              ? "opacity-30 grayscale-[0.5] scale-95"
              : "hover:scale-105 active:scale-95",
            highlighted &&
              "scale-110 z-50 ring-2 ring-yellow-400 ring-offset-2 rounded-lg",
            isMoveTarget &&
              "animate-pulse ring-2 ring-dashed ring-emerald-500 rounded-lg scale-105 bg-emerald-50/50",
          )}
        >
          {/* مسند الرأس */}
          <div
            className={cn(
              "z-10 h-1.5 w-8 rounded-t-md transition-colors duration-300",
              highlighted
                ? "bg-yellow-500"
                : isOccupied
                  ? "bg-red-700"
                  : "bg-emerald-700",
            )}
          />

          {/* جسم الكرسي */}
          <div
            className={cn(
              "flex w-full flex-1 flex-col overflow-hidden rounded-lg border shadow-sm transition-colors duration-300",
              isMoveTarget
                ? "border-emerald-500 bg-emerald-100/40"
                : highlighted
                  ? "border-yellow-500 bg-yellow-100/50"
                  : isOccupied
                    ? "border-red-500 bg-red-300/30"
                    : "border-emerald-500 bg-background/30",
            )}
          >
            {/* العنوان */}
            <div
              className={cn(
                "flex justify-between px-1 py-px text-[9px] font-bold text-white transition-colors duration-300",
                highlighted
                  ? "bg-yellow-600"
                  : isOccupied
                    ? "bg-red-600"
                    : "bg-emerald-600",
              )}
            >
              <span>
                {seat.id < 0 ? "طفل" : "مقعد"} {Math.abs(seat.id)}
              </span>
              <span
                onMouseEnter={() =>
                  onHoverData?.("amount", ticket?.amount.toString())
                }
                onMouseLeave={() => onHoverData?.(null)}
              >
                ${ticket?.amount ?? "0"}
              </span>
            </div>

            {/* المحتوى */}
            {isOccupied ? (
              <div className="flex flex-col gap-px px-1 py-0.5 text-[8px] text-right leading-tight">
                <p className="truncate font-bold">{ticket.passenger?.name}</p>
                <p
                  className="truncate opacity-80"
                  onMouseEnter={() =>
                    onHoverData?.(
                      "nationality",
                      ticket.passenger?.nationality?.name,
                    )
                  }
                  onMouseLeave={() => onHoverData?.(null)}
                >
                  {ticket.passenger?.nationality?.name}
                </p>
                <div className="mt-px border-t border-red-200 pt-px text-[8px] font-semibold">
                  <span
                    className="block truncate"
                    onMouseEnter={() =>
                      onHoverData?.("from", ticket.fromCityName)
                    }
                    onMouseLeave={() => onHoverData?.(null)}
                  >
                    {ticket.fromCityName}
                  </span>
                  <span className="block text-center text-[7px] opacity-40">
                    إلى
                  </span>
                  <span
                    className="block truncate"
                    onMouseEnter={() => onHoverData?.("to", ticket.toCityName)}
                    onMouseLeave={() => onHoverData?.(null)}
                  >
                    {ticket.toCityName}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center">
                <span
                  className={cn(
                    "text-[8px] font-bold",
                    isMoveTarget
                      ? "text-emerald-700 animate-bounce"
                      : "text-emerald-500",
                  )}
                >
                  {isMoveTarget ? "هنا؟" : "متاح"}
                </span>
              </div>
            )}
          </div>

          {/* مساند اليد */}
          <div
            className={cn(
              "absolute top-6 -left-0.5 h-5 w-1 rounded-full",
              isOccupied ? "bg-red-300" : "bg-slate-300",
            )}
          />
          <div
            className={cn(
              "absolute top-6 -right-0.5 h-5 w-1 rounded-full",
              isOccupied ? "bg-red-300" : "bg-slate-300",
            )}
          />
        </button>
      </ContextMenuTrigger>

      {isOccupied && (
        <ContextMenuContent className="w-52">
          {/* Action Group */}
          <ContextMenuGroup>
            <ContextMenuItem
              onClick={() => onMoveTicket?.(ticket)}
              className="gap-2"
            >
              <MoveHorizontal className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1">نقل المقعد</span>
            </ContextMenuItem>

            {SystemPermissions.hasAuth(loggedInUser?.role?.permissions ?? [], SystemPermissionsResources.TicketReport, SystemPermissionsActions.Get) && (
              <>
                <ContextMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    if (ticket?.id) 
                      handlePrintTicket(ticket.id);
                  }}
                  className="gap-2"
                >
                  <Printer className="h-4 w-4 text-muted-foreground" />
                  <span className="flex-1">طباعة التذكرة</span>
                </ContextMenuItem>

                <ContextMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    if (ticket?.id) handleShareTicket(ticket.id);
                  }}
                  className="gap-2"
                >
                  <Share2 className="h-4 w-4 text-muted-foreground" />
                  <span className="flex-1">مشاركة التذكرة</span>
                </ContextMenuItem>
              </>
            )}
          </ContextMenuGroup>

          <ContextMenuSeparator />

          {/* Destructive Group */}
          <ContextMenuItem
            onClick={(e) => {
              e.stopPropagation();
              if (ticket?.id && onDeleteTicket) onDeleteTicket(ticket.id);
            }}
            className="gap-2 text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            <span className="flex-1">حذف التذكرة</span>
          </ContextMenuItem>
        </ContextMenuContent>
      )}
    </ContextMenu>
  );
}
