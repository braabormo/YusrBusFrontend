import ApiConstants from "../../apiConstants";
import YusrApiHelper from "../../yusrApiHelper";
import { ReportHelper } from "./reportHelper";

export default class TicketReportApiService
{
    static async getReport(id: number, checkIn: boolean, viewAction: "display" | "share" = "display", filename: string = '') : Promise<boolean>
    {
        const url = `${ApiConstants.baseUrl}/Reports/Ticket`;
        const requestBody = { 
            ticketId: id,
            checkIn : checkIn 
        };

        const blob = await YusrApiHelper.PostBlob(url, requestBody);

        if (blob == undefined) 
            return false;
        
        if (viewAction === "display") {
            ReportHelper.displayPdf(blob);
        }
        if (viewAction === "share") {
            ReportHelper.handleShareTicket(blob, filename);
        }

        return true;
    }  
}