import { TextAreaInput, type TextAreaInputProps } from "../input/textAreaInput";
import { FormField } from "./formField";

export function TextAreaField(
  { label, error, isInvalid, required, ...props }: TextAreaInputProps & {
    label: string;
    error?: string;
    required?: boolean;
  }
)
{
  return (
    <FormField label={ label } error={ error } isInvalid={ isInvalid } required={ required }>
      <TextAreaInput { ...props } isInvalid={ isInvalid } />
    </FormField>
  );
}
