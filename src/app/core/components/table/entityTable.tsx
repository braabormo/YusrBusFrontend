import { Table } from "@/components/ui/table";
import type IEntityState from "../../state/interfaces/iEntityState";
import EmptyTablePreview from "./emptyTablePreview";

export default function EntityTable({ state, children }: { state: IEntityState<any>; children: React.ReactNode; })
{
  if (state.isLoading)
  {
    return <EmptyTablePreview mode="loading" />;
  }

  if (state.entities?.count == 0)
  {
    return <EmptyTablePreview mode="empty" />;
  }

  if (state.entities == undefined)
  {
    return <EmptyTablePreview mode="loading" />;
  }

  return <Table>{ children }</Table>;
}
