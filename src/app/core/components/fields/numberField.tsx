import { NumberInput, type NumberInputProps } from "../input/numberInput";
import { FormField } from "./formField";

interface NumberFieldProps extends NumberInputProps
{
  label: string;
  error?: string;
  required?: boolean;
}

export function NumberField({ label, error, isInvalid, required, ...props }: NumberFieldProps)
{
  return (
    <FormField label={ label } error={ error } isInvalid={ isInvalid } required={ required }>
      <NumberInput { ...props } isInvalid={ isInvalid } />
    </FormField>
  );
}
