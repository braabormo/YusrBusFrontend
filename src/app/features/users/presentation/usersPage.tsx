import { selectPermissionsByResource } from "@/app/core/auth/authSelectors";
import { updateLoggedInUser } from "@/app/core/auth/authSlice";
import { SystemPermissionsResources } from "@/app/core/auth/systemPermissionsResources";
import DeleteDialog from "@/app/core/components/dialogs/deleteDialog";
import SearchInput from "@/app/core/components/input/searchInput";
import EmptyTablePreview from "@/app/core/components/table/emptyTablePreview";
import TableBodyRow from "@/app/core/components/table/tableBodyRow";
import TableCard from "@/app/core/components/table/tableCard";
import TableHeader from "@/app/core/components/table/tableHeader";
import TableHeaderRows from "@/app/core/components/table/tableHeaderRows";
import TablePagination from "@/app/core/components/table/tablePagination";
import TableRowActionsMenu from "@/app/core/components/table/tableRowActionsMenu";
import useDialog from "@/app/core/hooks/useDialog";
import useEntities from "@/app/core/hooks/useEntities";
import UsersApiService from "@/app/core/networking/services/usersApiService";
import { useAppDispatch, useAppSelector } from "@/app/core/state/hooks";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Table, TableBody } from "@/components/ui/table";
import { User2Icon } from "lucide-react";
import User, { UserFilterColumns } from "../data/user";
import ChangeUserDialog from "./changeUserDialog";

export default function UsersPage() {
  const { entities, refreash, filter, isLoading, currentPage, setCurrentPage } =
    useEntities<User>(new UsersApiService());

  const authState = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const {
    selectedRow,
    isEditDialogOpen,
    isDeleteDialogOpen,
    setIsEditDialogOpen,
    setIsDeleteDialogOpen,
    openEditDialog,
    openDeleteDialog,
  } = useDialog<User>();

  const perm = useAppSelector((state) => selectPermissionsByResource(state, SystemPermissionsResources.Users));

  return (
    <div className="px-5 py-3">
      <TableHeader
        title="إدارة المستخدمين"
        buttonTitle="إضافة مستخدم جديد"
        createComp={
          <ChangeUserDialog
            entity={undefined}
            mode="create"
            onSuccess={(newData) => {
              refreash(newData);
            }}
          />
        }
        isButtonVisible={perm.addPermission}
      />

      <TableCard
        cards={[
          {
            title: "إجمالي المستخدمين",
            data: (entities?.count ?? 0).toString(),
            icon: <User2Icon className="h-4 w-4 text-muted-foreground" />,
          },
        ]}
      />
      <SearchInput
        columnsNames={UserFilterColumns.columnsNames}
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
                { rowName: "رقم المستخدم", rowStyles: "w-30" },
                { rowName: "اسم المستخدم", rowStyles: "w-70" },
                { rowName: "هل المستخدم نشط", rowStyles: "" },
              ]}
            />
            <TableBody>
              {entities?.data?.map((user, i) => (
                <TableBodyRow
                  key={i}
                  tableRows={[
                    { rowName: `#${user.id}`, rowStyles: "" },
                    { rowName: user.username, rowStyles: "font-semibold" },
                    {
                      rowName: user.isActive ? "نشط" : "غير نشط",
                      rowStyles: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isActive ? "bg-green-300" : "bg-red-300"} text-slate-800`,
                    },
                  ]}
                  dropdownMenu={
                    <TableRowActionsMenu
                      permissionsResource={SystemPermissionsResources.Users}
                      type="dropdown"
                      onEditClicked={() => openEditDialog(user)}
                      onDeleteClicked={() => openDeleteDialog(user)}
                    />
                  }
                  contextMenuContent={
                    <TableRowActionsMenu
                      permissionsResource={SystemPermissionsResources.Users}
                      type="context"
                      onEditClicked={() => openEditDialog(user)}
                      onDeleteClicked={() => openDeleteDialog(user)}
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
            <ChangeUserDialog
              entity={selectedRow || undefined}
              mode={selectedRow ? "update" : "create"}
              onSuccess={(data, mode) => {
                refreash(data);
                if(mode === 'create')
                  setIsEditDialogOpen(false);
                if (data.id === authState.loggedInUser?.id) {
                  dispatch(updateLoggedInUser(data));
                }
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
                entityName="المستخدم"
                id={selectedRow?.id ?? 0}
                service={new UsersApiService()}
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
