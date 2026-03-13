import { useAppDispatch, useAppSelector } from "@/app/core/state/hooks";
import type IEntityState from "@/app/core/state/interfaces/iEntityState";
import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import type {
  ActionCreatorWithPayload,
  AnyAction,
  AsyncThunk,
} from "@reduxjs/toolkit";
import TableCard, {
  type CardProps,
} from "@/app/core/components/table/tableCard";
import SearchInput from "@/app/core/components/input/searchInput";
import TableRowActionsMenu from "@/app/core/components/table/tableRowActionsMenu";
import { Table, TableBody } from "@/components/ui/table";
import TablePagination from "@/app/core/components/table/tablePagination";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import DeleteDialog from "@/app/core/components/dialogs/deleteDialog";
import TableBodyRow, {
  type TableBodyRowInfo,
} from "@/app/core/components/table/tableBodyRow";
import EmptyTablePreview from "@/app/core/components/table/emptyTablePreview";
import TableHeader from "@/app/core/components/table/tableHeader";
import TableHeaderRows, {
  type TableHeadRow,
} from "@/app/core/components/table/tableHeaderRows";
import type { ColumnName } from "@/app/core/types/ColumnName";
import { selectPermissionsByResource } from "@/app/core/auth/authSelectors";
import type BaseApiService from "@/app/core/networking/baseApiService";
import type { BaseEntity } from "@/app/core/data/baseEntity";
import type { IDialogState } from "@/app/core/state/interfaces/iDialogState";
import type { FilterResult } from "@/app/core/data/filterResult";
import type { FilterCondition } from "@/app/core/data/filterCondition";

export interface CrudActions<T extends BaseEntity> {
  filter: AsyncThunk<
    FilterResult<T> | undefined,
    FilterCondition | undefined,
    object
  >;
  openEditDialog: (entity: T) => AnyAction;
  openDeleteDialog: (entity: T) => AnyAction;
  setIsEditDialogOpen: (open: boolean) => AnyAction;
  setIsDeleteDialogOpen: (open: boolean) => AnyAction;
  refresh: ActionCreatorWithPayload<{ newData?: T; deletedId?: number }>;
  setCurrentPage: (page: number) => AnyAction;
}

export type CrudPageProps<T extends BaseEntity> = PropsWithChildren & {
  entityState: IEntityState<T>;
  useSlice: () => IDialogState<T>;
  actions: CrudActions<T>;
  permissionResource: string;
  entityName: string;
  title: string;
  addNewItemTitle: string;
  cards: CardProps[];
  columnsToFilter: ColumnName[];
  service: BaseApiService<T>;
  tableHeadRows: TableHeadRow[];
  tableRowMapper: (entity: T) => TableBodyRowInfo[];

  AddNewChangeDialog: React.ReactNode;
  UpdateChangeDialog: React.ReactNode;
};

export default function CrudPage<T extends BaseEntity>({
  permissionResource,
  useSlice,
  entityName,
  title,
  addNewItemTitle,
  cards,
  columnsToFilter,
  actions,
  service,
  entityState,
  tableHeadRows,
  tableRowMapper,
  AddNewChangeDialog,
  UpdateChangeDialog,
  children,
}: CrudPageProps<T>) {
  const dispatch = useAppDispatch();
  const { selectedRow, isEditDialogOpen, isDeleteDialogOpen } = useSlice();
  useEffect(() => {
    dispatch(actions.filter(undefined));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, actions.filter]);

  const perm = useAppSelector((state) =>
    selectPermissionsByResource(state, permissionResource),
  );

  return (
    <div className="px-5 py-3">
      <TableHeader
        title={title}
        buttonTitle={addNewItemTitle}
        isButtonVisible={perm.addPermission}
        createComp={AddNewChangeDialog}
      />

      <TableCard cards={cards} />

      <SearchInput
        columnsNames={columnsToFilter}
        onSearch={(condition) => dispatch(actions.filter(condition))}
      />

      <div className="rounded-b-xl border shadow-sm overflow-hidden">
        {entityState.isLoading ? (
          <EmptyTablePreview mode="loading" />
        ) : entityState.entities?.count == 0 ? (
          <EmptyTablePreview mode="empty" />
        ) : entityState.entities == undefined ? (
          <EmptyTablePreview mode="error" />
        ) : (
          <Table>
            <TableHeaderRows tableHeadRows={tableHeadRows} />

            <TableBody>
              {entityState.entities?.data?.map((entity: T, i: number) => (
                <TableBodyRow
                  key={i}
                  tableRows={tableRowMapper(entity)}
                  dropdownMenu={
                    <TableRowActionsMenu
                      permissionsResource={permissionResource}
                      type="dropdown"
                      onEditClicked={() =>
                        dispatch(actions.openEditDialog(entity))
                      }
                      onDeleteClicked={() =>
                        dispatch(actions.openDeleteDialog(entity))
                      }
                    />
                  }
                  contextMenuContent={
                    <TableRowActionsMenu
                      permissionsResource={permissionResource}
                      type="context"
                      onEditClicked={() =>
                        dispatch(actions.openEditDialog(entity))
                      }
                      onDeleteClicked={() =>
                        dispatch(actions.openDeleteDialog(entity))
                      }
                    />
                  }
                />
              ))}
            </TableBody>
          </Table>
        )}
        <TablePagination
          pageSize={100}
          totalNumber={entityState.entities?.count ?? 0}
          currentPage={entityState.currentPage || 1}
          onPageChanged={(newPage) => dispatch(actions.setCurrentPage(newPage))}
        />

        {isEditDialogOpen && perm.updatePermission && (
          <Dialog
            open={isEditDialogOpen}
            onOpenChange={(open) => dispatch(actions.setIsEditDialogOpen(open))}
          >
            {UpdateChangeDialog}
          </Dialog>
        )}

        {isDeleteDialogOpen && perm.deletePermission && (
          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={(open) =>
              dispatch(actions.setIsDeleteDialogOpen(open))
            }
          >
            <DialogContent dir="rtl" className="sm:max-w-sm">
              <DeleteDialog
                entityName={entityName}
                id={selectedRow?.id ?? 0}
                service={service}
                onSuccess={() => {
                  dispatch(actions.refresh({ deletedId: selectedRow?.id }));
                  dispatch(actions.setIsDeleteDialogOpen(false));
                }}
              />
            </DialogContent>
          </Dialog>
        )}

        {children}
      </div>
    </div>
  );
}
