import type { BaseEntity } from "../../data/baseEntity";
import type BaseApiService from "../../networking/baseApiService";
import type { DialogMode } from "./dialogType";

export type CommonChangeDialogProps<T extends BaseEntity> = {
  entity?: T;
  mode: DialogMode;
  service: BaseApiService<T>;
  onSuccess?: (newData: T, mode: DialogMode) => void;
};
