import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";
import { ChevronDownIcon } from "lucide-react";

export interface DateInputProps
{
  value?: Date;
  onChange: (date: Date | undefined) => void;
  isInvalid?: boolean;
  placeholder?: string;
  locale?: any;
}

export function DateInput({ value, onChange, isInvalid, placeholder = "اختر تاريخا", locale = arSA }: DateInputProps)
{
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={ cn(
            "w-full justify-between text-left font-normal",
            !value && "text-muted-foreground",
            isInvalid && "border-red-600 ring-red-600 text-red-900"
          ) }
        >
          { value ? format(value, "PPP", { locale }) : <span>{ placeholder }</span> }
          <ChevronDownIcon className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={ value } onSelect={ onChange } locale={ locale } />
      </PopoverContent>
    </Popover>
  );
}
