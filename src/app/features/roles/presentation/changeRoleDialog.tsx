import { SystemPermissionsResources } from "@/app/core/auth/systemPermissionsResources";
import SaveButton from "@/app/core/components/buttons/saveButton";
import type { CommonChangeDialogProps } from "@/app/core/components/dialogs/commonChangeDialogProps";
import { TextField } from "@/app/core/components/fields/textField";
import { useEntityForm } from "@/app/core/hooks/useEntityForm";
import { type ValidationRule } from "@/app/core/hooks/useFormValidation";
import RolesApiService from "@/app/core/networking/services/rolesApiService";
import { useAppDispatch, useAppSelector } from "@/app/core/state/hooks";
import { fetchSystemPermissions } from "@/app/core/state/shared/systemSlice";
import { Validators } from "@/app/core/utils/validators";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import type { Role } from "../data/role";
import { categorizePermissions, PermissionCard } from "./permissionCard";
import { ActionIcons, ArabicLabels, PERMISSION_SECTIONS } from "./permissionConfig";
import { PermissionSkeleton } from "./permissionSkeleton";

export default function ChangeRoleDialog({ entity, mode, onSuccess }: CommonChangeDialogProps<Role>)
{
  const validationRules: ValidationRule<Partial<Role>>[] = useMemo(
    () => [{ field: "name", selector: (d) => d.name, validators: [Validators.required("يرجى اختيار اسم للدور")] }],
    []
  );
  const { formData, setFormData, getError, isInvalid, validate, clearError } = useEntityForm<Role>(
    entity,
    validationRules
  );
  const systemState = useAppSelector((state) => state.system);
  const dispatch = useAppDispatch();

  useEffect(() =>
  {
    if (systemState.permissions.length === 0)
    {
      dispatch(fetchSystemPermissions());
    }
  }, [dispatch, systemState.permissions.length]);

  const categorized = useMemo(() =>
  {
    return PERMISSION_SECTIONS.map((section) => ({
      ...section,
      data: categorizePermissions(systemState.permissions, section.resources)
    }));
  }, [systemState.permissions]);

  return (
    <DialogContent aria-describedby={ undefined } dir="rtl" className="sm:max-w-6xl max-h-[90vh] flex flex-col">
      <DialogHeader>
        <DialogTitle>{ mode === "create" ? "إضافة" : "تعديل" } دور</DialogTitle>
        { systemState.isLoading && 
        <Loader2 className="inline-block mr-2 h-4 w-4 animate-spin text-muted-foreground" /> }
      </DialogHeader>

      <Separator />

      <div className="flex-1 overflow-y-auto py-4 px-1">
        <FieldGroup className="space-y-8">
          <TextField
            label="اسم الدور"
            required
            value={ formData.name || "" }
            isInvalid={ isInvalid("name") }
            error={ getError("name") }
            onChange={ (e) =>
            {
              setFormData({ ...formData, name: e.target.value });
              clearError("name");
            } }
          />

          { systemState.isLoading
            ? (
              <div className="space-y-8">
                <section className="space-y-4">
                  <Skeleton className="h-6 w-40" />
                  { PermissionSkeleton() }
                </section>
              </div>
            )
            : (
              <>
                { categorized.map((section) => (
                  <section key={ section.id } className="space-y-4">
                    <div className="flex items-center gap-2 text-primary font-bold">
                      { section.icon } <span>{ section.title }</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      { section.data.map((item) => (
                        <PermissionCard
                          key={ item.resource }
                          resourceId={ item.resource }
                          label={ ArabicLabels[item.resource] || item.resource }
                          masterPermission={ item.get }
                          isMasterRequired={ item.resource === SystemPermissionsResources.Settings }
                          selectedPermissions={ formData.permissions || [] }
                          onToggle={ (updated) => setFormData({ ...formData, permissions: updated }) }
                          actions={ item.actions.map((perm) => ({
                            id: perm,
                            label: ArabicLabels[perm.split(":")[1]] || perm.split(":")[1],
                            icon: ActionIcons[perm.split(":")[1]]
                          })) }
                        />
                      )) }
                    </div>
                  </section>
                )) }
              </>
            ) }
        </FieldGroup>
      </div>

      <DialogFooter className="gap-2">
        <DialogClose asChild>
          <Button variant="outline">إلغاء</Button>
        </DialogClose>
        <SaveButton
          formData={ formData as Role }
          dialogMode={ mode }
          service={ new RolesApiService() }
          onSuccess={ (data) => onSuccess?.(data, mode) }
          validate={ validate }
        />
      </DialogFooter>
    </DialogContent>
  );
}
