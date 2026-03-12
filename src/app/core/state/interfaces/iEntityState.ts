import type { FilterResult } from "../../data/filterResult";

export default interface IEntityState<T> {
  entities: FilterResult<T>;
  isLoading: boolean;
  currentPage: number;
  rowsPerPage: number;
}