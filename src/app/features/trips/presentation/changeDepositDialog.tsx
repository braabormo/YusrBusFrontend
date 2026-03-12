import ChangeDataDialog from "@/app/core/components/dialogs/ChangeDataDialog";
import SearchableSelect from "@/app/core/components/select/searchableSelect";
import { CityFilterColumns } from "@/app/core/data/city";
import { StorageFileStatus } from "@/app/core/data/storageFile";
import {
  useFormValidation,
  type ValidationRule,
} from "@/app/core/hooks/useFormValidation";
import useStorageFile from "@/app/core/hooks/useStorageFile";
import { useAppDispatch, useAppSelector } from "@/app/core/state/hooks";
import { filterCities } from "@/app/core/state/shared/citySlice";
import { Validators } from "@/app/core/utils/validators";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Maximize2, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Deposit } from "../data/deposit";

type ChangeDepositDialogProps = {
  entity?: Deposit;
  onSuccess?: (newData: Deposit) => void;
};

export default function ChangeDepositDialog({
  entity,
  onSuccess,
}: ChangeDepositDialogProps) {
  const [formData, setFormData] = useState<Partial<Deposit>>(entity || {});
  const cityState = useAppSelector((state) => state.city);
  const dispatch = useAppDispatch();
  const { fileInputRef, handleFileChange, handleRemoveFile, handleDownload } = useStorageFile(
    setFormData,
    "image"
  );

  useEffect(() => {
    if (entity) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(entity);
    }
  }, [entity]);

  const validationRules: ValidationRule<Partial<Deposit>>[] = [
    {
      field: "fromCityId",
      selector: (d) => d.fromCityId,
      validators: [Validators.required("يرجى اختيار مدينة المغادرة")],
    },
    {
      field: "toCityId",
      selector: (d) => d.toCityId,
      validators: [Validators.required("يرجى اختيار مدينة الوجهة")],
    },
    {
      field: "sender",
      selector: (d) => d.sender,
      validators: [Validators.required("يرجى إدخال اسم المرسل")],
    },
    {
      field: "recipient",
      selector: (d) => d.recipient,
      validators: [Validators.required("يرجى إدخال اسم المستلم")],
    },
    {
      field: "senderPhone",
      selector: (d) => d.senderPhone,
      validators: [Validators.required("يرجى إدخال رقم هاتف المرسل")],
    },
    {
      field: "recipientPhone",
      selector: (d) => d.recipientPhone,
      validators: [Validators.required("يرجى إدخال رقم هاتف المستلم")],
    },
    {
      field: "description",
      selector: (d) => d.description,
      validators: [Validators.required("يرجى إدخال وصف الأمانة")],
    },
    {
      field: "amount",
      selector: (d) => d.amount,
      validators: [Validators.min(0, "يرجى إدخال المبلغ المطلوب")],
    },
  ];

  const { getError, isInvalid, validate, clearError, errorInputClass } =
    useFormValidation(formData, validationRules);

  function onSaveHandler() {
    if (!validate()) return;
    onSuccess?.(formData as Deposit);
  }

  const currentImage = formData.image;
  
  const showPreview = currentImage?.url && currentImage.status !== StorageFileStatus.Delete;
  const imageSrc = currentImage?.url || 
    (currentImage?.base64File ? `data:${currentImage.contentType};base64,${currentImage.base64File}` : "");

  

  return (
    <ChangeDataDialog title="بيانات الأمانة" onSaveHandler={onSaveHandler}>
      <div className="flex gap-3">
        <Field>
          <Label>من المدينة</Label>
          <SearchableSelect
            items={cityState.entities.data ?? []}
            itemLabelKey="name"
            itemValueKey="id"
            placeholder="اختر المدينة"
            value={formData.fromCityId?.toString() || ""}
            onValueChange={(val) => {
              const selectedCity = cityState.entities.data?.find((c) => c.id.toString() === val);
              setFormData((prev) => ({
                ...prev,
                fromCityId: selectedCity?.id,
                fromCityName: selectedCity?.name,
              }));
              clearError("fromCityId");
            }}
            columnsNames={CityFilterColumns.columnsNames}
            onSearch={(condition) => dispatch(filterCities(condition))}
            errorInputClass={errorInputClass("fromCityId")}
            disabled={cityState.isLoading}
          />
          {isInvalid("fromCityId") && (
            <span className="text-xs text-red-500">
              {getError("fromCityId")}
            </span>
          )}
        </Field>

        <Field>
          <Label>إلى المدينة</Label>
          <SearchableSelect
            items={cityState.entities.data ?? []}
            itemLabelKey="name"
            itemValueKey="id"
            placeholder="اختر المدينة"
            value={formData.toCityId?.toString() || ""}
            onValueChange={(val) => {
              const selectedCity = cityState.entities.data?.find((c) => c.id.toString() === val);
              setFormData((prev) => ({
                ...prev,
                toCityId: selectedCity?.id,
                toCityName: selectedCity?.name,
              }));
              clearError("toCityId");
            }}
            columnsNames={CityFilterColumns.columnsNames}
            onSearch={(condition) => dispatch(filterCities(condition))}
            errorInputClass={errorInputClass("toCityId")}
            disabled={cityState.isLoading}
          />
          {isInvalid("toCityId") && (
            <span className="text-xs text-red-500">{getError("toCityId")}</span>
          )}
        </Field>
      </div>

      <div className="flex gap-3">
        <Field>
          <Label>اسم المرسل</Label>
          <Input
            value={formData.sender || ""}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, sender: e.target.value }));
              clearError("sender");
            }}
            className={errorInputClass("sender")}
          />
          {isInvalid("sender") && (
            <span className="text-xs text-red-500">{getError("sender")}</span>
          )}
        </Field>

        <Field>
          <Label>رقم هاتف المرسل</Label>
          <Input
            value={formData.senderPhone || ""}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, senderPhone: e.target.value }));
              clearError("senderPhone");
            }}
            className={errorInputClass("senderPhone")}
          />
          {isInvalid("senderPhone") && (
            <span className="text-xs text-red-500">
              {getError("senderPhone")}
            </span>
          )}
        </Field>
      </div>

      <div className="flex gap-3">
        <Field>
          <Label>اسم المستلم</Label>
          <Input
            value={formData.recipient || ""}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, recipient: e.target.value }));
              clearError("recipient");
            }}
            className={errorInputClass("recipient")}
          />
          {isInvalid("recipient") && (
            <span className="text-xs text-red-500">
              {getError("recipient")}
            </span>
          )}
        </Field>

        <Field>
          <Label>رقم هاتف المستلم</Label>
          <Input
            value={formData.recipientPhone || ""}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                recipientPhone: e.target.value,
              }));
              clearError("recipientPhone");
            }}
            className={errorInputClass("recipientPhone")}
          />
          {isInvalid("recipientPhone") && (
            <span className="text-xs text-red-500">
              {getError("recipientPhone")}
            </span>
          )}
        </Field>
      </div>

      <Field>
        <Label>وصف الأمانة</Label>
        <Input
          value={formData.description || ""}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, description: e.target.value }));
            clearError("description");
          }}
          className={errorInputClass("description")}
        />
        {isInvalid("description") && (
          <span className="text-xs text-red-500">
            {getError("description")}
          </span>
        )}
      </Field>

      <div className="flex gap-3">
        <Field>
          <Label>المبلغ</Label>
          <Input
            type="number"
            value={formData.amount || ""}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                amount: Number(e.target.value),
              }));
              clearError("amount");
            }}
            className={errorInputClass("amount")}
          />
          {isInvalid("amount") && (
            <span className="text-xs text-red-500">{getError("amount")}</span>
          )}
        </Field>

        <Field>
          <Label>المبلغ المدفوع</Label>
          <Input
            type="number"
            value={formData.paidAmount || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                paidAmount: Number(e.target.value),
              }))
            }
          />
        </Field>
      </div>

      <Field className="space-y-2">
        <Label>صورة الأمانة</Label>
        
        {showPreview ? (
          <div className="relative w-full max-w-50 group">
            
            <Dialog>
              <DialogTrigger asChild>
                <div 
                  className="cursor-zoom-in overflow-hidden rounded-md border aspect-square relative hover:opacity-90 transition-opacity"
                  title="اضغط للتكبير"
                >
                  <img
                    src={imageSrc}
                    alt="Preview"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-8 h-8 text-white drop-shadow-md" />
                  </div>
                </div>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[80vw] sm:w-[80vw] sm:h-[80vh] p-0 border-none shadow-none flex items-center justify-center outline-none">
                <div className="relative w-full h-full flex items-center justify-center">
                    <img 
                    src={imageSrc} 
                    alt="Full Preview" 
                    className="w-auto h-auto sm:max-w-[80vw] sm:w-[80vw] sm:h-[80vh] object-contain rounded-md shadow-2xl" 
                    />
                </div>
              </DialogContent>
            </Dialog>

            <Button
              type="button"
              size="icon"
              className="absolute -top-3 right-8 h-8 w-8 rounded-full shadow-md z-20 bg-blue-600 hover:bg-blue-700 text-white border-2 border-background"
              onClick={(e) => handleDownload(e, imageSrc, currentImage.contentType ?? '')}
              title="تحميل الصورة"
            >
              <Download className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              size="icon"
              className="
                absolute -top-3 -right-3 h-8 w-8 rounded-full shadow-md z-20 
                bg-red-600 hover:bg-red-700 text-white 
                border-2 border-background
              "
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) 
        : 
        (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
          >
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            <span className="text-sm text-muted-foreground font-medium">رفع صورة الأمانة</span>
          </div>
        )}

        <Input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </Field>

      <Field>
        <Label>الملاحظات</Label>
        <Input
          value={formData.notes || ""}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, notes: e.target.value }))
          }
        />
      </Field>
    </ChangeDataDialog>
  );
}
