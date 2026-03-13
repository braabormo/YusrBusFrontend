import CrudPage from "./CrudPage";
import { useAppDispatch } from "@/app/core/state/hooks";
import { useAppSelector as useSelector } from "@/app/core/state/hooks";
import { Building, MapPin } from "lucide-react";
import {
  filter,
  refresh,
  setCurrentPage,
} from "@/app/features/branches/logic/branchSlice";
import {
  openBranchEditDialog,
  openBranchDeleteDialog,
  setIsBranchEditDialogOpen,
  setIsBranchDeleteDialogOpen,
} from "@/app/features/branches/logic/branchDialogSlice";
import Branch, {
  BranchFilterColumns,
} from "@/app/features/branches/data/branch";
import { SystemPermissionsResources } from "@/app/core/auth/systemPermissionsResources";
import BranchesApiService from "@/app/core/networking/services/branchesApiService";
import ChangeBranchDialog from "./changeBranchDialog";

const branchService = new BranchesApiService();

export default function SampleBranchPage() {
  const dispatch = useAppDispatch();
  const branchState = useSelector((state) => state.branch);
  const branchDialogState = useSelector((state) => state.branchDialog);

  return (
    <CrudPage<Branch>
      title="إدارة الفروع"
      entityName="الفرع"
      addNewItemTitle="إضافة فرع جديد"
      permissionResource={SystemPermissionsResources.Branches}
      entityState={branchState}
      useSlice={() => branchDialogState}
      service={branchService}
      cards={[
        {
          title: "إجمالي الفروع",
          data: (branchState.entities?.count ?? 0).toString(),
          icon: <Building className="h-4 w-4 text-muted-foreground" />,
        },
        {
          title: "المدن المغطاة",
          data: (4).toString(),
          icon: <MapPin className="h-4 w-4 text-muted-foreground" />,
        },
      ]}
      columnsToFilter={BranchFilterColumns.columnsNames}
      tableRowMapper={(branch: Branch) => [
        { rowName: `#${branch.id}`, rowStyles: "" },
        { rowName: branch.name, rowStyles: "font-semibold" },
        {
          rowName: branch.cityName,
          rowStyles:
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800",
        },
      ]}
      actions={{
        filter: filter,
        openEditDialog: (entity) => openBranchEditDialog(entity),
        openDeleteDialog: (entity) => openBranchDeleteDialog(entity),
        setIsEditDialogOpen: (open) => setIsBranchEditDialogOpen(open),
        setIsDeleteDialogOpen: (open) => setIsBranchDeleteDialogOpen(open),
        refresh: refresh,
        setCurrentPage: (page) => setCurrentPage(page),
      }}
      tableHeadRows={[
        { rowName: "", rowStyles: "text-left w-12.5" },
        { rowName: "رقم الفرع", rowStyles: "w-30" },
        { rowName: "اسم الفرع", rowStyles: "" },
        { rowName: "المدينة", rowStyles: "" },
      ]}
      AddNewChangeDialog={
        <ChangeBranchDialog
          entity={undefined}
          mode="create"
          onSuccess={(newData) => dispatch(refresh({ newData }))}
        />
      }
      UpdateChangeDialog={
        <ChangeBranchDialog
          entity={branchDialogState.selectedRow || undefined}
          mode={branchDialogState.selectedRow ? "update" : "create"}
          onSuccess={(data, mode) => {
            dispatch(refresh({ newData: data }));
            if (mode === "create") dispatch(setIsBranchEditDialogOpen(false));
          }}
        />
      }
    />
  );
}
