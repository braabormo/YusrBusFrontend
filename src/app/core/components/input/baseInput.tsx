import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface BaseInputProps extends React.InputHTMLAttributes<HTMLInputElement>
{
  isInvalid?: boolean;
}

export function BaseInput({ isInvalid, className, ...props }: BaseInputProps)
{
  return (
    <Input
      { ...props }
      className={ cn(className, isInvalid && "border-red-500 ring-red-500 text-red-900 focus-visible:ring-red-500") }
    />
  );
}
