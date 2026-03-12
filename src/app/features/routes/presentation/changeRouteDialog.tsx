import SaveButton from "@/app/core/components/buttons/saveButton";
import DynamicListContainer from "@/app/core/components/containers/dynamicListContainer";
import type { CummonChangeDialogProps } from "@/app/core/components/dialogs/cummonChangeDialogProps";
import Loading from "@/app/core/components/loading/loading";
import SearchableSelect from "@/app/core/components/select/searchableSelect";
import { CityFilterColumns } from "@/app/core/data/city";
import { useDynamicList } from "@/app/core/hooks/useDynamicList";
import {
  useFormValidation,
  type ValidationRule,
} from "@/app/core/hooks/useFormValidation";
import RoutesApiService from "@/app/core/networking/services/routesApiService";
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
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Route, RouteStation } from "../data/route";

export default function ChangeRouteDialog({
  entity,
  mode,
  onSuccess,
}: CummonChangeDialogProps<Route>) {
  const [formData, setFormData] = useState<Partial<Route>>({
    routeStations: [],
  });

  const [initLoading, setInitLoading] = useState(false);

  useEffect(() => {
    if (mode === "update" && entity?.id) {

      setInitLoading(true);

      const getRoute = async () => {
        const service = new RoutesApiService();
        const res = await service.Get(entity.id);

        setFormData({
          id: res.data?.id,
          name: res.data?.name,
          fromCityId: res.data?.fromCityId,
          toCityId: res.data?.toCityId,
          fromCityName: res.data?.fromCityName,
          toCityName: res.data?.toCityName,
          routeStations: res.data?.routeStations || [],
        });

        setInitLoading(false);
      };

      getRoute();
    } else {
       
      setFormData((prev) => ({ ...prev, routeStations: [] }));
    }
  }, [entity?.id, mode]);

  const cityState = useAppSelector((state) => state.city);
  const dispatch = useAppDispatch();

  const validationRules: ValidationRule<Partial<Route>>[] = [
    {
      field: "name",
      selector: (d) => d.name,
      validators: [Validators.required("يرجى إدخال اسم الخط")],
    },
    {
      field: "fromCityId",
      selector: (d) => d.fromCityId,
      validators: [Validators.required("يرجى اختيار مدينة الانطلاق")],
    },
    {
      field: "toCityId",
      selector: (d) => d.toCityId,
      validators: [Validators.required("يرجى اختيار مدينة الوصول")],
    },
    {
      field: "stations",
      selector: (d) => d.routeStations,
      validators: [
        Validators.custom<RouteStation[]>((stations) => {
          return stations.every((s) => s.cityId && (s.period ?? 0) > 0);
        }, "يجب تحديد المدينة والمدة (أكبر من 0) لجميع المحطات"),
      ],
    },
  ];

  const { getError, isInvalid, validate, clearError, errorInputClass } = useFormValidation(
    formData,
    validationRules,
  );

  const { addRow, removeRow, updateRow } = useDynamicList("routeStations", setFormData, clearError);

  const handleAdd = () => addRow({ index: (formData.routeStations?.length || 0) + 1, period: 0, cityName: "" });

  if (initLoading) {
    return (
      <DialogContent dir="rtl" >
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "إضافة" : "تعديل"} خط</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Loading entityName="الخط"/>
      </DialogContent>
    );
  }

  return (
    <DialogContent dir="rtl" className="sm:max-w-xl">
      <DialogHeader>
        <DialogTitle>{mode === "create" ? "إضافة" : "تعديل"} خط</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>

      <Separator />

      <FieldGroup>
        <Field>
          <Label>رقم الخط</Label>
          <Input disabled value={entity?.id?.toString() || ""} />
        </Field>

        <Field>
          <Label>اسم الخط</Label>
          <Input
            value={formData.name || ""}
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
            <Label>من المدينة</Label>
            <SearchableSelect 
              items={cityState.entities.data ?? []} 
              itemLabelKey="name" 
              itemValueKey="id" 
              placeholder="اختر المدينة"
              value={formData.fromCityId?.toString() || ""} 
              onValueChange={(val) => {
                const selectedCity = cityState.entities.data?.find((c) => c.id.toString() === val);
                if (selectedCity) {
                  setFormData((prev) => ({
                    ...prev,
                    fromCityId: selectedCity.id,
                    fromCityName: selectedCity.name,
                  }));
                  clearError("fromCityId");
                }
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
                if (selectedCity) {
                  setFormData((prev) => ({
                    ...prev,
                    toCityId: selectedCity.id,
                    toCityName: selectedCity.name,
                  }));
                  clearError("toCityId");
                }
              }}
              columnsNames={CityFilterColumns.columnsNames}
              onSearch={(condition) => dispatch(filterCities(condition))} 
              errorInputClass={errorInputClass("toCityId")}
              disabled={cityState.isLoading}
            />
            {isInvalid("toCityId") && <span className="text-xs text-red-500">{getError("toCityId")}</span>}
          </Field>
        </div>

        <Separator />

        <DynamicListContainer
          title="محطات الخط"
          addLabel="إضافة محطة"
          emptyMessage="لا توجد محطات مضافة لهذا الخط بعد."
          items={formData.routeStations || []}
          onAdd={handleAdd}
          headers={["المدينة", "مدة الوصول (ساعة)"]}
          error={getError("stations")}
        >
          {(station: RouteStation, index) => {

            const hasGlobalError = !!getError("stations");
            const isCityMissing = !station.cityId;
            const isPeriodInvalid = (station.period ?? 0) <= 0;

            return (
              <div key={index} className="flex items-center gap-3 p-2 border rounded-md hover:bg-secondary/5 transition-colors">
                <div className="flex-1 cursor-pointer">
                  
                  <SearchableSelect 
                    items={cityState.entities.data ?? []} 
                    itemLabelKey="name" 
                    itemValueKey="id" 
                    placeholder="اختر المدينة"
                    value={station.cityId?.toString() || ""} 
                    onValueChange={(val) => {
                      updateRow(index, "cityId", Number(val));
                      
                      const city = cityState.entities.data?.find((c) => c.id.toString() === val);
                      if (city) {
                        updateRow(index, "cityName", city.name);
                      }
                    }}
                    columnsNames={CityFilterColumns.columnsNames}
                    onSearch={(condition) => dispatch(filterCities(condition))} 
                    errorInputClass={hasGlobalError && isCityMissing
                      ? "border-red-500 ring-red-500 text-red-900"
                      : ""}
                    disabled={cityState.isLoading}
                  />
                </div>

                <div className="w-24">
                  <Input
                    type="number"
                    step="0.1"
                    value={station.period ?? ""}
                    onChange={(e) => {
                      updateRow(index, "period", parseFloat(e.target.value) || 0);
                    }}
                    className={
                      hasGlobalError && isPeriodInvalid
                        ? "border-red-500 ring-red-500 text-red-900"
                        : ""
                    }
                  />
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-10 text-destructive hover:bg-destructive/10"
                  onClick={() => removeRow(index, "index")} // Pass "index" to reorder
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          }}
        </DynamicListContainer>

      </FieldGroup>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">إلغاء</Button>
        </DialogClose>
        <SaveButton
          formData={formData as Route}
          dialogMode={mode}
          service={new RoutesApiService()}
          disable={() => cityState.isLoading}
          onSuccess={(data) => onSuccess?.(data, mode)}
          validation={validate}
        />
      </DialogFooter>
    </DialogContent>
  );
}
