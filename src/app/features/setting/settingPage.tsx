import { useSetting } from "@/app/core/contexts/settingContext";
import { Setting } from "@/app/core/data/setting";
import { StorageFileStatus } from "@/app/core/data/storageFile";
import useCurrencies from "@/app/core/hooks/useCurrencies";
import {
  useFormValidation,
  type ValidationRule,
} from "@/app/core/hooks/useFormValidation";
import useStorageFile from "@/app/core/hooks/useStorageFile";
import SettingsApiService from "@/app/core/networking/services/settingsApiService";
import { Validators } from "@/app/core/utils/validators";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { differenceInDays, format } from "date-fns";
import { Camera, Loader2, Trash2, Upload } from "lucide-react";
import { useEffect, useState } from "react";

export default function SettingPage() {
  const validationRules: ValidationRule<Setting>[] = [
    {
      field: "companyName",
      selector: (d) => d.companyName,
      validators: [Validators.required("اسم الشركة مطلوب")],
    },
    {
      field: "companyPhone",
      selector: (d) => d.companyPhone,
      validators: [Validators.required("رقم الهاتف مطلوب")],
    },
    {
      field: "email",
      selector: (d) => d.email,
      validators: [Validators.required("البريد الإلكتروني مطلوب")],
    },
    {
      field: "currencyId",
      selector: (d) => d.currencyId,
      validators: [Validators.required("العملة مطلوبة")],
    },
  ];

  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const [formData, setFormData] = useState<Setting>(new Setting());
  const { currencies, fetchingCurrencies } = useCurrencies();
  const { fileInputRef, handleFileChange, handleRemoveFile } =
    useStorageFile<Setting>(setFormData, 'logo');
  const { isInvalid, validate, clearError, errorInputClass, getError } =
    useFormValidation(formData, validationRules);
  const { updateSetting } = useSetting();

  useEffect(() => {
    const fetchSettings = async () => {
      setInitLoading(true);
      const response = await new SettingsApiService().Get();

      if (response.data) {
        setFormData(response.data);
        setInitLoading(false);
        updateSetting(response.data);
      }
    };

    fetchSettings();
  }, []);

  async function Save() {
    if (!validate()) return;

    setLoading(true);

    const result = await new SettingsApiService().Update(formData);
    setLoading(false);

    if (result.status === 200) {
      setFormData(result.data as Setting);
      updateSetting(result.data as Setting);
    }
  }

  if (initLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        جاري تحميل الإعدادات...
      </div>
    );
  }

  return (
    <div className="container mx-auto py-5 px-5 max-w-4xl" dir="rtl">
      {/* HEADER */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight">إعدادات النظام</h1>
        <p className="text-muted-foreground mt-2">
          إدارة بيانات الشركة ومعلومات الاشتراك
        </p>
      </div>

      <Card className="shadow-lg border-muted/40">
        <CardHeader>
          <CardTitle>البيانات الأساسية</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* LOGO SECTION */}
          <div className="flex flex-col md:flex-row items-center gap-6 p-4 rounded-lg border bg-muted/30">
            <Avatar className="h-28 w-28 border-4 border-background shadow">
              <AvatarImage
                src={formData.logo?.status !== StorageFileStatus.Delete? formData.logo?.url || "" : ""}
                className="object-cover"
              />
              <AvatarFallback className="bg-secondary">
                <Camera className="h-10 w-10 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-3 text-center md:text-right">
              <h3 className="text-base font-medium md:text-right text-center">
                شعار الشركة
              </h3>

              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 ml-2" />
                  رفع صورة
                </Button>

                {formData.logo?.url && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveFile}
                  >
                    <Trash2 className="h-4 w-4 ml-2" />
                    حذف
                  </Button>
                )}
              </div>

              <p className="text-xs text-muted-foreground">
                PNG أو JPG — الحد الأقصى 2MB
              </p>

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                aria-label="تحميل شعار الشركة"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <Separator />

          {/* BASIC INFO */}
          <FieldGroup className="grid gap-6 md:grid-cols-2">
            <Field>
              <Label>اسم الشركة</Label>
              <Input
                value={formData.companyName || ""}
                onChange={(e) => {
                  setFormData({ ...formData, companyName: e.target.value });
                  clearError("companyName");
                }}
                className={errorInputClass("companyName")}
              />
              {isInvalid("companyName") && (
                <span className="text-xs text-destructive">
                  {getError("companyName")}
                </span>
              )}
            </Field>

            <Field>
              <Label>رقم الهاتف</Label>
              <Input
                value={formData.companyPhone || ""}
                onChange={(e) => {
                  setFormData({ ...formData, companyPhone: e.target.value });
                  clearError("companyPhone");
                }}
                className={errorInputClass("companyPhone")}
              />
              {isInvalid("companyPhone") && (
                <span className="text-xs text-destructive">
                  {getError("companyPhone")}
                </span>
              )}
            </Field>

            <Field>
              <Label>البريد الإلكتروني</Label>
              <Input
                type="email"
                style={{ direction: "ltr", textAlign: "right" }}
                value={formData.email || ""}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  clearError("email");
                }}
                className={errorInputClass("email")}
              />
              {isInvalid("email") && (
                <span className="text-xs text-destructive">
                  {getError("email")}
                </span>
              )}
            </Field>

            <Field>
              <Label>العملة</Label>
              <Select
                dir="rtl"
                value={formData.currencyId?.toString() || ""}
                onValueChange={(val) => {
                  const selected = currencies.find(
                    (c) => c.id.toString() === val,
                  );
                  if (selected) {
                    setFormData((prev) => ({
                      ...prev,
                      fromCityId: selected.id,
                      fromCityName: selected.name,
                    }));
                    clearError("currencyId");
                  }
                }}
                disabled={fetchingCurrencies}
              >
                <SelectTrigger className={errorInputClass("currencyId")}>
                  <SelectValue placeholder="اختر العملة" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem
                      key={currency.id}
                      value={currency.id.toString()}
                    >
                      {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isInvalid("currencyId") && (
                <span className="text-xs text-destructive">
                  {getError("currencyId")}
                </span>
              )}
            </Field>
          </FieldGroup>

          <Separator />

          {/* SUBSCRIPTION */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">تفاصيل الاشتراك</h3>

            <div className="grid md:grid-cols-3 gap-4 p-5 rounded-xl border bg-linear-to-br from-muted/40 to-muted/20 shadow-sm">
              {/* START DATE */}
              <div className="flex flex-col gap-1 rounded-lg bg-background/60 p-4 border">
                <Label className="text-xs text-muted-foreground">
                  تاريخ البدء
                </Label>
                <p className="text-lg font-semibold tracking-wide text-primary">
                  {formData.startDate
                    ? format(new Date(formData.startDate), "dd/MM/yyyy")
                    : "-"}
                </p>
              </div>

              {/* END DATE */}
              <div className="flex flex-col gap-1 rounded-lg bg-background/60 p-4 border">
                <Label className="text-xs text-muted-foreground">
                  تاريخ الانتهاء
                </Label>
                <p className="text-lg font-semibold tracking-wide text-primary">
                  {formData.endDate
                    ? format(new Date(formData.endDate), "dd/MM/yyyy")
                    : "-"}
                </p>
              </div>

              {/* TIME LEFT */}
              <div className="flex flex-col gap-1 rounded-lg bg-background/60 p-4 border">
                <Label className="text-xs text-muted-foreground">
                  المدة المتبقية
                </Label>

                {formData.endDate
                  ? (() => {
                      const daysLeft = differenceInDays(
                        new Date(formData.endDate),
                        new Date(),
                      );

                      const statusColor =
                        daysLeft > 10
                          ? "text-green-600 dark:text-green-400"
                          : daysLeft > 0
                            ? "text-yellow-600 dark:text-yellow-400"
                            : "text-red-600 dark:text-red-400";

                      const bgColor =
                        daysLeft > 10
                          ? "bg-green-50 dark:bg-green-950/30"
                          : daysLeft > 0
                            ? "bg-yellow-50 dark:bg-yellow-950/30"
                            : "bg-red-50 dark:bg-red-950/30";

                      return (
                        <p
                          className={`text-lg font-bold px-2 py-1 rounded-md inline-block ${statusColor} ${bgColor}`}
                        >
                          {daysLeft > 0 ? `متبقي ${daysLeft} يوم` : "منتهي"}
                        </p>
                      );
                    })()
                  : "-"}
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end pt-4">
            <Button
              disabled={loading}
              size="lg"
              className="px-10"
              onClick={Save}
            >
              {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              حفظ التغييرات
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
