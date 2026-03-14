import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  isInvalid?: boolean;
  onChange?: (val: number | undefined) => void;
}

export function NumberInput({ onChange, min, max, isInvalid, className, ...props }: NumberInputProps) {
  return (
    <Input
      {...props}
      type="number"
      min={min}
      max={max}
      className={cn(className, isInvalid && "border-red-600 ring-red-600 text-red-900")}
      onChange={(e) => {
        const rawValue = e.target.value;
        if (rawValue === "") {
          onChange?.(undefined);
          return;
        }

        let val = Number(rawValue);
        if (min !== undefined && val < Number(min)) val = Number(min);
        if (max !== undefined && val > Number(max)) val = Number(max);

        onChange?.(val);
      }}
    />
  );
}