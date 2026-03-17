import { useCallback, useState } from "react";
import { useFormValidation, type ValidationRule } from "./useFormValidation";

export function useEntityForm<T>(initialData: Partial<T> | undefined, rules: ValidationRule<Partial<T>>[])
{
  const [formData, setFormData] = useState<Partial<T>>({ ...initialData });
  const [prevInitialData, setPrevInitialData] = useState(initialData);

  if (initialData !== prevInitialData)
  {
    setFormData({ ...initialData });
    setPrevInitialData(initialData);
  }

  const validation = useFormValidation(formData, rules);

  const handleChange = useCallback((field: keyof T, value: any) =>
  {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validation.clearError(field as string);
  }, [validation]);

  return { formData, setFormData, handleChange, ...validation };
}
