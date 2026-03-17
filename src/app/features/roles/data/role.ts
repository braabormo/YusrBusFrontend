import type { ColumnName } from "../../../core/types/ColumnName";

export class Role
{
  public id!: number;
  public name!: string;
  public permissions!: string[];

  constructor(init?: Partial<Role>)
  {
    Object.assign(this, init);
  }
}

export class RoleFilterColumns
{
  public static columnsNames: ColumnName[] = [{ label: "اسم الدور", value: "Name" }];
}
