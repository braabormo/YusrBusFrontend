"use client";

import { useLoggedInUser } from "@/app/core/contexts/loggedInUserContext";
import TripDepositsReportApiService from "@/app/core/networking/services/reports/tripDepositsReportApiService";
import TripTicketsReportApiService from "@/app/core/networking/services/reports/tripTicketsReportApiService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Archive, Calculator, Coins, Loader2, Printer, Receipt, Ticket as TicketIcon, Wallet } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Trip } from "../data/trip";
import { SystemPermissions } from "@/app/core/auth/systemPermissions";
import { SystemPermissionsActions } from "@/app/core/auth/systemPermissionsActions";
import { SystemPermissionsResources } from "@/app/core/auth/systemPermissionsResources";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface TripAmountSummaryProps {
  trip: Trip;
  discountPercentage?: number;
  className?: string;
}

function AnimatedNumber({ value }: { value: number }) {
  const [displayed, setDisplayed] = useState(value);
  const prevValue = useRef(value);

  useEffect(() => {
    const start = prevValue.current;
    const end = value;
    if (start === end) return;
    
    const duration = 400;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setDisplayed(Math.round(start + (end - start) * progress));
      if (progress < 1) requestAnimationFrame(animate);
      else prevValue.current = end;
    };
    requestAnimationFrame(animate);
  }, [value]);

  return <span className="tabular-nums">{displayed?.toLocaleString()}</span>;
}

