import type { FilterResult } from "../../data/filterResult";

export default interface IEntityState<T> {
  entities: FilterResult<T>;
  isLoaded: boolean;
  isLoading: boolean;
  currentPage: number;
  rowsPerPage: number;
}