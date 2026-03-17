import type { ColumnName } from "../types/ColumnName";

export class Country
{
  public id!: number;
  public name!: string;
  public code!: string;

  constructor(init?: Partial<Country>)
  {
    Object.assign(this, init);
  }
}

export class CountryFilterColumns
{
  public static columnsNames: ColumnName[] = [{ label: "اسم الدولة", value: "Name" }];
}
