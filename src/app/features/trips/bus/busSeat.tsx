import { SystemPermissions } from "@/app/core/auth/systemPermissions";
import { SystemPermissionsActions } from "@/app/core/auth/systemPermissionsActions";
import { SystemPermissionsResources } from "@/app/core/auth/systemPermissionsResources";
import WhatsappService from "@/app/core/chat/whatsappService";
import TicketReportApiService from "@/app/core/networking/services/reports/ticketReportApiService";
import { useAppSelector } from "@/app/core/state/hooks";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";
import { CheckCircle2, Mail, MoveHorizontal, Printer, Share2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { SeatProps } from "./busTypes";

export default function BusSeat({
  seat,
  ticket,
  onClick,
  highlighted,
  isDimmed,
  isMoveTarget,
  onCheckInUpdate,
  onDeleteTicket,
  onMoveTicket,
  onHoverData,
}: SeatProps) {
  const isOccupied = !!ticket;
  const isCheckedIn = ticket?.checkedIn;
  const authState = useAppSelector((state) => state.auth);

  const handleContextMenuAction = (e: React.MouseEvent) => {
    if (!isOccupied) e.preventDefault();
  };

  const handlePrintTicket = async (checkIn: boolean) => {
    if (ticket?.id == undefined) {
      toast.error("لم يتم حفظ التغييرات بعد");
      return;
    }

    const result = await TicketReportApiService.getReport(ticket.id, checkIn);

    if (result && checkIn) {
      onCheckInUpdate?.(ticket?.id);
      toast.success("تم التحضير والطباعة بنجاح");
    }
  };

  const handleShareTicket = async (checkIn: boolean) => {
    if (ticket?.id == undefined) {
      toast.error("لم يتم حفظ التغييرات بعد");
      return;
    }

    await TicketReportApiService.getReport(
      ticket.id,
      checkIn,
      "share",
      `ticket_${ticket.id}`
    );
    
    if (checkIn) {
        onCheckInUpdate?.(ticket?.id);
    }
  };

  const handleSendByWhatsappTicket = async () => {

    if (!ticket?.id || !ticket?.accessKey) {
      toast.error("لم يتم حفظ التغييرات بعد أو بيانات التذكرة غير مكتملة");
      return;
    }
    if (!ticket?.passenger?.phoneNumber) {
      toast.error("المسافر ليس لديه رقم جوال مسجل");
      return;
    }

    try 
    {
      const loadingToast = toast.loading("جاري تجهيز رابط التذكرة...");
      const last4 = ticket.passenger.phoneNumber.slice(-4);
      const response = await TicketReportApiService.addToStorage(ticket.accessKey, last4);

      if (response.status === 200) {
        toast.success("تم تجهيز الرابط بنجاح، جاري فتح واتساب...", { id: loadingToast });
        const shortUrl = `${window.location.origin}/t/${ticket.accessKey}`;
        const header = `تأكيد حجز - ${authState.setting?.companyName}`;
        const body = 
            `عزيزي المسافر، تم تأكيد حجزك بنجاح.\n` +
            `رقم التذكرة: ${ticket.id}\n` +
            `يمكنك تحميل التذكرة من الرابط التالي:\n\n${shortUrl}`;
        const footer = `شكراً لاختياركم ${authState.setting?.companyName}، رحلة سعيدة!`;

        WhatsappService.SendMessage(header, body, footer, ticket.passenger.phoneNumber);

        toast.dismiss(loadingToast);
      } 
      else {
        toast.error("فشل في تجهيز الرابط، يرجى المحاولة مرة أخرى");
      }
    } 
    catch (error) {
      toast.error("حدث خطأ أثناء الاتصال بالسيرفر");
    }
  };

  const handleSendByEmailTicket = async () => {

    if (!ticket?.id || !ticket?.accessKey) {
      toast.error("لم يتم حفظ التغييرات بعد أو بيانات التذكرة غير مكتملة");
      return;
    }
    if (!ticket?.passenger?.phoneNumber) {
      toast.error("المسافر ليس لديه رقم جوال مسجل");
      return;
    }
    if (!ticket?.passenger?.email) {
      toast.error("المسافر ليس لديه بريد إلكتروني مسجل");
      return;
    }

    const loadingToast = toast.loading("جاري إرسال التذكرة إلى البريد الإلكتروني...");

    try {
      const last4 = ticket.passenger.phoneNumber.slice(-4);
      const response = await TicketReportApiService.sendByEmail(ticket.accessKey, last4);

      if (response.status === 200) {
        toast.success(response.data?.title || "تم إرسال التذكرة بنجاح!", { 
            id: loadingToast,
            description: `تم إرسال ملف PDF إلى ${ticket.passenger.email}` 
        });
        toast.dismiss(loadingToast);
      } 
      else {
        toast.dismiss(loadingToast);
      }
    } 
    catch (error) {
      console.error("Email Error:", error);
      toast.error("حدث خطأ غير متوقع أثناء محاولة الإرسال", { id: loadingToast });
    }
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
              "animate-pulse ring-2 ring-dashed ring-emerald-500 rounded-lg scale-105 bg-emerald-50/50"
          )}
        >
          {/* Checked-in Badge Icon */}
          {isCheckedIn && (
            <div className="absolute -top-2 -right-2 z-20 bg-white rounded-full shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-blue-600 fill-blue-100" />
            </div>
          )}

          {/* Headrest */}
          <div
            className={cn(
              "z-10 h-1.5 w-8 rounded-t-md transition-colors duration-300",
              highlighted
                ? "bg-yellow-500"
                : isCheckedIn
                ? "bg-blue-600"
                : isOccupied
                ? "bg-red-700"
                : "bg-emerald-700"
            )}
          />

          {/* Seat Body */}
          <div
            className={cn(
              "flex w-full flex-1 flex-col overflow-hidden rounded-lg border shadow-sm transition-colors duration-300",
              isMoveTarget
                ? "border-emerald-500 bg-emerald-100/40"
                : highlighted
                ? "border-yellow-500 bg-yellow-100/50"
                : isCheckedIn
                ? "border-blue-500 bg-blue-100/50"
                : isOccupied
                ? "border-red-500 bg-red-300/30"
                : "border-emerald-500 bg-background/30"
            )}
          >
            {/* Header (Seat No & Price) */}
            <div
              className={cn(
                "flex justify-between px-1 py-px text-[9px] font-bold text-white transition-colors duration-300",
                highlighted
                  ? "bg-yellow-600"
                  : isCheckedIn
                  ? "bg-blue-600"
                  : isOccupied
                  ? "bg-red-600"
                  : "bg-emerald-600"
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

            {/* Content */}
            {isOccupied ? (
              <div className="flex flex-col gap-px px-1 py-0.5 text-[8px] text-right leading-tight">
                <p className="truncate font-bold">{ticket.passenger?.name}</p>
                <p
                  className="truncate opacity-80"
                  onMouseEnter={() =>
                    onHoverData?.(
                      "nationality",
                      ticket.passenger?.nationality?.name
                    )
                  }
                  onMouseLeave={() => onHoverData?.(null)}
                >
                  {ticket.passenger?.nationality?.name}
                </p>
                <div 
                    className={cn(
                        "mt-px border-t pt-px text-[8px] font-semibold",
                        isCheckedIn ? "border-blue-200" : "border-red-200"
                    )}
                >
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
                      : "text-emerald-500"
                  )}
                >
                  {isMoveTarget ? "هنا؟" : "متاح"}
                </span>
              </div>
            )}
          </div>

          {/* Armrests */}
          <div
            className={cn(
              "absolute top-6 -left-0.5 h-5 w-1 rounded-full",
              isCheckedIn 
                ? "bg-blue-300" 
                : isOccupied 
                    ? "bg-red-300" 
                    : "bg-slate-300"
            )}
          />
          <div
            className={cn(
              "absolute top-6 -right-0.5 h-5 w-1 rounded-full",
              isCheckedIn 
                ? "bg-blue-300" 
                : isOccupied 
                    ? "bg-red-300" 
                    : "bg-slate-300"
            )}
          />
        </button>
      </ContextMenuTrigger>

      {/* Context Menu (Unchanged logic, just keeping structure) */}
      {isOccupied && (
        <ContextMenuContent className="w-52">
          <ContextMenuItem
            onClick={() => onMoveTicket?.(ticket)}
            className="gap-2"
          >
            <MoveHorizontal className="h-4 w-4" />
            <span className="flex-1">نقل المقعد</span>
          </ContextMenuItem>

          <ContextMenuSeparator />
          
          <ContextMenuGroup>
            {SystemPermissions.hasAuth(authState.loggedInUser?.role?.permissions ?? [], SystemPermissionsResources.TicketReport, SystemPermissionsActions.Get) && (
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
            {SystemPermissions.hasAuth(authState.loggedInUser?.role?.permissions ?? [], SystemPermissionsResources.TicketReport, SystemPermissionsActions.Get) && (
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
                  <span className="flex-1 font-semibold">تحضير ومشاركة التذكرة</span>
                </ContextMenuItem>
              </>
            )}
          </ContextMenuGroup>

          <ContextMenuSeparator />

          <ContextMenuGroup>
            {SystemPermissions.hasAuth(authState.loggedInUser?.role?.permissions ?? [], SystemPermissionsResources.TicketReport, SystemPermissionsActions.Get) && (
              <>
                <ContextMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSendByWhatsappTicket();
                  }}
                  className="gap-2"
                >
                  <i className="bi bi-whatsapp h-4 w-4"></i>
                  <span className="flex-1 font-semibold">إرسال التذكرة عبر واتساب</span>
                </ContextMenuItem>

                <ContextMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSendByEmailTicket();
                  }}
                  className="gap-2"
                >
                  <Mail className="h-4 w-4" />
                  <span className="flex-1 font-semibold">إرسال التذكرة عبر الإيميل</span>
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
      )}
    </ContextMenu>
  );
}