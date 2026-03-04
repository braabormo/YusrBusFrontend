import ApiConstants from "../../apiConstants";
import YusrApiHelper from "../../yusrApiHelper";
import { ReportHelper } from "./reportHelper";

export default class TripTicketsReportApiService
{
    static async getReport(id: number, userId: number, viewAction: "display" | "share" = "display", filename: string = '') 
    {
        const url = `${ApiConstants.baseUrl}/Reports/TripTickets`;
        const requestBody = { 
            tripId: id,
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