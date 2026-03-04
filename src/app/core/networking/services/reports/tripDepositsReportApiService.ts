import ApiConstants from "../../apiConstants";
import YusrApiHelper from "../../yusrApiHelper";
import { ReportHelper } from "./reportHelper";

export default class TripDepositsReportApiService
{
    static async getReport(id: number, commission: number, userId: number, viewAction: "display" | "share" = "display", filename: string = '') 
    {
        const url = `${ApiConstants.baseUrl}/Reports/TripDeposits`;
        const requestBody = { 
            tripId: id,
            commission: commission,
            userId: userId 
        };

        const blob = await YusrApiHelper.PostBlob(url, requestBody);
        
        if(blob == undefined)
            return;

        if (viewAction === "display") {
            ReportHelper.displayPdf(blob);
        }
        if (viewAction === "share") {
            ReportHelper.handleShareTicket(blob, filename);
        }
    }  
}