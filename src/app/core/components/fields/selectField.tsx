import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField } from "./formField";

interface SelectFieldProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: { label: string; value: string }[];
  error?: string;
  isInvalid?: boolean;
  required?: boolean;
}

export function SelectField({ label, value, onValueChange, options, error, isInvalid, required }: SelectFieldProps) {
  return (
    <FormField label={label} error={error} isInvalid={isInvalid} required={required}>
      <Select value={value} onValueChange={onValueChange} dir="rtl">
        <SelectTrigger className={`w-full ${isInvalid ? "border-red-500 ring-red-500" : ""}`}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  );
}