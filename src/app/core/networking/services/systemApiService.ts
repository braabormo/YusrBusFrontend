import type { RequestResult } from "../../data/requestResult";
import ApiConstants from "../apiConstants";
import YusrApiHelper from "../yusrApiHelper";

export default class SystemApiService
{
  routeName: string = "System";

  async GetSystemPermissions(): Promise<RequestResult<string[]>>
  {
    return await YusrApiHelper.Get(`${ApiConstants.baseUrl}/${this.routeName}/Permissions`);
  }
}
