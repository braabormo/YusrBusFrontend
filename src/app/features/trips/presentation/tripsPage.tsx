import { selectPermissionsByResource } from "@/app/core/auth/authSelectors";
import { SystemPermissionsResources } from "@/app/core/auth/systemPermissionsResources";
import DeleteDialog from "@/app/core/components/dialogs/deleteDialog";
import EmptyTablePreview from "@/app/core/components/table/emptyTablePreview";
import TableRowActionsMenu from "@/app/core/components/table/tableRowActionsMenu";
import useDialog from "@/app/core/hooks/useDialog";
import useEntities from "@/app/core/hooks/useEntities";
import TripsApiService from "@/app/core/networking/services/tripsApiService";
import { useAppSelector } from "@/app/core/state/hooks";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Table, TableBody } from "@/components/ui/table";
import { Building } from "lucide-react";
import SearchInput from "../../../core/components/input/searchInput";
import BranchRow from "../../../core/components/table/tableBodyRow";
import TableCard from "../../../core/components/table/tableCard";
import TableHeader from "../../../core/components/table/tableHeader";
import TableHeaderRows from "../../../core/components/table/tableHeaderRows";
import TablePagination from "../../../core/components/table/tablePagination";
import { TripFilterColumns, type Trip } from "../data/trip";
import ChangeTripDialog from "./changeTripDialog";

export default function TripsPage() {
  const { entities, refreash, filter, isLoading, currentPage, setCurrentPage } =
    useEntities<Trip>(
      new TripsApiService(),
      (pageNumber, rowsPerPage, condition) => {
        return new TripsApiService().Filter(pageNumber, rowsPerPage, condition);
      },
      [],
    );

  const {
    selectedRow,
    isEditDialogOpen,
    isDeleteDialogOpen,
    setIsEditDialogOpen,
    setIsDeleteDialogOpen,
    openEditDialog,
    openDeleteDialog,
  } = useDialog<Trip>();

  const perm = useAppSelector((state) => selectPermissionsByResource(state, SystemPermissionsResources.Trips));

  return (
    <div className="px-5 py-3">
      <TableHeader
        title="إدارة الرحلات"
        buttonTitle="إضافة رحلة جديدة"
        createComp={
          <ChangeTripDialog
            entity={undefined}
            mode="create"
            onSuccess={(newData) => refreash(newData)}
          />
        }
        isButtonVisible={perm.addPermission}
      />

      <TableCard
        cards={[
          {
            title: "إجمالي الرحلات",
            data: (entities?.count ?? 0).toString(),
            icon: <Building className="h-4 w-4 text-muted-foreground" />,
          },
        ]}
      />

      <SearchInput
        columnsNames={TripFilterColumns.columnsNames}
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
                { rowName: "رقم الرحلة", rowStyles: "w-30" },
                { rowName: "اسم قائد الحافلة", rowStyles: "" },
                { rowName: "اسم مساعد قائد الحافلة", rowStyles: "" },
                { rowName: "اسم الحافلة (اذا توفر)", rowStyles: "" },
                { rowName: "تاريخ بدء الرحلة", rowStyles: "" },
              ]}
            />

            <TableBody>
              {entities?.data?.map((trip, i) => (
                <BranchRow
                  key={i}
                  tableRows={[
                    { rowName: `#${trip.id}`, rowStyles: "" },
                    {
                      rowName: trip.mainCaptainName,
                      rowStyles: "font-semibold",
                    },
                    {
                      rowName: trip.secondaryCaptainName ?? "",
                      rowStyles:
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800",
                    },
                    {
                      rowName: trip.busName ?? "",
                      rowStyles:
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800",
                    },
                    {
                      rowName: new Date(trip.startDate).toLocaleString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      ),
                      rowStyles:
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800",
                    },
                  ]}
                  dropdownMenu={
                    <TableRowActionsMenu
                      permissionsResource={SystemPermissionsResources.Trips}
                      type="dropdown"
                      onEditClicked={() => openEditDialog(trip)}
                      onDeleteClicked={() => openDeleteDialog(trip)}
                    />
                  }
                  contextMenuContent={
                    <TableRowActionsMenu
                      permissionsResource={SystemPermissionsResources.Trips}
                      type="context"
                      onEditClicked={() => openEditDialog(trip)}
                      onDeleteClicked={() => openDeleteDialog(trip)}
                    />
                  }
                />
              ))}
            </TableBody>
          </Table>
        )}
        <TablePagination
          pageSize={10}
          totalNumber={entities?.count ?? 0}
          currentPage={currentPage || 1}
          onPageChanged={setCurrentPage}
        />

        {isEditDialogOpen && perm.updatePermission && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <ChangeTripDialog
              entity={selectedRow || undefined}
              mode={selectedRow ? "update" : "create"}
              onSuccess={(data, mode) => {
                refreash(data);
                if (mode === "create") setIsEditDialogOpen(false);
              }}
            />
          </Dialog>
        )}

        {isDeleteDialogOpen && perm.deletePermission && (
          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <DialogContent dir="rtl" className="sm:max-w-sm">
              <DeleteDialog
                entityName="الرحلة"
                id={selectedRow?.id ?? 0}
                service={new TripsApiService()}
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
