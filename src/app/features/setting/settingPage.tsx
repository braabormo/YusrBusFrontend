import { updateSetting } from "@/app/core/auth/authSlice";
import { FormField } from "@/app/core/components/fields/formField";
import { TextField } from "@/app/core/components/fields/textField";
import { SelectInput } from "@/app/core/components/input/selectInput";
import { Setting } from "@/app/core/data/setting";
import { StorageFileStatus } from "@/app/core/data/storageFile";
import { useEntityForm } from "@/app/core/hooks/useEntityForm";
import { type ValidationRule } from "@/app/core/hooks/useFormValidation";
import useStorageFile from "@/app/core/hooks/useStorageFile";
import SettingsApiService from "@/app/core/networking/services/settingsApiService";
import { useAppDispatch, useAppSelector } from "@/app/core/state/hooks";
import { filterCurrencies } from "@/app/core/state/shared/currencySlice";
import { Validators } from "@/app/core/utils/validators";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { differenceInDays, format } from "date-fns";
import { Camera, Loader2, Trash2, Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function SettingPage()
{
  const validationRules: ValidationRule<Partial<Setting>>[] = useMemo(
    () => [
      {
        field: "companyName",
        selector: (d) => d.companyName,
        validators: [Validators.required("اسم الشركة مطلوب")]
      },
      { field: "companyPhone", selector: (d) => d.companyPhone, validators: [Validators.required("رقم الهاتف مطلوب")] },
      {
        field: "email",
        selector: (d) => d.email,
        validators: [Validators.required("البريد الإلكتروني مطلوب")]
      },
      { field: "currencyId", selector: (d) => d.currencyId, validators: [Validators.required("العملة مطلوبة")] }
    ],
    []
  );
  const { formData, setFormData, getError, isInvalid, validate, clearError } = useEntityForm<Setting>(
    {},
    validationRules
  );

  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const currencyState = useAppSelector((state) => state.currency);
  const dispatch = useAppDispatch();
  const { fileInputRef, handleFileChange, handleRemoveFile } = useStorageFile<Partial<Setting>>(setFormData, "logo");

  useEffect(() =>
  {
    const fetchSettings = async () =>
    {
      setInitLoading(true);
      const response = await new SettingsApiService().Get();

      if (response.data)
      {
        setFormData(response.data);
        setInitLoading(false);
        dispatch(updateSetting(response.data));
      }
    };

    fetchSettings();
  }, []);

  useEffect(() =>
  {
    dispatch(filterCurrencies());
  }, [dispatch]);

  async function Save()
  {
    if (!validate())
    {
      return;
    }

    setLoading(true);

    const result = await new SettingsApiService().Update(formData as Setting);
    setLoading(false);

    if (result.status === 200)
    {
      setFormData(result.data as Setting);
      dispatch(updateSetting(result.data as Setting));
    }
  }

  if (initLoading)
  {
    return <div className="p-8 text-center text-muted-foreground">جاري تحميل الإعدادات...</div>;
  }

  return (
    <div className="container mx-auto py-5 px-5 max-w-4xl" dir="rtl">
      { /* HEADER */ }
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight">إعدادات النظام</h1>
        <p className="text-muted-foreground mt-2">إدارة بيانات الشركة ومعلومات الاشتراك</p>
      </div>

      <Card className="shadow-lg border-muted/40">
        <CardHeader>
          <CardTitle>البيانات الأساسية</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          { /* LOGO SECTION */ }
          <div className="flex flex-col md:flex-row items-center gap-6 p-4 rounded-lg border bg-muted/30">
            <Avatar className="h-28 w-28 border-4 border-background shadow">
              <AvatarImage
                src={ formData.logo?.status !== StorageFileStatus.Delete ? formData.logo?.url || "" : "" }
                className="object-cover"
              />
              <AvatarFallback className="bg-secondary">
                <Camera className="h-10 w-10 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-3 text-center md:text-right">
              <h3 className="text-base font-medium md:text-right text-center">شعار الشركة</h3>

              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                { (formData.logo?.url == undefined || formData.logo.status === StorageFileStatus.Delete) && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={ () => fileInputRef.current?.click() }
                  >
                    <Upload className="h-4 w-4 ml-2" />
                    رفع صورة
                  </Button>
                ) }

                { formData.logo?.url && formData.logo.status !== StorageFileStatus.Delete && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={ () => handleRemoveFile(0) }
                  >
                    <Trash2 className="h-4 w-4 ml-2" />
                    حذف
                  </Button>
                ) }
              </div>

              <p className="text-xs text-muted-foreground">PNG أو JPG — الحد الأقصى 2MB</p>

              <input
                type="file"
                ref={ fileInputRef }
                className="hidden"
                aria-label="تحميل شعار الشركة"
                accept="image/*"
                onChange={ handleFileChange }
              />
            </div>
          </div>

          <Separator />

          { /* BASIC INFO */ }
          <FieldGroup className="grid gap-6 md:grid-cols-2">
            <TextField
              label="اسم الشركة"
              value={ formData.companyName || "" }
              isInvalid={ isInvalid("companyName") }
              error={ getError("companyName") }
              onChange={ (e) =>
              {
                setFormData({ ...formData, companyName: e.target.value });
                clearError("companyName");
              } }
            />

            <TextField
              label="رقم الهاتف"
              value={ formData.companyPhone || "" }
              isInvalid={ isInvalid("companyPhone") }
              error={ getError("companyPhone") }
              onChange={ (e) =>
              {
                setFormData({ ...formData, companyPhone: e.target.value });
                clearError("companyPhone");
              } }
            />

            <TextField
              label="البريد الإلكتروني"
              type="email"
              dir="ltr"
              className="text-right"
              value={ formData.email || "" }
              isInvalid={ isInvalid("email") }
              error={ getError("email") }
              onChange={ (e) =>
              {
                setFormData({ ...formData, email: e.target.value });
                clearError("email");
              } }
            />

            <TextField
              label="رمز خدمة الإرسال (Email Key)"
              placeholder="أدخل الرمز الخاص بالخدمة"
              dir="ltr"
              className="text-right"
              value={ formData.emailKey || "" }
              onChange={ (e) => setFormData({ ...formData, emailKey: e.target.value }) }
            />

            <FormField label="العملة الافتراضية" isInvalid={ isInvalid("currencyId") } error={ getError("currencyId") }>
              <SelectInput
                placeholder="اختر العملة"
                value={ formData.currencyId?.toString() || "" }
                disabled={ currencyState.isLoading }
                isInvalid={ isInvalid("currencyId") }
                options={ currencyState.entities.data?.map((c) => ({ label: c.name, value: c.id.toString() })) || [] }
                onValueChange={ (val) =>
                {
                  setFormData({ ...formData, currencyId: Number(val) });
                  clearError("currencyId");
                } }
              />
            </FormField>
          </FieldGroup>

          <Separator />

          { /* SUBSCRIPTION */ }
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">تفاصيل الاشتراك</h3>

            <div className="grid md:grid-cols-3 gap-4 p-5 rounded-xl border bg-linear-to-br from-muted/40 to-muted/20 shadow-sm">
              { /* START DATE */ }
              <div className="flex flex-col gap-1 rounded-lg bg-background/60 p-4 border">
                <Label className="text-xs text-muted-foreground">تاريخ البدء</Label>
                <p className="text-lg font-semibold tracking-wide text-primary">
                  { formData.startDate ? format(new Date(formData.startDate), "dd/MM/yyyy") : "-" }
                </p>
              </div>

              { /* END DATE */ }
              <div className="flex flex-col gap-1 rounded-lg bg-background/60 p-4 border">
                <Label className="text-xs text-muted-foreground">تاريخ الانتهاء</Label>
                <p className="text-lg font-semibold tracking-wide text-primary">
                  { formData.endDate ? format(new Date(formData.endDate), "dd/MM/yyyy") : "-" }
                </p>
              </div>

              { /* TIME LEFT */ }
              <div className="flex flex-col gap-1 rounded-lg bg-background/60 p-4 border">
                <Label className="text-xs text-muted-foreground">المدة المتبقية</Label>

                { formData.endDate
                  ? (() =>
                  {
                    const daysLeft = differenceInDays(new Date(formData.endDate), new Date());

                    const statusColor = daysLeft > 10
                      ? "text-green-600 dark:text-green-400"
                      : daysLeft > 0
                      ? "text-yellow-600 dark:text-yellow-400"
                      : "text-red-600 dark:text-red-400";

                    const bgColor = daysLeft > 10
                      ? "bg-green-50 dark:bg-green-950/30"
                      : daysLeft > 0
                      ? "bg-yellow-50 dark:bg-yellow-950/30"
                      : "bg-red-50 dark:bg-red-950/30";

                    return (
                      <p className={ `text-lg font-bold px-2 py-1 rounded-md inline-block ${statusColor} ${bgColor}` }>
                        { daysLeft > 0 ? `متبقي ${daysLeft} يوم` : "منتهي" }
                      </p>
                    );
                  })()
                  : "-" }
              </div>
            </div>
          </div>

          { /* FOOTER */ }
          <div className="flex justify-end pt-4">
            <Button disabled={ loading } size="lg" className="px-10" onClick={ Save }>
              { loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" /> }
              حفظ التغييرات
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
