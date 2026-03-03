import SaveButton from "@/app/core/components/buttons/saveButton";
import type { CummonChangeDialogProps } from "@/app/core/components/dialogs/cummonChangeDialogProps";
import Loading from "@/app/core/components/loading/loading";
import useEntities from "@/app/core/hooks/useEntities";
import { useFormValidation, type ValidationRule } from "@/app/core/hooks/useFormValidation";
import { useTripForm } from "@/app/core/hooks/useTripForm";
import PassengersApiService from "@/app/core/networking/services/passengersApiService";
import TripsApiService from "@/app/core/networking/services/tripsApiService";
import { Validators } from "@/app/core/utils/validators";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import type { Passenger } from "../../passengers/data/passenger";
import ChangePassengerDialog from "../../passengers/presentation/changePassengerDialog";
import Bus from "../bus/bus";
import type { SeatType } from "../bus/busTypes";
import { Deposit } from "../data/deposit";
import { Ticket } from "../data/ticket";
import type { Trip } from "../data/trip";
import TripAmountSummary from "./TripAmountSummary";
import ChangeDepositDialog from "./changeDepositDialog";
import ChangeTicketDialog from "./changeTicketDialog";
import TripDeposits from "./tripDeposits";
import TripHeader from "./tripHeader";
import TicketReportApiService from "@/app/core/networking/services/reports/TicketReportApiService";
import { useLoggedInUser } from "@/app/core/contexts/loggedInUserContext";

