import type { BaseEntity } from "../data/baseEntity";
import type { FilterCondition } from "../data/filterCondition";
import type { FilterResult } from "../data/filterResult";
import type { RequestResult } from "../data/requestResult";
import ApiConstants from "./apiConstants";
import YusrApiHelper from "./yusrApiHelper";

export default abstract class BaseFilterableApiService<T extends BaseEntity>
{
  abstract routeName: string;

  async Filter(
    pageNumber: number,
    rowsPerPage: number,
    condition?: FilterCondition
  ): Promise<RequestResult<FilterResult<T>>>
  {
    return await YusrApiHelper.Post(
      `${ApiConstants.baseUrl}/${this.routeName}/Filter?pageNumber=${pageNumber}&rowsPerPage=${rowsPerPage}`,
      condition
    );
  }
}
