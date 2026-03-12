import { selectPermissionsByResource } from "@/app/core/auth/authSelectors";
import { SystemPermissionsResources } from "@/app/core/auth/systemPermissionsResources";
import DeleteDialog from "@/app/core/components/dialogs/deleteDialog";
import EmptyTablePreview from "@/app/core/components/table/emptyTablePreview";
import TableRowActionsMenu from "@/app/core/components/table/tableRowActionsMenu";
import BranchesApiService from "@/app/core/networking/services/branchesApiService";
import { useAppDispatch, useAppSelector } from "@/app/core/state/hooks";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Table, TableBody } from "@/components/ui/table";
import { Building, MapPin } from "lucide-react";
import { useEffect } from "react";
import SearchInput from "../../../core/components/input/searchInput";
import BranchRow from "../../../core/components/table/tableBodyRow";
import TableCard from "../../../core/components/table/tableCard";
import TableHeader from "../../../core/components/table/tableHeader";
import TableHeaderRows from "../../../core/components/table/tableHeaderRows";
import TablePagination from "../../../core/components/table/tablePagination";
import { BranchFilterColumns } from "../data/branch";
import { openBranchDeleteDialog, openBranchEditDialog, setIsBranchDeleteDialogOpen, setIsBranchEditDialogOpen } from "../logic/branchDialogSlice";
import { filter, refresh, setCurrentPage } from "../logic/branchSlice";
import ChangeBranchDialog from "./changeBranchDialog";

export default function BranchesPage() {
  const dispatch = useAppDispatch(); 
  const branchState = useAppSelector((state) => state.branch);
  const { 
    selectedRow, 
    isEditDialogOpen, 
    isDeleteDialogOpen 
  } = useAppSelector((state) => state.branchDialog);
  const perm = useAppSelector((state) => selectPermissionsByResource(state, SystemPermissionsResources.Branches));

  useEffect(() => {
    dispatch(filter(undefined));
  }, [dispatch]);


  return (
    <div className="px-5 py-3">
      <TableHeader
        title="إدارة الفروع"
        buttonTitle="إضافة فرع جديد"
        isButtonVisible={perm.addPermission}
        createComp={
          <ChangeBranchDialog
            entity={undefined}
            mode="create"
            onSuccess={(newData) => dispatch(refresh({ newData: newData }))}
          />
        }
      />

      <TableCard
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
      />

      <SearchInput
        columnsNames={BranchFilterColumns.columnsNames}
        onSearch={(condition) => dispatch(filter(condition))}
      />

      <div className="rounded-b-xl border shadow-sm overflow-hidden">
        {branchState.isLoading ? (
          <EmptyTablePreview mode="loading" />
        ) : branchState.entities?.count == 0 ? (
          <EmptyTablePreview mode="empty" />
        ) : branchState.entities == undefined ? (
          <EmptyTablePreview mode="error" />
        ) : (
          <Table>
            <TableHeaderRows
              tableHeadRows={[
                { rowName: "", rowStyles: "text-left w-12.5" },
                { rowName: "رقم الفرع", rowStyles: "w-30" },
                { rowName: "اسم الفرع", rowStyles: "" },
                { rowName: "المدينة", rowStyles: "" },
              ]}
            />

            <TableBody>
              {branchState.entities?.data?.map((branch, i) => (
                <BranchRow
                  key={i}
                  tableRows={[
                    { rowName: `#${branch.id}`, rowStyles: "" },
                    { rowName: branch.name, rowStyles: "font-semibold" },
                    {
                      rowName: branch.cityName,
                      rowStyles:
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800",
                    },
                  ]}
                  dropdownMenu={
                    <TableRowActionsMenu
                      permissionsResource={SystemPermissionsResources.Branches}
                      type="dropdown"
                      onEditClicked={() => dispatch(openBranchEditDialog(branch))}
                      onDeleteClicked={() => dispatch(openBranchDeleteDialog(branch))}
                    />
                  }
                  contextMenuContent={
                    <TableRowActionsMenu
                      permissionsResource={SystemPermissionsResources.Branches}
                      type="context"
                      onEditClicked={() => dispatch(openBranchEditDialog(branch))}
                      onDeleteClicked={() => dispatch(openBranchDeleteDialog(branch))}
                    />
                  }
                />
              ))}
            </TableBody>
          </Table>
        )}
        <TablePagination
          pageSize={100}
          totalNumber={branchState.entities?.count ?? 0}
          currentPage={branchState.currentPage || 1}
          onPageChanged={(newPage) => dispatch(setCurrentPage(newPage))}
        />

        {isEditDialogOpen && perm.updatePermission && (
          <Dialog open={isEditDialogOpen} onOpenChange={(open) => dispatch(setIsBranchEditDialogOpen(open))}>
            <ChangeBranchDialog
              entity={selectedRow || undefined}
              mode={selectedRow ? "update" : "create"}
              onSuccess={(data, mode) => {
                dispatch(refresh({ newData: data }));
                if (mode === "create") 
                  dispatch(setIsBranchEditDialogOpen(false));
              }}
            />
          </Dialog>
        )}

        {isDeleteDialogOpen && perm.deletePermission && (
          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={(open) => dispatch(setIsBranchDeleteDialogOpen(open))}
          >
            <DialogContent dir="rtl" className="sm:max-w-sm">
              <DeleteDialog
                entityName="الفرع"
                id={selectedRow?.id ?? 0}
                service={new BranchesApiService()}
                onSuccess={() => {
                  dispatch(refresh({ deletedId: selectedRow?.id }));
                  dispatch(setIsBranchDeleteDialogOpen(false));
                }}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
