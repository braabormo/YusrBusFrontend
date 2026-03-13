import { SystemPermissionsResources } from "@/app/core/auth/systemPermissionsResources";
import BranchesApiService from "@/app/core/networking/services/branchesApiService";
import { useAppDispatch, useAppSelector } from "@/app/core/state/hooks";
import Branch, {
  BranchFilterColumns,
} from "@/app/features/branches/data/branch";
import {
  openBranchChangeDialog,
  openBranchDeleteDialog,
  setIsBranchChangeDialogOpen,
  setIsBranchDeleteDialogOpen,
} from "@/app/features/branches/logic/branchDialogSlice";
import {
  filterBranches,
  refreshBranches,
  setCurrentBranchesPage,
} from "@/app/features/branches/logic/branchSlice";
import { Building, MapPin } from "lucide-react";
import CrudPage from "../../../core/components/crudPage";
import ChangeBranchDialog from "./changeBranchDialog";

const branchesService = new BranchesApiService();

export default function SampleBranchPage() {
  const dispatch = useAppDispatch();
  const branchState = useAppSelector((state) => state.branch);
  const branchDialogState = useAppSelector((state) => state.branchDialog);

  return (
    <CrudPage<Branch>
      title="إدارة الفروع"
      entityName="الفرع"
      addNewItemTitle="إضافة فرع جديد"
      permissionResource={SystemPermissionsResources.Branches}
      entityState={branchState}
      useSlice={() => branchDialogState}
      service={branchesService}
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
      tableHeadRows={[
        { rowName: "", rowStyles: "text-left w-12.5" },
        { rowName: "رقم الفرع", rowStyles: "w-30" },
        { rowName: "اسم الفرع", rowStyles: "" },
        { rowName: "المدينة", rowStyles: "" },
      ]}
      tableRowMapper={(branch: Branch) => [
        { rowName: `#${branch.id}`, rowStyles: "" },
        { rowName: branch.name, rowStyles: "font-semibold" },
        {
          rowName: branch.cityName,
          rowStyles: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800",
        },
      ]}
      actions={{
        filter: filterBranches,
        openChangeDialog: (entity) => openBranchChangeDialog(entity),
        openDeleteDialog: (entity) => openBranchDeleteDialog(entity),
        setIsChangeDialogOpen: (open) => setIsBranchChangeDialogOpen(open),
        setIsDeleteDialogOpen: (open) => setIsBranchDeleteDialogOpen(open),
        refresh: refreshBranches,
        setCurrentPage: (page) => setCurrentBranchesPage(page),
      }}
      ChangeDialog={
        <ChangeBranchDialog
          entity={branchDialogState.selectedRow || undefined}
          mode={branchDialogState.selectedRow ? "update" : "create"}
          onSuccess={(data, mode) => {
            dispatch(refreshBranches({ data: data }));
            if (mode === "create")
              dispatch(setIsBranchChangeDialogOpen(false));
          }}
        />
      }
    />
  );
}