import { cn } from "@/lib/utils";
import { TitleSeparator } from "../separators/titleSeparator";

interface FieldsSectionProps {
  title: string;
  children: React.ReactNode;
  columns?: number;
  className?: string;
}

export function FieldsSection({ title, children, columns = 2, className }: FieldsSectionProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <TitleSeparator title={title}/>
      <div 
        className={cn("grid gap-4", {
          "grid-cols-1": columns === 1,
          "grid-cols-2": columns === 2,
          "grid-cols-3": columns === 3,
        })}
      >
        {children}
      </div>
    </div>
  );
}