import { Input } from "@/components/ui/input";
import { FormField } from "./formField";

export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  isInvalid?: boolean;
}

export function InputField({ label, error, isInvalid, className, required, ...props }: InputFieldProps) {
  return (
    <FormField label={label} error={error} isInvalid={isInvalid} required={required}>
      <Input
        {...props}
        className={`${className} ${isInvalid ? "border-red-500 ring-red-500 text-red-900" : ""}`}
      />
    </FormField>
  );
}