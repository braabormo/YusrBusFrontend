import { Textarea } from "@/components/ui/textarea";
import { FormField } from "./formField";

export interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  isInvalid?: boolean;
}

export function TextAreaField({ label, error, isInvalid, className, ...props }: TextAreaFieldProps) {
  return (
    <FormField label={label} error={error} isInvalid={isInvalid}>
      <Textarea
        {...props}
        className={`${className} ${isInvalid ? "border-red-500 focus-visible:ring-red-500" : ""}`}
      />
    </FormField>
  );
}