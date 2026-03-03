import { Dashboard } from "../../data/dashboard";
import type { RequestResult } from "../../data/requestResult";
import ApiConstants from "../apiConstants";
import YusrApiHelper from "../yusrApiHelper";

export default class DashboardApiService
{
    routeName: string = "dashboard";

    async get(): Promise<RequestResult<Dashboard>>
    {
        const url = `${ApiConstants.baseUrl}/${this.routeName}`;        
        return await YusrApiHelper.Get<Dashboard>(url);
    }
}