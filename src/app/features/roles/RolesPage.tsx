import DeleteDialog from "@/app/core/components/dialogs/deleteDialog";
import EmptyTablePreview from "@/app/core/components/table/emptyTablePreview";
import TableRowActionsMenu from "@/app/core/components/table/tableRowActionsMenu";
import useDialog from "@/app/core/hooks/useDialog";
import useEntities from "@/app/core/hooks/useEntities";
import BranchesApiService from "@/app/core/networking/services/branchesApiService";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Table, TableBody } from "@/components/ui/table";
import { Building, MapPin } from "lucide-react";
import SearchInput from "../../../core/components/input/searchInput";
import BranchRow from "../../../core/components/table/tableBodyRow";
import TableCard from "../../../core/components/table/tableCard";
import TableHeader from "../../../core/components/table/tableHeader";
import TableHeaderRows from "../../../core/components/table/tableHeaderRows";
import TablePagination from "../../../core/components/table/tablePagination";
import Branch, { BranchFilterColumns } from "../data/branch";
import ChangeBranchDialog from "./changeBranchDialog";

export default function RolesPage() {
  const { entities, refreash, filter, isLoading, currentPage, setCurrentPage } =
    useEntities<Branch>(new BranchesApiService());
  const {
    selectedRow,
    isEditDialogOpen,
    isDeleteDialogOpen,
    setIsEditDialogOpen,
    setIsDeleteDialogOpen,
    openEditDialog,
    openDeleteDialog,
  } = useDialog<Branch>();

  return (
    <div className="px-5 py-3">
      <TableHeader
        title="إدارة الصلاحيات"
        buttonTitle="إضافة صلاحية جديدة"
        createComp={
          <ChangeBranchDialog
            entity={undefined}
            mode="create"
            onSuccess={(newData) => refreash(newData)}
          />
        }
      />

      <TableCard
        cards={[
          {
            title: "إجمالي الصلاحيات",
            data: (entities?.count ?? 0).toString(),
            icon: <Building className="h-4 w-4 text-muted-foreground" />,
          },
        ]}
      />

      <SearchInput
        columnsNames={BranchFilterColumns.columnsNames}
        onSearch={(condition) => filter(condition)}
      />

      <div className="rounded-b-xl border shadow-sm overflow-hidden">
        {isLoading ? (
          <EmptyTablePreview mode="loading" />
        ) : entities?.count == 0 ? (
          <EmptyTablePreview mode="empty" />
        ) : entities == undefined ? (
          <EmptyTablePreview mode="error" />
        ) : (
          <Table>
            <TableHeaderRows
              tableHeadRows={[
                { rowName: "", rowStyles: "text-left w-12.5" },
                { rowName: "رقم الصلاحية", rowStyles: "w-30" },
                { rowName: "اسم الصلاحية", rowStyles: "" },
              ]}
            />

            <TableBody>
              {entities?.data?.map((branch, i) => (
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
                      type="dropdown"
                      onEditClicked={() => openEditDialog(branch)}
                      onDeleteClicked={() => openDeleteDialog(branch)}
                    />
                  }
                  contextMenuContent={
                    <TableRowActionsMenu
                      type="context"
                      onEditClicked={() => openEditDialog(branch)}
                      onDeleteClicked={() => openDeleteDialog(branch)}
                    />
                  }
                />
              ))}
            </TableBody>
          </Table>
        )}
        <TablePagination
          pageSize={100}
          totalNumber={entities?.count ?? 0}
          currentPage={currentPage || 1}
          onPageChanged={setCurrentPage}
        />

        {isEditDialogOpen && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <ChangeBranchDialog
              entity={selectedRow || undefined}
              mode={selectedRow ? "update" : "create"}
              onSuccess={(data) => {
                refreash(data);
                setIsEditDialogOpen(false);
              }}
            />
          </Dialog>
        )}

        {isDeleteDialogOpen && (
          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <DialogContent dir="rtl" className="sm:max-w-sm">
              <DeleteDialog
                entityName="الفرع"
                id={selectedRow?.id ?? 0}
                service={new BranchesApiService()}
                onSuccess={() => {
                  refreash(undefined, selectedRow?.id);
                  setIsDeleteDialogOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
