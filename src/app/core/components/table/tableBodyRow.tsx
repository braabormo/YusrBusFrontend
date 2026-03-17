import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import type { ReactNode } from "react";

export type TableBodyRowInfo = { rowName: string; rowStyles: string; };

interface GenericRowProps
{
  tableRows: TableBodyRowInfo[];
  dropdownMenu: ReactNode;
  contextMenuContent: ReactNode;
}

export default function TableBodyRow({ tableRows, dropdownMenu, contextMenuContent }: GenericRowProps)
{
  return (
    <>
      <ContextMenu dir="rtl">
        <ContextMenuTrigger asChild>
          <TableRow className="hover:bg-secondary/50 transition-colors">
            <TableCell>{ dropdownMenu }</TableCell>

            { tableRows.map((row, i) => (
              <TableCell key={ i }>
                <span className={ row.rowStyles }>{ row.rowName }</span>
              </TableCell>
            )) }
          </TableRow>
        </ContextMenuTrigger>

        { contextMenuContent }
      </ContextMenu>
    </>
  );
}
