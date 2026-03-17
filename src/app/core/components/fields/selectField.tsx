import { SelectInput, type SelectInputProps } from "../input/selectInput";
import { FormField } from "./formField";

export function SelectField(
  { label, error, required, isInvalid, ...props }: SelectInputProps & {
    label: string;
    error?: string;
    required?: boolean;
  }
)
{
  return (
    <FormField label={ label } error={ error } isInvalid={ isInvalid } required={ required }>
      <SelectInput { ...props } isInvalid={ isInvalid } />
    </FormField>
  );
}
