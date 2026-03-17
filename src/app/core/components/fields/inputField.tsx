import { BaseInput, type BaseInputProps } from "../input/baseInput";
import { FormField } from "./formField";

export interface InputFieldProps extends BaseInputProps
{
  label: string;
  error?: string;
  required?: boolean;
}

export function InputField({ label, error, isInvalid, required, ...props }: InputFieldProps)
{
  return (
    <FormField label={ label } error={ error } isInvalid={ isInvalid } required={ required }>
      <BaseInput { ...props } isInvalid={ isInvalid } />
    </FormField>
  );
}
