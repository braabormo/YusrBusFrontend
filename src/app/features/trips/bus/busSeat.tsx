import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import type { SeatProps } from "./busTypes";
import BusOccupiedContextMenu from "./busOccupiedContextMenu";
import useBus from "./useBus";
import BusButton from "./busButton";

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
  onCheckInUpdate,
}: SeatProps) {
  const isOccupied = !!ticket;
  const isCheckedIn = ticket?.checkedIn;
  const {
    authState,
    handleContextMenuAction,
    handlePrintTicket,
    handleShareTicket,
    handleSendByWhatsappTicket,
    handleSendByEmailTicket,
  } = useBus({
    ticket,
    isOccupied,
    onCheckInUpdate: onCheckInUpdate,
  });
  return (
    <ContextMenu dir="rtl">
      <ContextMenuTrigger asChild>
        <BusButton
          seat={seat}
          ticket={ticket}
          handleContextMenuAction={handleContextMenuAction}
          highlighted={highlighted}
          isCheckedIn={isCheckedIn}
          isOccupied={isOccupied}
          onClick={onClick}
          isDimmed={isDimmed}
          isMoveTarget={isMoveTarget}
          onHoverData={onHoverData}
        />
      </ContextMenuTrigger>

      {/* Context Menu (Unchanged logic, just keeping structure) */}
      {isOccupied && (
        <BusOccupiedContextMenu
          authState={authState}
          handleContextMenuAction={handleContextMenuAction}
          handlePrintTicket={handlePrintTicket}
          handleSendByEmailTicket={handleSendByEmailTicket}
          handleSendByWhatsappTicket={handleSendByWhatsappTicket}
          handleShareTicket={handleShareTicket}
          ticket={ticket}
          onDeleteTicket={onDeleteTicket}
          onMoveTicket={onMoveTicket}
        />
      )}
    </ContextMenu>
  );
}
