import SaveButton from "@/app/core/components/buttons/saveButton";
import DynamicListContainer from "@/app/core/components/containers/dynamicListContainer";
import type { CummonChangeDialogProps } from "@/app/core/components/dialogs/cummonChangeDialogProps";
import SearchableSelect from "@/app/core/components/select/searchableSelect";
import { useDynamicList } from "@/app/core/hooks/useDynamicList";
import useEntities from "@/app/core/hooks/useEntities";
import {
  useFormValidation,
  type ValidationRule,
} from "@/app/core/hooks/useFormValidation";
import BranchesApiService from "@/app/core/networking/services/branchesApiService";
import RolesApiService from "@/app/core/networking/services/rolesApiService";
import UsersApiService from "@/app/core/networking/services/usersApiService";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { BranchFilterColumns } from "../../branches/data/branch";
import { RoleFilterColumns } from "../../roles/data/role";
import type User from "../data/user";
import type { UserBranch } from "../data/user";

export default function ChangeUserDialog({
  entity,
  mode,
  onSuccess,
}: CummonChangeDialogProps<User>) {
  const [formData, setFormData] = useState<Partial<User>>({
    id: entity?.id,
    username: entity?.username || "",
    password: "",
    isActive: entity?.isActive ?? true,
    roleId: entity?.roleId,
    role: entity?.role,
    userBranches: entity?.userBranches || [],
  });

  const validationRules: ValidationRule<Partial<User>>[] = [
    {
      field: "username",
      selector: (d) => d.username,
      validators: [Validators.required("يرجى اختيار اسم المستخدم")],
    },
    {
      field: "password",
      selector: (d) => d.password,
      validators: [Validators.required("يرجى اختيار كلمة مرور")],
    },
    {
      field: "roleId",
      selector: (d) => d.roleId,
      validators: [Validators.required("يرجى اختيار دور")],
    },
    {
      field: "userBranches",
      selector: (d) => d.userBranches,
      validators: [
        Validators.arrayMinLength(
          1,
          "يجب أن ينتمي المستخدم إلى فرع واحد على الاقل",
        ),
      ],
    },
  ];
  const { getError, isInvalid, validate, clearError, errorInputClass } =
    useFormValidation(formData, validationRules);

  const {
    entities: branches,
    filter: filterBranches,
    isLoading: fetchingBranches,
  } = useEntities(new BranchesApiService());
  const {
    entities: roles,
    filter: filterRoles,
    isLoading: fetchingRoles,
  } = useEntities(new RolesApiService());
  const { addRow, removeRow } = useDynamicList(
    "userBranches",
    setFormData,
    clearError,
  );

  const handleAdd = () =>
    addRow({ userId: formData.id, branchId: 0, branchName: "", username: "" });

  return (
    <DialogContent dir="rtl" className="sm:max-w-xl">
      <DialogHeader>
        <DialogTitle>
          {mode === "create" ? "إضافة" : "تعديل"} مستخدم
        </DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>

      <Separator />

      <FieldGroup>
        <Field>
          <Label>رقم المستخدم</Label>
          <Input disabled value={formData.id?.toString() || ""} />
        </Field>

        <Field>
          <Label>اسم المستخدم</Label>
          <Input
            value={formData.username || ""}
            onChange={(e) => {
              setFormData({ ...formData, username: e.target.value });
              clearError("username");
            }}
            className={errorInputClass("username")}
          />
          {isInvalid("username") && (
            <span className="text-xs text-red-500">{getError("username")}</span>
          )}
        </Field>

        <Field>
          <Label>كلمة المرور</Label>
          <Input
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
              clearError("password");
            }}
            className={errorInputClass("password")}
          />
          {isInvalid("password") && (
            <span className="text-xs text-red-500">{getError("password")}</span>
          )}
        </Field>

        <Field>
          <Label>الدور</Label>
          <SearchableSelect
            items={roles?.data ?? []}
            itemLabelKey="name"
            itemValueKey="id"
            placeholder="اختر الدور"
            value={formData.roleId?.toString() || ""}
            onValueChange={(val) => {
              const selectedRole = roles?.data?.find(
                (c) => c.id.toString() === val,
              );
              if (selectedRole) {
                setFormData((prev) => ({
                  ...prev,
                  roleId: selectedRole.id,
                  role: selectedRole,
                }));
                clearError("roleId");
              }
            }}
            columnsNames={RoleFilterColumns.columnsNames}
            onSearch={(condition) => filterRoles(condition)}
            errorInputClass={errorInputClass("roleId")}
            disabled={fetchingRoles}
          />
          {isInvalid("roleId") && (
            <span className="text-xs text-red-500">{getError("roleId")}</span>
          )}
        </Field>

        <Field>
          <Label>حالة المستخدم</Label>
          <Select
            dir="rtl"
            value={formData.isActive ? "نشط" : "غير نشط"}
            onValueChange={(val) =>
              setFormData({
                ...formData,
                isActive: val == "نشط" ? true : false,
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="نشط">نشط</SelectItem>
              <SelectItem value="غير نشط">غير نشط</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <DynamicListContainer
          title="الفروع المسموح باستخدامها"
          addLabel="إضافة فرع"
          emptyMessage="لا توجد فروع مضافة لهذا المستخدم بعد."
          items={formData.userBranches || []}
          onAdd={handleAdd}
          headers={["الفرع"]}
          error={getError("userBranches")}
        >
          {(userBranch: UserBranch, index) => {
            const hasGlobalError = !!getError("userBranches");
            const isBranchMissing = !userBranch.branchId;

            const assignedIds =
              formData.userBranches?.map((ub) => ub.branchId) || [];

            let currentOptions =
              branches?.data?.filter((b) => {
                const isNotAssignedAtAll = !assignedIds.includes(b.id);
                const isSelectedInThisRow = b.id === userBranch.branchId;

                return isNotAssignedAtAll || isSelectedInThisRow;
              }) ?? [];

            // 3. SAFETY NET: Explicitly double-check that the currently selected item is in the list.
            // This prevents the label from disappearing during delete/re-render cycles if the
            // filter logic above gets out of sync with the rendered index.
            if (userBranch.branchId) {
              const selectedBranchInData = branches?.data?.find(
                (b) => b.id === userBranch.branchId,
              );
              const isAlreadyInOptions = currentOptions.some(
                (b) => b.id === userBranch.branchId,
              );

              if (selectedBranchInData && !isAlreadyInOptions) {
                currentOptions = [selectedBranchInData, ...currentOptions];
              }
            }

            return (
              <div
                key={userBranch.id || `row-${index}`}
                className="flex items-center gap-3 p-2 border rounded-md hover:bg-secondary/5 transition-colors"
              >
                <div className="flex-1 cursor-pointer">
                  <SearchableSelect
                    items={currentOptions}
                    itemLabelKey="name"
                    itemValueKey="id"
                    placeholder="اختر الفرع"
                    value={userBranch.branchId?.toString() || ""}
                    onValueChange={(val) => {
                      const newBranchId = Number(val);
                      const branch = branches?.data?.find(
                        (c) => c.id === newBranchId,
                      );
                      const newBranchName = branch ? branch.name : "";

                      setFormData((prev) => {
                        const updatedBranches = [...(prev.userBranches || [])];

                        updatedBranches[index] = {
                          ...updatedBranches[index],
                          branchId: newBranchId,
                          branchName: newBranchName,
                        };

                        return { ...prev, userBranches: updatedBranches };
                      });

                      clearError("userBranches");
                    }}
                    columnsNames={BranchFilterColumns.columnsNames}
                    onSearch={(condition) => filterBranches(condition)}
                    errorInputClass={
                      hasGlobalError && isBranchMissing
                        ? "border-red-500 ring-red-500 text-red-900"
                        : ""
                    }
                    disabled={fetchingBranches}
                  />
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-10 text-destructive hover:bg-destructive/10"
                  onClick={() => removeRow(index)}
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
          formData={formData as User}
          dialogMode={mode}
          service={new UsersApiService()}
          onSuccess={onSuccess}
          validation={validate}
        />
      </DialogFooter>
    </DialogContent>
  );
}
