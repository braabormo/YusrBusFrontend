import { useCallback, useState } from "react";
import { type ValidationRule, useFormValidation } from "./useFormValidation";

export function useEntityForm<T>(initialData: Partial<T> | undefined, rules: ValidationRule<Partial<T>>[]) {
  const [formData, setFormData] = useState<Partial<T>>({ ...initialData });
  const validation = useFormValidation(formData, rules);

  const handleChange = useCallback((field: keyof T, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validation.clearError(field as string);
  }, [validation]);

  return { formData, handleChange, ...validation };
}