import type { Country } from "../../data/country";
import type { FilterCondition } from "../../data/filterCondition";
import type { FilterResult } from "../../data/filterResult";
import type { RequestResult } from "../../data/requestResult";
import ApiConstants from "../apiConstants";
import BaseFilterableApiService from "../baseFilterableApiService";
import YusrApiHelper from "../yusrApiHelper";

export default class CountriesApiService extends BaseFilterableApiService<Country>
{
  routeName: string = "Countries";

  async Filter(
    pageNumber: number,
    rowsPerPage: number,
    condition?: FilterCondition
  ): Promise<RequestResult<FilterResult<Country>>>
  {
    return await YusrApiHelper.Post(
      `${ApiConstants.baseUrl}/${this.routeName}/Filter?pageNumber=${pageNumber}&rowsPerPage=${rowsPerPage}`,
      condition
    );
  }
}
