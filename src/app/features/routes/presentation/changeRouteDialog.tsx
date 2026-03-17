import SaveButton from "@/app/core/components/buttons/saveButton";
import DynamicListContainer from "@/app/core/components/containers/dynamicListContainer";
import type { CommonChangeDialogProps } from "@/app/core/components/dialogs/commonChangeDialogProps";
import { FormField } from "@/app/core/components/fields/formField";
import { TextField } from "@/app/core/components/fields/textField";
import { NumberInput } from "@/app/core/components/input/numberInput";
import Loading from "@/app/core/components/loading/loading";
import SearchableSelect from "@/app/core/components/select/searchableSelect";
import { CityFilterColumns } from "@/app/core/data/city";
import { useDynamicList } from "@/app/core/hooks/useDynamicList";
import { useEntityForm } from "@/app/core/hooks/useEntityForm";
import { type ValidationRule } from "@/app/core/hooks/useFormValidation";
import { useAppDispatch, useAppSelector } from "@/app/core/state/hooks";
import { filterCities } from "@/app/core/state/shared/citySlice";
import { Validators } from "@/app/core/utils/validators";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Route, RouteStation } from "../data/route";

export default function ChangeRouteDialog({ entity, mode, service, onSuccess }: CommonChangeDialogProps<Route>)
{
  const cityState = useAppSelector((state) => state.city);
  const dispatch = useAppDispatch();

  const validationRules: ValidationRule<Partial<Route>>[] = useMemo(
    () => [{
      field: "name",
      selector: (d) => d.name,
      validators: [Validators.required("يرجى إدخال اسم الخط")]
    }, {
      field: "fromCityId",
      selector: (d) => d.fromCityId,
      validators: [Validators.required("يرجى اختيار مدينة الانطلاق")]
    }, {
      field: "toCityId",
      selector: (d) => d.toCityId,
      validators: [Validators.required("يرجى اختيار مدينة الوصول")]
    }, {
      field: "stations",
      selector: (d) => d.routeStations,
      validators: [Validators.custom<RouteStation[]>((stations) =>
      {
        return stations.every((s) => s.cityId && (s.period ?? 0) > 0);
      }, "يجب تحديد المدينة والمدة لجميع المحطات")]
    }],
    []
  );

  const { formData, setFormData, handleChange, getError, isInvalid, validate, clearError } = useEntityForm<Route>(
    entity,
    validationRules
  );
  const [initLoading, setInitLoading] = useState(false);
  const { addRow, removeRow, updateRow } = useDynamicList("routeStations", setFormData, clearError);

  const handleAdd = () => addRow({ index: (formData.routeStations?.length || 0) + 1, period: 0, cityName: "" });

  useEffect(() =>
  {
    if (mode === "update" && entity?.id)
    {
      setInitLoading(true);

      const getRoute = async () =>
      {
        const res = await service.Get(entity.id);
        setFormData({ ...res.data });
        setInitLoading(false);
      };

      getRoute();
    }
    else
    {
      setFormData((prev) => ({ ...prev, routeStations: [] }));
    }
  }, [entity?.id, mode]);

  useEffect(() =>
  {
    dispatch(filterCities(undefined));
  }, [dispatch]);

  if (initLoading)
  {
    return (
      <DialogContent dir="rtl">
        <DialogHeader>
          <DialogTitle>{ mode === "create" ? "إضافة" : "تعديل" } خط</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Loading entityName="الخط" />
      </DialogContent>
    );
  }

  return (
    <DialogContent dir="rtl" className="sm:max-w-xl">
      <DialogHeader>
        <DialogTitle>{ mode === "create" ? "إضافة" : "تعديل" } خط</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>

      <Separator />

      <FieldGroup>
        <TextField
          label="اسم الخط"
          required
          value={ formData.name || "" }
          onChange={ (e) => handleChange("name", e.target.value) }
          isInvalid={ isInvalid("name") }
          error={ getError("name") }
        />

        <div className="flex gap-3">
          <FormField label="من المدينة" required isInvalid={ isInvalid("fromCityId") } error={ getError("fromCityId") }>
            <SearchableSelect
              items={ cityState.entities.data ?? [] }
              itemLabelKey="name"
              itemValueKey="id"
              placeholder="اختر المدينة"
              value={ formData.fromCityId?.toString() || "" }
              onValueChange={ (val) =>
              {
                const city = cityState.entities.data?.find((c) => c.id.toString() === val);
                if (city)
                {
                  setFormData((prev) => ({ ...prev, fromCityId: city.id, fromCityName: city.name }));
                  clearError("fromCityId");
                }
              } }
              columnsNames={ CityFilterColumns.columnsNames }
              onSearch={ (condition) => dispatch(filterCities(condition)) }
              disabled={ cityState.isLoading }
            />
          </FormField>

          <FormField label="إلى المدينة" required isInvalid={ isInvalid("toCityId") } error={ getError("toCityId") }>
            <SearchableSelect
              items={ cityState.entities.data ?? [] }
              itemLabelKey="name"
              itemValueKey="id"
              placeholder="اختر المدينة"
              value={ formData.toCityId?.toString() || "" }
              onValueChange={ (val) =>
              {
                const city = cityState.entities.data?.find((c) => c.id.toString() === val);
                if (city)
                {
                  setFormData((prev) => ({ ...prev, toCityId: city.id, toCityName: city.name }));
                  clearError("toCityId");
                }
              } }
              columnsNames={ CityFilterColumns.columnsNames }
              onSearch={ (condition) => dispatch(filterCities(condition)) }
              disabled={ cityState.isLoading }
            />
          </FormField>
        </div>

        <Separator />

        <DynamicListContainer
          title="محطات الخط"
          addLabel="إضافة محطة"
          emptyMessage="لا توجد محطات مضافة لهذا الخط بعد."
          items={ formData.routeStations || [] }
          onAdd={ handleAdd }
          headers={ ["المدينة", "مدة الوصول (ساعة)"] }
          error={ getError("stations") }
        >
          { (station: RouteStation, index) =>
          {
            const hasGlobalError = !!getError("stations");
            const isCityMissing = !station.cityId;
            const isPeriodInvalid = (station.period ?? 0) <= 0;

            return (
              <div
                key={ index }
                className="flex items-center gap-3 p-2 border rounded-md hover:bg-secondary/5 transition-colors"
              >
                <div className="flex-1 cursor-pointer">
                  <SearchableSelect
                    items={ cityState.entities.data ?? [] }
                    itemLabelKey="name"
                    itemValueKey="id"
                    placeholder="اختر المدينة"
                    value={ station.cityId?.toString() || "" }
                    onValueChange={ (val) =>
                    {
                      updateRow(index, "cityId", Number(val));

                      const city = cityState.entities.data?.find((c) => c.id.toString() === val);
                      if (city)
                      {
                        updateRow(index, "cityName", city.name);
                      }
                    } }
                    columnsNames={ CityFilterColumns.columnsNames }
                    onSearch={ (condition) => dispatch(filterCities(condition)) }
                    errorInputClass={ hasGlobalError && isCityMissing
                      ? "border-red-500 ring-red-500 text-red-900"
                      : "" }
                    disabled={ cityState.isLoading }
                  />
                </div>

                <div className="w-24">
                  <NumberInput
                    step="0.1"
                    placeholder="0.0"
                    value={ station.period ?? "" }
                    isInvalid={ hasGlobalError && isPeriodInvalid }
                    onChange={ (val) =>
                    {
                      updateRow(index, "period", val);
                    } }
                  />
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-10 text-destructive hover:bg-destructive/10"
                  onClick={ () => removeRow(index, "index") } // Pass "index" to reorder
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          } }
        </DynamicListContainer>
      </FieldGroup>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">إلغاء</Button>
        </DialogClose>
        <SaveButton
          formData={ formData as Route }
          dialogMode={ mode }
          service={ service }
          disable={ () => cityState.isLoading }
          onSuccess={ (data) => onSuccess?.(data, mode) }
          validate={ validate }
        />
      </DialogFooter>
    </DialogContent>
  );
}
