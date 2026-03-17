import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import type { ColumnName } from "../../types/ColumnName";

type SearchInputParams = {
  columnsNames: ColumnName[];
  onSearch: (condition: { value: string; columnName: string; } | undefined) => void;
};

export default function SearchInput({ columnsNames, onSearch }: SearchInputParams)
{
  const [searchValue, setSearchValue] = useState("");
  const [selectedColumn, setSelectedColumn] = useState<string>(columnsNames[0]?.value || "");

  const debouncedAction = useDebouncedCallback((value: string, column: string) =>
  {
    if (!value.trim())
    {
      onSearch(undefined);
    }
    else
    {
      onSearch({ value: value, columnName: column });
    }
  }, 500);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
  {
    const val = e.target.value;
    setSearchValue(val);

    if (!val)
    {
      debouncedAction.cancel();
      onSearch(undefined);
    }
    else
    {
      debouncedAction(val, selectedColumn);
    }
  };

  const handleColumnChange = (column: string) =>
  {
    setSelectedColumn(column);

    if (searchValue.trim())
    {
      debouncedAction(searchValue, column);
    }
  };

  return (
    <div className="p-3 rounded-t-xl border-x border-t flex flex-col sm:flex-row gap-4">
      <div className="relative w-full flex gap-2">
        { /* Shadcn Select for Columns */ }
        { columnsNames.length > 1 && (
          <Select dir="rtl" value={ selectedColumn } onValueChange={ handleColumnChange }>
            <SelectTrigger className="bg-secondary border-none">
              <SelectValue placeholder="اختر العمود" />
            </SelectTrigger>
            <SelectContent>
              { columnsNames.map((col) => (
                <SelectItem key={ col.value } value={ col.value }>{ col.label }</SelectItem>
              )) }
            </SelectContent>
          </Select>
        ) }

        { /* Search Icon & Input */ }
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={ searchValue }
            onChange={ handleInputChange }
            placeholder="ابحث..."
            className="pr-10 bg-secondary border-none focus-visible:ring-1"
          />
        </div>
      </div>
    </div>
  );
}
