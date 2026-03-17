import { selectPermissionsByResource } from "@/app/core/auth/authSelectors";
import DeleteDialog from "@/app/core/components/dialogs/deleteDialog";
import SearchInput from "@/app/core/components/input/searchInput";
import EntityTable from "@/app/core/components/table/entityTable";
import TableBodyRow, { type TableBodyRowInfo } from "@/app/core/components/table/tableBodyRow";
import TableCard, { type CardProps } from "@/app/core/components/table/tableCard";
import TableHeader from "@/app/core/components/table/tableHeader";
import TableHeaderRows, { type TableHeadRow } from "@/app/core/components/table/tableHeaderRows";
import TablePagination from "@/app/core/components/table/tablePagination";
import TableRowActionsMenu from "@/app/core/components/table/tableRowActionsMenu";
import type { BaseEntity } from "@/app/core/data/baseEntity";
import type { FilterCondition } from "@/app/core/data/filterCondition";
import type { FilterResult } from "@/app/core/data/filterResult";
import type BaseApiService from "@/app/core/networking/baseApiService";
import { useAppDispatch, useAppSelector } from "@/app/core/state/hooks";
import type { IDialogState } from "@/app/core/state/interfaces/iDialogState";
import type IEntityState from "@/app/core/state/interfaces/iEntityState";
import type { ColumnName } from "@/app/core/types/ColumnName";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TableBody } from "@/components/ui/table";
import type { ActionCreatorWithPayload, AsyncThunk, UnknownAction } from "@reduxjs/toolkit";
import type { PropsWithChildren } from "react";
import { useEffect } from "react";

export interface CrudActions<T extends BaseEntity>
{
  filter: AsyncThunk<FilterResult<T> | undefined, FilterCondition | undefined, object>;
  openChangeDialog: (entity: T) => UnknownAction;
  openDeleteDialog: (entity: T) => UnknownAction;
  setIsChangeDialogOpen: (open: boolean) => UnknownAction;
  setIsDeleteDialogOpen: (open: boolean) => UnknownAction;
  refresh: ActionCreatorWithPayload<{ newData?: T; deletedId?: number; }>;
  setCurrentPage: (page: number) => UnknownAction;
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

  ChangeDialog: React.ReactNode;
};

export default function CrudPage<T extends BaseEntity>(
  {
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
    ChangeDialog,
    children
  }: CrudPageProps<T>
)
{
  const dispatch = useAppDispatch();
  const { selectedRow, isChangeDialogOpen, isDeleteDialogOpen } = useSlice();
  useEffect(() =>
  {
    dispatch(actions.filter(undefined));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, actions.filter]);

  const perm = useAppSelector((state) => selectPermissionsByResource(state, permissionResource));

  return (
    <div className="px-5 py-3">
      <TableHeader
        title={ title }
        buttonTitle={ addNewItemTitle }
        isButtonVisible={ perm.addPermission }
        createComp={ ChangeDialog }
      />

      <TableCard cards={ cards } />

      <SearchInput columnsNames={ columnsToFilter } onSearch={ (condition) => dispatch(actions.filter(condition)) } />

      <div className="rounded-b-xl border shadow-sm overflow-hidden">
        <EntityTable state={ entityState }>
          <TableHeaderRows tableHeadRows={ tableHeadRows } />

          <TableBody>
            { entityState.entities?.data?.map((entity: T, i: number) => (
              <TableBodyRow
                key={ i }
                tableRows={ tableRowMapper(entity) }
                dropdownMenu={ 
                  <TableRowActionsMenu
                    permissionsResource={ permissionResource }
                    type="dropdown"
                    onEditClicked={ () => dispatch(actions.openChangeDialog(entity)) }
                    onDeleteClicked={ () => dispatch(actions.openDeleteDialog(entity)) }
                  />
                 }
                contextMenuContent={ 
                  <TableRowActionsMenu
                    permissionsResource={ permissionResource }
                    type="context"
                    onEditClicked={ () => dispatch(actions.openChangeDialog(entity)) }
                    onDeleteClicked={ () => dispatch(actions.openDeleteDialog(entity)) }
                  />
                 }
              />
            )) }
          </TableBody>
        </EntityTable>

        <TablePagination
          pageSize={ entityState.rowsPerPage }
          totalNumber={ entityState.entities?.count ?? 0 }
          currentPage={ entityState.currentPage || 1 }
          onPageChanged={ (newPage) => dispatch(actions.setCurrentPage(newPage)) }
        />

        { isChangeDialogOpen && perm.updatePermission && (
          <Dialog
            open={ isChangeDialogOpen }
            onOpenChange={ (open) => dispatch(actions.setIsChangeDialogOpen(open)) }
          >
            { ChangeDialog }
          </Dialog>
        ) }

        { isDeleteDialogOpen && perm.deletePermission && (
          <Dialog
            open={ isDeleteDialogOpen }
            onOpenChange={ (open) => dispatch(actions.setIsDeleteDialogOpen(open)) }
          >
            <DialogContent dir="rtl" className="sm:max-w-sm">
              <DeleteDialog
                entityName={ entityName }
                id={ selectedRow?.id ?? 0 }
                service={ service }
                onSuccess={ () =>
                {
                  dispatch(actions.refresh({ deletedId: selectedRow?.id }));
                  dispatch(actions.setIsDeleteDialogOpen(false));
                } }
              />
            </DialogContent>
          </Dialog>
        ) }

        { children }
      </div>
    </div>
  );
}
