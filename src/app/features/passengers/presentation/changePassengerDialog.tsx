import SaveButton from "@/app/core/components/buttons/saveButton";
import type { CommonChangeDialogProps } from "@/app/core/components/dialogs/commonChangeDialogProps";
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
import { Calendar } from "@/components/ui/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";
import { ChevronDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { arSA as arSADayPicker } from "react-day-picker/locale";
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

  const { getError, isInvalid, validate, clearError, errorInputClass } =
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
        <Field>
          <Label>اسم الراكب</Label>
          <Input
            value={formData?.name || ""}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, name: e.target.value }));
              clearError("name");
            }}
            className={errorInputClass("name")}
          />
          {isInvalid("name") && (
            <span className="text-xs text-red-500">{getError("name")}</span>
          )}
        </Field>

        <div className="flex gap-3">
          <Field>
            <Label>الجنس</Label>
            <Select
              dir="rtl"
              value={formData.gender?.toString() || ""}
              onValueChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  gender: Number(e) as Gender,
                }));
                clearError("gender");
              }}
            >
              <SelectTrigger className={errorInputClass("gender")}>
                <SelectValue placeholder="اختر" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">ذكر</SelectItem>
                <SelectItem value="1">أنثى</SelectItem>
              </SelectContent>
            </Select>
            {isInvalid("gender") && (
              <span className="text-xs text-red-500">{getError("gender")}</span>
            )}
          </Field>

          <Field>
            <Label>الجنسية</Label>
            <SearchableSelect
              items={countryState.entities.data ?? []}
              itemLabelKey="name"
              itemValueKey="id"
              placeholder="اختر المدينة"
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
              errorInputClass={errorInputClass("nationalityId")}
              disabled={countryState.isLoading}
            />
            {isInvalid("nationalityId") && (
              <span className="text-xs text-red-500">
                {getError("nationalityId")}
              </span>
            )}
          </Field>
        </div>

        <div className="flex gap-3">
          <Field>
            <Label>رقم الجوال</Label>
            <Input
              defaultValue={formData?.phoneNumber}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  phoneNumber: e.target.value,
                }))
              }
            />
          </Field>

          <Field>
            <Label>البريد الإلكتروني</Label>
            <Input
              value={formData?.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </Field>
        </div>

        <Field>
          <Label>تاريخ الميلاد</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                data-empty={!formData?.dateOfBirth}
                className="data-[empty=true]:text-muted-foreground w-53 justify-between text-left font-normal"
              >
                {formData?.dateOfBirth ? (
                  format(formData?.dateOfBirth, "PPP", { locale: arSA })
                ) : (
                  <span>إختر تاريخا</span>
                )}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                captionLayout="dropdown"
                mode="single"
                selected={formData?.dateOfBirth}
                onSelect={(date) =>
                  setFormData((prev) => ({ ...prev, dateOfBirth: date }))
                }
                defaultMonth={formData?.dateOfBirth}
                locale={arSADayPicker}
              />
            </PopoverContent>
          </Popover>
        </Field>

        <Field>
          <Label>رقم الجواز</Label>
          <Input
            value={formData?.passportNo}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, passportNo: e.target.value }));
              clearError("passportNo");
            }}
            className={errorInputClass("passportNo")}
          />
          {isInvalid("passportNo") && (
            <span className="text-xs text-red-500">
              {getError("passportNo")}
            </span>
          )}
        </Field>

        <div className="flex gap-3">
          <Field>
            <Label>تاريخ انتهاء الجواز</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  data-empty={!formData?.passportExpiration}
                  className="data-[empty=true]:text-muted-foreground w-53 justify-between text-left font-normal"
                >
                  {formData?.passportExpiration ? (
                    format(formData?.passportExpiration, "PPP", {
                      locale: arSA,
                    })
                  ) : (
                    <span>إختر تاريخا</span>
                  )}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  captionLayout="dropdown"
                  mode="single"
                  selected={formData?.passportExpiration}
                  onSelect={(date) =>
                    setFormData((prev) => ({
                      ...prev,
                      passportExpiration: date,
                    }))
                  }
                  defaultMonth={formData?.passportExpiration}
                  endMonth={new Date(new Date().getFullYear() + 20, 11)}
                  locale={arSADayPicker}
                />
              </PopoverContent>
            </Popover>
          </Field>

          <Field>
            <Label>مكان إصدار الجواز</Label>
            <Input
              value={formData?.passportIssueLocation}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  passportIssueLocation: e.target.value,
                }))
              }
            />
          </Field>
        </div>
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
          validation={validate}
        />
      </DialogFooter>
    </DialogContent>
  );
}
