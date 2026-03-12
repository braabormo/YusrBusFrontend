import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";
import { ChevronDownIcon } from "lucide-react";
import { FormField } from "./formField";

interface DateFieldProps {
  label: string;
  value?: Date;
  onChange: (date: Date | undefined) => void;
  error?: string;
  isInvalid?: boolean;
  placeholder?: string;
  locale?: any;
}

export function DateField({
  label,
  value,
  onChange,
  error,
  isInvalid,
  placeholder = "اختر تاريخا",
  locale = arSA
}: DateFieldProps) {
  return (
    <FormField label={label} error={error} isInvalid={isInvalid}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            data-empty={!value}
            className={`
              w-full justify-between text-left font-normal
              data-[empty=true]:text-muted-foreground
              ${isInvalid ? "border-red-500 ring-red-500 text-red-900" : ""}
            `}
          >
            {value ? (
              format(value, "PPP", { locale: locale })
            ) : (
              <span>{placeholder}</span>
            )}
            <ChevronDownIcon className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            captionLayout="dropdown"
            selected={value}
            onSelect={onChange}
            defaultMonth={value}
            locale={locale} 
          />
        </PopoverContent>
      </Popover>
    </FormField>
  );
}