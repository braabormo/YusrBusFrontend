import { InputField, type InputFieldProps } from "./inputField";

export function NumberField({ onChange, min, max, ...props }: InputFieldProps) {
  return (
    <InputField
      {...props}
      type="number"
      min={min}
      max={max}
      onChange={(e) => {
        const rawValue = e.target.value;
        
        if (rawValue === "") {
          onChange?.({ ...e, target: { ...e.target, value: "" } } as any);
          return;
        }

        let val = Number(rawValue);

        if (min !== undefined && val < Number(min)) {
          val = Number(min);
        }

        if (max !== undefined && val > Number(max)) {
          val = Number(max);
        }

        e.target.value = val.toString();
        onChange?.({ ...e, target: { ...e.target, value: val } } as any);
      }}
    />
  );
}