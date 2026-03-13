import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export type TableHeadRow = {
  rowName: string;
  rowStyles: string;
};

export default function TableHeaderRows({
  tableHeadRows,
}: {
  tableHeadRows: TableHeadRow[];
}) {
  return (
    <TableHeader className="bg-muted">
      <TableRow>
        {tableHeadRows.map((row, i) => (
          <TableHead key={i} className={row.rowStyles}>
            {row.rowName}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}
