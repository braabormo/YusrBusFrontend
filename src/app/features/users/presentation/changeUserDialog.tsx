import SaveButton from "@/app/core/components/buttons/saveButton";
import type { CommonChangeDialogProps } from "@/app/core/components/dialogs/commonChangeDialogProps";
import { FormField } from "@/app/core/components/fields/formField";
import { PasswordField } from "@/app/core/components/fields/passwordField";
import { SelectField } from "@/app/core/components/fields/selectField";
import { TextField } from "@/app/core/components/fields/textField";
import SearchableSelect from "@/app/core/components/select/searchableSelect";
import useEntities from "@/app/core/hooks/useEntities";
import { useEntityForm } from "@/app/core/hooks/useEntityForm";
import { type ValidationRule } from "@/app/core/hooks/useFormValidation";
import BranchesApiService from "@/app/core/networking/services/branchesApiService";
import RolesApiService from "@/app/core/networking/services/rolesApiService";
import { Validators } from "@/app/core/utils/validators";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { useMemo } from "react";
import { RoleFilterColumns } from "../../roles/data/role";
import type User from "../data/user";

export default function ChangeUserDialog({ entity, mode, service, onSuccess }: CommonChangeDialogProps<User>)
{
  const validationRules: ValidationRule<Partial<User>>[] = useMemo(
    () => [
      {
        field: "username",
        selector: (d) => d.username,
        validators: [Validators.required("يرجى إدخال اسم المستخدم")]
      },
      { field: "password", selector: (d) => d.password, validators: [Validators.required("يرجى إدخال كلمة مرور")] },
      {
        field: "roleId",
        selector: (d) => d.roleId,
        validators: [Validators.required("يرجى اختيار دور")]
      },
      { field: "branchId", selector: (d) => d.branchId, validators: [Validators.required("يرجى اختيار فرع")] }
    ],
    []
  );
  const { formData, handleChange, getError, isInvalid, validate, errorInputClass } = useEntityForm<User>({
    ...entity,
    password: ""
  }, validationRules);
  const { entities: branches, filter: filterBranches, isLoading: fetchingBranches } = useEntities(
    new BranchesApiService()
  );
  const { entities: roles, filter: filterRoles, isLoading: fetchingRoles } = useEntities(new RolesApiService());

  return (
    <DialogContent dir="rtl" className="sm:max-w-xl">
      <DialogHeader>
        <DialogTitle>{ mode === "create" ? "إضافة" : "تعديل" } مستخدم</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>

      <Separator />

      <FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="اسم المستخدم"
            required
            value={ formData.username || "" }
            onChange={ (e) => handleChange("username", e.target.value) }
            isInvalid={ isInvalid("username") }
            error={ getError("username") }
          />

          <PasswordField
            label="كلمة المرور"
            required
            value={ formData.password || "" }
            onChange={ (e) => handleChange("password", e.target.value) }
            isInvalid={ isInvalid("password") }
            error={ getError("password") }
          />
        </div>

        <FormField label="الدور" required isInvalid={ isInvalid("roleId") } error={ getError("roleId") }>
          <SearchableSelect
            items={ roles?.data ?? [] }
            itemLabelKey="name"
            itemValueKey="id"
            placeholder="اختر الدور"
            value={ formData.roleId?.toString() || "" }
            columnsNames={ RoleFilterColumns.columnsNames }
            onSearch={ (condition) => filterRoles(condition) }
            errorInputClass={ errorInputClass("roleId") }
            disabled={ fetchingRoles }
            onValueChange={ (val) =>
            {
              const selected = roles?.data?.find((r) => r.id.toString() === val);
              if (selected)
              {
                handleChange("roleId", selected.id);
                handleChange("role", selected);
              }
            } }
          />
        </FormField>

        <FormField label="الفرع" required isInvalid={ isInvalid("branchId") } error={ getError("branchId") }>
          <SearchableSelect
            items={ branches?.data ?? [] }
            itemLabelKey="name"
            itemValueKey="id"
            placeholder="اختر الفرع"
            value={ formData.branchId?.toString() || "" }
            columnsNames={ RoleFilterColumns.columnsNames }
            onSearch={ (condition) => filterBranches(condition) }
            errorInputClass={ errorInputClass("branchId") }
            disabled={ fetchingBranches }
            onValueChange={ (val) =>
            {
              const selected = branches?.data?.find((b) => b.id.toString() === val);
              if (selected)
              {
                handleChange("branchId", selected.id);
                handleChange("branch", selected);
              }
            } }
          />
        </FormField>

        <SelectField
          label="حالة المستخدم"
          value={ formData.isActive ? "active" : "inactive" }
          onValueChange={ (val) => handleChange("isActive", val === "active") }
          required={ true }
          options={ [{ label: "نشط", value: "active" }, { label: "غير نشط", value: "inactive" }] }
        />
      </FieldGroup>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">إلغاء</Button>
        </DialogClose>

        <SaveButton
          formData={ formData as User }
          dialogMode={ mode }
          service={ service }
          onSuccess={ (data) => onSuccess?.(data, mode) }
          validate={ validate }
        />
      </DialogFooter>
    </DialogContent>
  );
}
