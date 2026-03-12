import type { CummonChangeDialogProps } from "@/app/core/components/dialogs/cummonChangeDialogProps";
import { FieldsSection } from "@/app/core/components/fields/fieldsSection";
import { FormField } from "@/app/core/components/fields/formField";
import { TextField } from "@/app/core/components/fields/textField";
import SearchableSelect from "@/app/core/components/select/searchableSelect";
import { CityFilterColumns } from "@/app/core/data/city";
import {
  useFormValidation,
  type ValidationRule,
} from "@/app/core/hooks/useFormValidation";
import BranchesApiService from "@/app/core/networking/services/branchesApiService";
import { useAppDispatch, useAppSelector } from "@/app/core/state/hooks";
import { filterCities } from "@/app/core/state/shared/citySlice";
import { Validators } from "@/app/core/utils/validators";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { useEffect, useMemo, useState } from "react";
import SaveButton from "../../../core/components/buttons/saveButton";
import type Branch from "../data/branch";

export default function ChangeBranchDialog({
  entity,
  mode,
  onSuccess,
}: CummonChangeDialogProps<Branch>) 
{
  const [formData, setFormData] = useState<Partial<Branch>>({...entity});

  const cityState = useAppSelector((state) => state.city);
  const dispatch = useAppDispatch();

  const validationRules: ValidationRule<Partial<Branch>>[] = useMemo(() => [
    { field: "name", selector: (d) => d.name, validators: [Validators.required("اسم الفرع مطلوب")] },
    { field: "cityId", selector: (d) => d.cityId, validators: [Validators.required("يرجى اختيار المدينة")] },
  ], []);

  const { getError, isInvalid, validate, clearError } = useFormValidation(formData, validationRules);

  const handleChange = (field: keyof Branch, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    clearError(field as string);
  };

  useEffect(() => {
    dispatch(filterCities(undefined));
  }, [dispatch]);

  return (
    <DialogContent dir="rtl" className="sm:max-w-sm">
      
      <DialogHeader>
        <DialogTitle>{mode === "create" ? "إضافة" : "تعديل"} فرع</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>

      <Separator></Separator>

      <FieldGroup className="py-2">
        
        <TextField
          label="اسم الفرع"
          value={formData.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
          isInvalid={isInvalid("name")}
          error={getError("name")}
          required={true}
        />

        <FormField label="المدينة" required={true} isInvalid={isInvalid("cityId")} error={getError("cityId")}>
          <SearchableSelect
            items={cityState.entities.data ?? []}
            itemLabelKey="name"
            itemValueKey="id"
            placeholder="اختر المدينة"
            value={formData.cityId?.toString() || ""}
            onValueChange={(val) => handleChange("cityId", Number(val))}
            columnsNames={CityFilterColumns.columnsNames}
            onSearch={(condition) => dispatch(filterCities(condition))}
            errorInputClass={isInvalid("cityId") ? "border-red-500 ring-red-500" : ""}
            disabled={cityState.isLoading}
          />
        </FormField>

        <FieldsSection title="الموقع" columns={2}>
          <TextField
            label="الشارع"
            value={formData.street || ""}
            onChange={(e) => handleChange("street", e.target.value)}
          />
          <TextField
            label="الحي"
            value={formData.district || ""}
            onChange={(e) => handleChange("district", e.target.value)}
          />
          <TextField
            label="رقم المبنى"
            value={formData.buildingNumber || ""}
            onChange={(e) => handleChange("buildingNumber", e.target.value)}
          />
          <TextField
            label="الرمز البريدي"
            value={formData.postalCode || ""}
            onChange={(e) => handleChange("postalCode", e.target.value)}
          />
        </FieldsSection>
        
      </FieldGroup>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">إلغاء</Button>
        </DialogClose>
        <SaveButton
          formData={formData as Branch}
          dialogMode={mode}
          service={new BranchesApiService()}
          disable={() => cityState.isLoading}
          onSuccess={(data) => onSuccess?.(data, mode)}
          validation={validate}
        />
      </DialogFooter>

    </DialogContent>
  );
}