export default function ChangeTripDialog({
  entity,
  mode,
  onSuccess,
}: CummonChangeDialogProps<Trip>) {
  const {
    formData,
    setFormData,
    movingTicket,
    setMovingTicket,
    updateTicketChair,
    initLoading,
  } = useTripForm(entity, mode);

  // Modal States
  const [selectedTicket, setSelectedTicket] = useState<Ticket | undefined>(
    undefined,
  );
  const [selectedDeposit, setSelectedDeposit] = useState<Deposit | undefined>(
    undefined,
  );
  const {loggedInUser} = useLoggedInUser();
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false);
  const [selectedPassenger, setSelectedPassenger] = useState<
    Passenger | undefined
  >(undefined);
  const [isEditPassengerDialogOpen, setIsEditPassengerDialogOpen] =
    useState(false);
  const [isChangeDepositDialogOpen, setIsChangeDepositDialogOpen] =
    useState(false);

  const handlePrintTicket = async (ticketId: number) => {
    const currentUserId = loggedInUser?.id; 
    await TicketReportApiService.getTicketReport(ticketId, currentUserId ?? 0);
  };

  // APIs
  const {
    entities: passengers,
    refreash: refreshPassengers,
    filter: filterPassengers,
    isLoading: fetchingPassengers,
  } = useEntities<Passenger>(new PassengersApiService());

  const validationRules: ValidationRule<Partial<Trip>>[] = [
    {
      field: "mainCaptainName",
      selector: (d) => d.mainCaptainName,
      validators: [Validators.required("يرجى إدخال اسم قائد الحافلة")],
    },

    {
      field: "startDate",
      selector: (d) => d.startDate,
      validators: [Validators.required("يرجى إدخال تاريخ ووقت التحرك")],
    },
    {
      field: "ticketPrice",
      selector: (d) => d.ticketPrice,
      validators: [Validators.required("يرجى إدخال سعر التذكرة")],
    },

    {
      field: "routeId",
      selector: (d) => d.routeId,
      validators: [Validators.required("يرجى تحديد خط السفر")],
    },
  ];

  const { getError, isInvalid, validate, clearError, errorInputClass } =
    useFormValidation(formData, validationRules);

  const handleSeatClick = (seat: SeatType) => {
    // 1. Move Logic
    if (movingTicket) {
      const isOccupied = formData.tickets?.some((t) => t.chairNo === seat.id);
      if (!isOccupied) {
        updateTicketChair(movingTicket.id, movingTicket.chairNo, seat.id);
      } else {
        setMovingTicket(undefined);
      }
      return;
    }

    // 2. Open Ticket Logic
    let ticket = formData.tickets?.find((t) => t.chairNo === seat.id);
    if (!ticket) {
      ticket = new Ticket({
        chairNo: seat.id,
        fromCityId: formData.route?.fromCityId,
        fromCityName: formData.route?.fromCityName,
        toCityId: formData.route?.toCityId,
        toCityName: formData.route?.toCityName,
        issueCityId: formData.route?.fromCityId,
        issueCityName: formData.route?.fromCityName,
        issueDate: new Date(),
        amount: formData.ticketPrice,
        paidAmount: formData.ticketPrice,
      });
    }
    setSelectedTicket(ticket);
    setIsTicketDialogOpen(true);
  };

  const handleTicketUpdate = (updatedTicket: Ticket) => {
    setFormData((prev) => {
      const tickets = [...(prev.tickets || [])];
      const index = tickets.findIndex(
        (t) => t.chairNo === updatedTicket.chairNo,
      );

      if (index > -1) tickets[index] = updatedTicket;
      else tickets.push(updatedTicket);

      return { ...prev, tickets };
    });

    setIsTicketDialogOpen(false);
  };

  const handleDepositOpen = (deposit: Deposit | undefined) => {

    if (deposit == undefined) {
      deposit = new Deposit({
        fromCityId: formData.route?.fromCityId,
        fromCityName: formData.route?.fromCityName,
        toCityId: formData.route?.toCityId,
        toCityName: formData.route?.toCityName,
        amount: formData.ticketPrice,
        paidAmount: formData.ticketPrice,
      });
    }
    setSelectedDeposit(deposit);
    setIsChangeDepositDialogOpen(true);
  };

  if (initLoading) {
    return (
      <DialogContent dir="rtl">
        <Loading entityName="الرحلة" />
      </DialogContent>
    );
  }

  return (
    <DialogContent
      dir="rtl"
      className="sm:max-w-[100vw] sm:w-screen sm:h-screen flex flex-col p-0 gap-0 overflow-hidden"
    >
      <DialogHeader className="p-4 border-b flex flex-row items-center justify-between">
        <div>
          <DialogTitle>{mode === "create" ? "إضافة" : "تعديل"} رحلة</DialogTitle>
          <DialogDescription></DialogDescription>
        </div>
      </DialogHeader>

      <div className="flex flex-1 overflow-hidden">

        <aside 
          className="w-100 transition-all duration-300 border-l bg-muted/10 shrink-0 shadow-inner flex flex-col overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col gap-6">

            <section>
              <h3 className="font-bold tracking-widest mb-3">
                تفاصيل الرحلة
                <Separator className="mt-1 mb-3"/>
              </h3>
              <TripHeader
                formData={formData}
                setFormData={setFormData}
                errorInputClass={errorInputClass}
                clearError={clearError}
                isInvalid={isInvalid}
                getError={getError}
              />
            </section>

            <section>
              <h3 className="font-bold tracking-widest">
                الأمانات
                <Separator className="mt-1 mb-3"/>
              </h3>
              <TripDeposits 
                deposits={formData.deposits ?? []} 
                onDepositDeleted={(i) =>
                  setFormData((prev) => ({
                    ...prev,
                    deposits: prev.deposits?.filter((_, idx) => idx !== i),
                  }))
                } 
                onDepositDialogOpened={(deposit) => handleDepositOpen(deposit)}
              />
            </section>

          </div>

          <section className="p-4 border-t bg-background/50 backdrop-blur-sm flex flex-col gap-2">
            <SaveButton
              formData={formData as Trip}
              dialogMode={mode}
              service={new TripsApiService()}
              onSuccess={(trip) => onSuccess?.(trip)}
              validation={validate}
            />
            <DialogClose asChild>
              <Button variant="outline" className="w-full h-8 text-xs">
                إلغاء
              </Button>
            </DialogClose>
          </section>

        </aside>

        <main className="flex-1 overflow-hidden flex flex-col bg-background relative">
          
          <TripAmountSummary tickets={formData.tickets ?? []} deposits={formData.deposits ?? []} />

          <div className="flex-1 overflow-auto custom-scrollbar flex flex-col items-center justify-start p-4">
            
            <Bus
              isLoading={initLoading}
              seats={Array.from({ length: 44 }, (_, i) => ({ id: i + 1 }))}
              tickets={formData.tickets ?? []}
              onSeatClick={handleSeatClick}
              onMoveTicket={(t) => setMovingTicket(t || undefined)}
              movingTicketId={movingTicket?.id || movingTicket?.chairNo}
              onReportPrint={(ticketId) => {
                handlePrintTicket(ticketId)
              }}
              onDeleteTicket={(id) =>
                setFormData((p) => ({
                  ...p,
                  tickets: p.tickets?.filter((t) => t.id !== id),
                }))
              }
              lastRowFull
            />      

          </div>

        </main>
        
      </div>

      {/* Nested Ticket Dialog */}
      <Dialog open={isTicketDialogOpen} onOpenChange={setIsTicketDialogOpen}>
        {isTicketDialogOpen && (
          <ChangeTicketDialog
            entity={selectedTicket}
            passengers={passengers?.data}
            filterPassengers={filterPassengers}
            fetchingPassengers={fetchingPassengers}
            onPassengerDialogClicked={(p) => {
              setSelectedPassenger(p);
              setIsEditPassengerDialogOpen(true);
            }}
            onSuccess={handleTicketUpdate}
          />
        )}
      </Dialog>

      {/* Nested Passenger Dialog */}
      <Dialog
        open={isEditPassengerDialogOpen}
        onOpenChange={setIsEditPassengerDialogOpen}
      >
        {isEditPassengerDialogOpen && (
          <ChangePassengerDialog
            entity={selectedPassenger}
            mode={selectedPassenger ? "update" : "create"}
            onSuccess={(data) => {
              refreshPassengers(data);
              setSelectedTicket((prev) =>
                prev
                  ? { ...prev, passengerId: data.id, passenger: data }
                  : prev,
              );
              setIsEditPassengerDialogOpen(false);
            }}
          />
        )}
      </Dialog>

      {/* Nested Deposit Dialog */}
      <Dialog open={isChangeDepositDialogOpen} onOpenChange={setIsChangeDepositDialogOpen}>
        {isChangeDepositDialogOpen && (
          <ChangeDepositDialog 
            entity={selectedDeposit}
            onSuccess={(dep) => {
              setFormData((prev) => {
                const existingDeposits = prev.deposits ?? [];
                const isExisting = dep.id && existingDeposits.some((d) => d.id === dep.id);

                const updatedDeposits = isExisting
                  ? existingDeposits.map((d) => (d.id === dep.id ? dep : d)) 
                  : [...existingDeposits, dep];

                return {
                  ...prev,
                  deposits: updatedDeposits,
                };
              });
              
              setIsChangeDepositDialogOpen(false);
            }}
          />
        )}
      </Dialog>

    </DialogContent>
  );
}
