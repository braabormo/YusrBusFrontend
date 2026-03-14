import SaveButton from "@/app/core/components/buttons/saveButton";
import type { CommonChangeDialogProps } from "@/app/core/components/dialogs/commonChangeDialogProps";
import { DateField } from "@/app/core/components/fields/dateField";
import { FieldsSection } from "@/app/core/components/fields/fieldsSection";
import { FormField } from "@/app/core/components/fields/formField";
import { PhoneField } from "@/app/core/components/fields/phoneField";
import { SelectField } from "@/app/core/components/fields/selectField";
import { TextField } from "@/app/core/components/fields/textField";
import SearchableSelect from "@/app/core/components/select/searchableSelect";
import { CountryFilterColumns } from "@/app/core/data/country";
import {
  useFormValidation,
  type ValidationRule,
} from "@/app/core/hooks/useFormValidation";
import PassengersApiService from "@/app/core/networking/services/passengersApiService";
import { useAppDispatch, useAppSelector } from "@/app/core/state/hooks";
import { filterCountries } from "@/app/core/state/shared/countrySlice";
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
import { useEffect, useState } from "react";
import type { Gender, Passenger } from "../data/passenger";

export default function ChangePassengerDialog({
  entity,
  mode,
  onSuccess,
}: CommonChangeDialogProps<Passenger>) {
  const [formData, setFormData] = useState<Partial<Passenger>>(entity || {});
  const countryState = useAppSelector((state) => state.country);

  const validationRules: ValidationRule<Partial<Passenger>>[] = [
    {
      field: "name",
      selector: (d) => d.name,
      validators: [Validators.required("يرجى ادخال اسم الراكب")],
    },
    {
      field: "nationalityId",
      selector: (d) => d.nationalityId,
      validators: [Validators.required("يرجى اختيار الجنسية")],
    },
    {
      field: "gender",
      selector: (d) => d.gender,
      validators: [Validators.required("يرجى ادخال الجنس")],
    },
    {
      field: "passportNo",
      selector: (d) => d.passportNo,
      validators: [Validators.required("يرجى ادخال بيانات جواز السفر")],
    },
  ];

  const { getError, isInvalid, validate, clearError } =
    useFormValidation(formData, validationRules);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(filterCountries(undefined));
  }, [dispatch]);

  return (
    <DialogContent dir="rtl" className="sm:max-w-xl">
      <DialogHeader>
        <DialogTitle>{mode === "create" ? "إضافة" : "تعديل"} راكب</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>

      <Separator />

      <FieldGroup>

        <FieldsSection title="المعلومات الشخصية" columns={2}>

          <TextField
            label="اسم الراكب"
            required
            value={formData.name || ""}
            isInvalid={isInvalid("name")}
            error={getError("name")}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              clearError("name");
            }}
          />

          <SelectField
            label="الجنس"
            required
            value={formData.gender?.toString() || ""}
            isInvalid={isInvalid("gender")}
            error={getError("gender")}
            onValueChange={(val) => {
              setFormData({ ...formData, gender: Number(val) as Gender });
              clearError("gender");
            }}
            options={[
              { label: "ذكر", value: "0" },
              { label: "أنثى", value: "1" },
            ]}
          />

          <FormField 
            label="الجنسية" 
            required 
            isInvalid={isInvalid("nationalityId")} 
            error={getError("nationalityId")}
          >
            <SearchableSelect
              items={countryState.entities.data ?? []}
              itemLabelKey="name"
              itemValueKey="id"
              placeholder="اختر الجنسية"
              value={formData.nationalityId?.toString() || ""}
              onValueChange={(val) => {
                const selectedCountry = countryState.entities.data?.find(
                  (c) => c.id.toString() === val,
                );
                if (selectedCountry) {
                  setFormData((prev) => ({
                    ...prev,
                    nationalityId: selectedCountry.id,
                    nationality: selectedCountry,
                  }));
                  clearError("nationalityId");
                }
              }}
              columnsNames={CountryFilterColumns.columnsNames}
              onSearch={(condition) => filterCountries(condition)}
              errorInputClass={isInvalid("nationalityId") ? "border-red-500 ring-red-500" : ""}
              disabled={countryState.isLoading}
            />
          </FormField>

          <DateField
            label="تاريخ الميلاد"
            value={formData.dateOfBirth}
            onChange={(date) => setFormData({ ...formData, dateOfBirth: date })}
          />
          
        </FieldsSection>

        <FieldsSection title="معلومات التواصل" columns={2}>
          <PhoneField
            label="رقم الجوال"
            value={formData.phoneNumber || ""}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
          />
          <TextField
            label="البريد الإلكتروني"
            type="email"
            value={formData.email || ""}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </FieldsSection>

        <FieldsSection title="بيانات جواز السفر" columns={2}>
          <TextField
            label="رقم الجواز"
            required
            value={formData.passportNo || ""}
            isInvalid={isInvalid("passportNo")}
            error={getError("passportNo")}
            onChange={(e) => {
              setFormData({ ...formData, passportNo: e.target.value });
              clearError("passportNo");
            }}
          />
          <DateField
            label="تاريخ انتهاء الجواز"
            value={formData.passportExpiration}
            onChange={(date) => setFormData({ ...formData, passportExpiration: date })}
          />
          <TextField
            label="مكان إصدار الجواز"
            className="md:col-span-2"
            value={formData.passportIssueLocation || ""}
            onChange={(e) => setFormData({ ...formData, passportIssueLocation: e.target.value })}
          />
        </FieldsSection>

      </FieldGroup>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">إلغاء</Button>
        </DialogClose>
        <SaveButton
          formData={formData as Passenger}
          dialogMode={mode}
          service={new PassengersApiService()}
          disable={() => countryState.isLoading}
          onSuccess={(data) => onSuccess?.(data, mode)}
          validate={validate}
        />
      </DialogFooter>
    </DialogContent>
  );
}
