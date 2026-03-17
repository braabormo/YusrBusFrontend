import type { ColumnName } from "../types/ColumnName";
import type { Country } from "./country";

export class City
{
  public id!: number;
  public name!: string;
  public countryId!: number;
  public country!: Country;

  constructor(init?: Partial<City>)
  {
    Object.assign(this, init);
  }
}

export class CityFilterColumns
{
  public static columnsNames: ColumnName[] = [{ label: "اسم المدينة", value: "Name" }];
}
