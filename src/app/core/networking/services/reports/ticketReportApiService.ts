import ApiConstants from "../../apiConstants";
import YusrApiHelper from "../../yusrApiHelper";
import { ReportHelper } from "./reportHelper";

export default class TicketReportApiService
{
    static async getTicketReport(ticketId: number, userId: number) 
    {
        const url = `${ApiConstants.baseUrl}/Reports/Ticket`;
        const requestBody = { 
            ticketId: ticketId,
            userId: userId 
        };

        const blob = await YusrApiHelper.PostBlob(url, requestBody);
        
        if (blob) {
            ReportHelper.displayPdf(blob);
        }
    }  
}