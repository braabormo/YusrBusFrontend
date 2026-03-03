export class ReportHelper
{
    public static displayPdf(blob: Blob) {
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
        setTimeout(() => window.URL.revokeObjectURL(url), 100);
    }
}