export default function TripAmountSummary({
  trip,
  discountPercentage,
  className,
}: TripAmountSummaryProps) {
  // Aggregate Calculations (Tickets + Deposits)
  const ticketTotal = trip?.tickets?.reduce((s, t) => s + (t.amount ?? 0), 0);
  const ticketPaid = trip?.tickets?.reduce((s, t) => s + (t.paidAmount ?? 0), 0);
  
  const depositTotal = trip?.deposits?.reduce((s, d) => s + (d.amount ?? 0), 0);
  const depositPaid = trip?.deposits?.reduce((s, d) => s + (d.paidAmount ?? 0), 0);

  const grandTotal = ticketTotal + depositTotal;
  const grandPaid = ticketPaid + depositPaid;
  const grandRemaining = grandTotal - grandPaid;

  const [commission, setCommission] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPrintingTickets, setIsPrintingTickets] = useState(false);
  const [isPrintingDeposits, setIsPrintingDeposits] = useState(false);
  const {loggedInUser} = useLoggedInUser();

  const handlePrintTripTickets = async () => {
    setIsPrintingTickets(true);
    try {
      const currentUserId = loggedInUser?.id; 
      await TripTicketsReportApiService.getReport(trip?.id, currentUserId ?? 0);
    } finally {
      setIsPrintingTickets(false);
    }
  };

  const handlePrintTripDeposits = async (commission: number) => {
    setIsPrintingDeposits(true);
    try {
      const currentUserId = loggedInUser?.id; 
      await TripDepositsReportApiService.getReport(trip?.id, commission, currentUserId ?? 0);
      setIsDialogOpen(false);
    } finally {
      setIsPrintingDeposits(false);
    }
  };

  return (
    <div className={cn(
      "sticky top-0 z-20 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60",
      "px-4 py-4 mb-6",
      className
    )}>
      <div className="mx-auto max-w-5xl flex items-center justify-between gap-8 overflow-x-auto no-scrollbar">
        
        <div className="flex items-center gap-10">
          {/* Tickets Count */}
          <div className="flex flex-col min-w-fit">
            <span className="text-[10px] text-muted-foreground font-medium uppercase mb-0.5">عدد التذاكر</span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight"><AnimatedNumber value={trip?.tickets?.length} /></span>
              <TicketIcon className="w-4 h-4 text-muted-foreground/50" />
            </div>
          </div>

          {/* Deposits Count */}
          <div className="flex flex-col min-w-fit">
            <span className="text-[10px] text-muted-foreground font-medium uppercase mb-0.5">عدد الأمانات</span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight"><AnimatedNumber value={trip?.deposits?.length} /></span>
              <Archive className="w-4 h-4 text-muted-foreground/50" />
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="h-8 w-px bg-border/60 mx-2 hidden md:block" />

          {/* Total Amount */}
          <div className="flex flex-col min-w-fit">
            <span className="text-[10px] text-muted-foreground font-medium uppercase mb-0.5">الإجمالي الكلي</span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-foreground">
                <AnimatedNumber value={grandTotal} />
              </span>
              {discountPercentage ? (
                <Badge variant="secondary" className="h-4 text-[9px] px-1 font-bold bg-primary/10 text-primary border-none">
                  -{discountPercentage}%
                </Badge>
              ) : <Coins className="w-4 h-4 text-muted-foreground/50" />}
            </div>
          </div>

          {/* Paid Amount */}
          <div className="flex flex-col min-w-fit">
            <span className="text-[10px] text-muted-foreground font-medium uppercase mb-0.5">المبلغ المحصل</span>
            <div className="flex items-center gap-2 text-green-600">
              <span className="text-xl font-bold tracking-tight">
                <AnimatedNumber value={grandPaid} />
              </span>
              <Wallet className="w-4 h-4 opacity-70" />
            </div>
          </div>

          {/* Remaining Amount */}
          <div className="flex flex-col min-w-fit">
            <span className="text-[10px] text-muted-foreground font-medium uppercase mb-0.5">المبلغ المتبقي</span>
            <div className={cn(
                "flex items-center gap-2",
                grandRemaining > 0 ? "text-destructive" : "text-muted-foreground"
            )}>
              <span className="text-xl font-bold tracking-tight">
                <AnimatedNumber value={grandRemaining} />
              </span>
              <Calculator className="w-4 h-4 opacity-70" />
            </div>
          </div>
        </div>

        {/* Collection Status */}
        <div className="hidden xl:block shrink-0">
            <div className={cn(
                "flex items-center gap-2 px-4 py-1.5 rounded-lg border text-xs font-semibold",
                grandRemaining <= 0 ? "bg-green-500/5 text-green-600 border-green-500/20" : "bg-muted text-muted-foreground"
            )}>
                <div className={cn("w-2 h-2 rounded-full animate-pulse", grandRemaining <= 0 ? "bg-green-500" : "bg-orange-400")} />
                {grandRemaining <= 0 ? "الرحلة مسددة" : "قيد التحصيل"}
            </div>
        </div>

        <div className="flex gap-3">
            {SystemPermissions.hasAuth(loggedInUser?.role?.permissions ?? [], SystemPermissionsResources.TripTicketsReport, SystemPermissionsActions.Get) && (
              <Button 
                disabled={isPrintingTickets} 
                className="h-9 gap-2 text-xs min-w-27.5" 
                onClick={handlePrintTripTickets}
              >
                {isPrintingTickets ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Printer className="w-3.5 h-3.5" />
                )}
                طباعة التذاكر
              </Button>
            )}
            {SystemPermissions.hasAuth(loggedInUser?.role?.permissions ?? [], SystemPermissionsResources.TripDepositsReport, SystemPermissionsActions.Get) && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button disabled={isPrintingDeposits} className="h-9 gap-2 text-xs min-w-27.5">
                    <Receipt className="w-3.5 h-3.5" />
                    طباعة الأمانات
                  </Button>
                </DialogTrigger>
                <DialogContent dir="rtl" className="sm:max-w-81.25">
                  <DialogHeader>
                    <DialogTitle className="text-right">طباعة تقرير الأمانات</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2 text-right">
                      <Label htmlFor="commission" className="text-xs">
                        نسبة العمولة (%)
                      </Label>
                      <Input
                        id="commission"
                        type="number"
                        placeholder="0"
                        min={0}
                        max={100}
                        className="text-right"
                        value={commission}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (val < 0) setCommission(0);
                          else if (val > 100) setCommission(100);
                          else setCommission(val);
                        }}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      disabled={isPrintingDeposits}
                      type="button" 
                      className="w-full gap-2" 
                      onClick={() => handlePrintTripDeposits(commission)}
                    >
                      {isPrintingDeposits && <Loader2 className="w-4 h-4 animate-spin" />}
                      تأكيد وطباعة
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
        </div>
      </div>
    </div>
  );
}