import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";
import { ChevronDownIcon } from "lucide-react";
import { FormField } from "./formField";

interface DateTimeFieldProps {
  label: string;
  value?: Date;
  onChange: (date: Date) => void;
  error?: string;
  isInvalid?: boolean;
  locale?: any;
}

export function DateTimeField({ label, value, onChange, error, isInvalid, locale = arSA }: DateTimeFieldProps) {
  const dateValue = value instanceof Date ? value : undefined;

  const handleDateSelect = (newDate: Date | undefined) => {
    if (!newDate) return;
    const dateWithTime = new Date(newDate);
    if (dateValue) {
      dateWithTime.setHours(dateValue.getHours(), dateValue.getMinutes());
    }
    onChange(dateWithTime);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeVal = e.target.value;
    if (!timeVal) return;
    const [hours, minutes] = timeVal.split(":").map(Number);
    const newDate = dateValue ? new Date(dateValue) : new Date();
    newDate.setHours(hours, minutes, 0, 0);
    onChange(newDate);
  };

  return (
    <FormField label={label} error={error} isInvalid={isInvalid}>
      <div className="flex gap-2">
        {/* Date Part */}
        <div className="flex-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-8 w-full justify-between text-left text-xs font-normal border",
                  !dateValue && "text-muted-foreground",
                  isInvalid && "border-red-500 ring-red-500 text-red-900"
                )}
              >
                {dateValue ? format(dateValue, "yyyy-MM-dd") : <span>إختر تاريخا</span>}
                <ChevronDownIcon className="h-3 w-3 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                captionLayout="dropdown"
                selected={dateValue}
                onSelect={handleDateSelect}
                locale={locale}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Time Part */}
        <div className="w-24">
          <Input
            type="time"
            className={cn(
              "h-8 text-xs bg-background appearance-none",
              isInvalid && "border-red-500 ring-red-500"
            )}
            value={dateValue ? format(dateValue, "HH:mm") : ""}
            onChange={handleTimeChange}
          />
        </div>
      </div>
    </FormField>
  );
}