import type { CummonChangeDialogProps } from "@/app/core/components/dialogs/cummonChangeDialogProps";
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
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import SaveButton from "../../../core/components/buttons/saveButton";
import type Branch from "../data/branch";

export default function ChangeBranchDialog({
  entity,
  mode,
  onSuccess,
}: CummonChangeDialogProps<Branch>) 
{
  const [formData, setFormData] = useState<Partial<Branch>>({
    id: entity?.id,
    name: entity?.name,
    cityId: entity?.cityId,
    street: entity?.street,
    district: entity?.district,
    buildingNumber: entity?.buildingNumber,
    postalCode: entity?.postalCode,
  });

  const cityState = useAppSelector((state) => state.city);
  const dispatch = useAppDispatch();

  const validationRules: ValidationRule<Partial<Branch>>[] = [
    {
      field: "name",
      selector: (d) => d.name,
      validators: [Validators.required("يرجى إدخال اسم الفرع")],
    },
    {
      field: "cityId",
      selector: (d) => d.cityId,
      validators: [Validators.required("يرجى إدخال موقع الفرع")],
    },
  ];

  const { getError, isInvalid, validate, clearError, errorInputClass } = useFormValidation(formData, validationRules);

  return (
    <DialogContent dir="rtl" className="sm:max-w-sm">
      <DialogHeader>
        <DialogTitle>{mode === "create" ? "إضافة" : "تعديل"} فرع</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>

      <Separator></Separator>

      <FieldGroup className="py-2">
        <Field>
          <Label htmlFor="branchName">اسم الفرع</Label>
          <Input
            id="branchName"
            name="branchName"
            value={formData.name || ""}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              clearError("name");
            }}
            className={errorInputClass("name")}
          />
          {isInvalid("name") && (
            <span className="text-xs text-red-500">{getError("name")}</span>
          )}
        </Field>

        <Field>
          <Label htmlFor="branchCity">المدينة</Label>
          <SearchableSelect 
            items={cityState.entities.data ?? []} 
            itemLabelKey="name" 
            itemValueKey="id" 
            placeholder="اختر المدينة"
            value={formData.cityId?.toString() || ""} 
            onValueChange={(val) => {
              setFormData({ ...formData, cityId: Number(val) });
              clearError("cityId");
            }}
            columnsNames={CityFilterColumns.columnsNames}
            onSearch={(condition) => dispatch(filterCities(condition))} 
            errorInputClass={isInvalid("fromCityId") ? "border-red-500 ring-red-500" : ""}
            disabled={cityState.isLoading}
          />
          {isInvalid("cityId") && (
            <span className="text-xs text-red-500">{getError("cityId")}</span>
          )}
        </Field>

        <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
          <div className="col-span-full">
            <Label className="text-sm font-semibold">الموقع</Label>
          </div>

          <Field>
            <Label htmlFor="branchStreet">الشارع</Label>
            <Input
              id="branchStreet"
              value={formData.street || ""}
              onChange={(e) =>
                setFormData({ ...formData, street: e.target.value })
              }
            />
          </Field>

          <Field>
            <Label htmlFor="branchDistrict">الحي</Label>
            <Input
              id="branchDistrict"
              value={formData.district || ""}
              onChange={(e) =>
                setFormData({ ...formData, district: e.target.value })
              }
            />
          </Field>

          <Field>
            <Label htmlFor="branchBuildingNumber">رقم المبنى</Label>
            <Input
              id="branchBuildingNumber"
              value={formData.buildingNumber || ""}
              onChange={(e) =>
                setFormData({ ...formData, buildingNumber: e.target.value })
              }
            />
          </Field>

          <Field>
            <Label htmlFor="branchPostalCode">الرمز البريدي</Label>
            <Input
              id="branchPostalCode"
              value={formData.postalCode || ""}
              onChange={(e) =>
                setFormData({ ...formData, postalCode: e.target.value })
              }
            />
          </Field>
        </FieldGroup>
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
