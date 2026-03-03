import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Archive, ArrowLeft, Banknote, Box, Edit, PackagePlus, Printer, Trash2 } from "lucide-react";
import type { Deposit } from "../data/deposit";
import DepositReportApiService from "@/app/core/networking/services/reports/depositReportApiService";
import { useLoggedInUser } from "@/app/core/contexts/loggedInUserContext";

type TripDepositsParams = {
  deposits: Deposit[];
  onDepositDeleted: (index: number) => void;
  onDepositDialogOpened: (deposit: Deposit | undefined) => void;
};

export default function TripDeposits({ deposits, onDepositDeleted, onDepositDialogOpened }: TripDepositsParams) {

  const {loggedInUser} = useLoggedInUser();

  const handlePrintDeposit = async (depositId: number) => {
    const currentUserId = loggedInUser?.id; 
    await DepositReportApiService.getDepositReport(depositId, currentUserId ?? 0);
  };

  return (
    <div className="flex flex-col rounded-lg border bg-card shadow-sm overflow-hidden h-full border-border/50">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-muted/40 border-b">
        <div className="flex items-center gap-2 text-primary">
          <Archive className="w-3.5 h-3.5" />
          <span className="text-[11px] font-bold text-foreground">الأمانات ({deposits.length})</span>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onDepositDialogOpened(undefined)}
          className="h-6 px-2 text-[10px] gap-1 hover:bg-primary hover:text-primary-foreground border-dashed"
        >
          <PackagePlus className="w-3 h-3" />
          إضافة
        </Button>
      </div>

      {/* Content Area */}
      <ScrollArea className="h-75">
        <div className="divide-y divide-border/30">
          {!deposits.length ? (
            <div className="flex flex-col items-center justify-center py-10 opacity-40">
              <Box className="w-6 h-6 mb-1 stroke-1" />
              <p className="text-[10px]">لا توجد بيانات</p>
            </div>
          ) : (
            deposits.map((dep, i) => {
              const amount = dep.amount || 0;
              const paid = dep.paidAmount || 0;
              const remaining = amount - paid;
              const isFullyPaid = remaining <= 0;
              
              return (
                <div dir="rtl" key={i} className="group relative flex items-center gap-2 p-2 hover:bg-muted/30 transition-colors">
                  
                  {/* Column 1: Info (Flexible) */}
                  <div className="flex flex-1 items-center gap-2 min-w-0">
                    <div className="shrink-0">
                      {dep.image?.url || dep.image?.base64File ? (
                        <img
                          alt=""
                          src={dep.image.url || `data:${dep.image.contentType};base64,${dep.image.base64File}`}
                          className="w-9 h-9 rounded-md object-cover border bg-white shadow-sm"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-md bg-muted/50 flex items-center justify-center border border-dashed">
                          <Box className="w-4 h-4 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col min-w-0">
                      <p className="text-sm font-bold truncate text-foreground/90 leading-tight">
                        {dep.description}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5 truncate">
                        <span className="truncate max-w-15">{dep.sender}</span>
                        <ArrowLeft className="h-2 w-2 shrink-0" />
                        <span className="truncate max-w-15">{dep.recipient}</span>
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Financials (Compact & Smart) */}
                  <div className="flex flex-col items-end gap-0.5 px-3 border-r border-dashed shrink-0 min-w-21.25">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-foreground">
                      <span>{amount.toLocaleString()}</span>
                      <Banknote className="w-3 h-3 text-muted-foreground opacity-70" />
                    </div>
                    
                    {isFullyPaid ? (
                      <div className="flex items-center gap-0.5 text-[9px] font-bold text-green-600 bg-green-500/10 px-1.5 py-0.5 rounded-full">
                        <span>مدفوعة</span>
                      </div>
                    ) : (
                      <div className="text-[9px] font-bold text-destructive bg-destructive/10 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                        باقي: {remaining.toLocaleString()}
                      </div>
                    )}
                  </div>

                  {/* Hover Actions */}
                  <div className="flex items-center gap-0.5 ml-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => dep.id? handlePrintDeposit(dep.id) : undefined}
                      className="w-7 h-7 rounded-md hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDepositDialogOpened(dep)}
                      className="w-7 h-7 rounded-md hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDepositDeleted(i)}
                      className="w-7 h-7 rounded-md hover:bg-destructive/30 hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}