import ApiConstants from "../../apiConstants";
import YusrApiHelper from "../../yusrApiHelper";
import { ReportHelper } from "./reportHelper";


export default class DepositReportApiService 
{
    static async getDepositReport(depositId: number, userId: number) 
    {
        const url = `${ApiConstants.baseUrl}/Reports/Deposit`;
        const requestBody = {
            depositId: depositId,
            userId: userId
        };

        const blob = await YusrApiHelper.PostBlob(url, requestBody);

        if (blob) {
            ReportHelper.displayPdf(blob);
        }
    }
}