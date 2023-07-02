import { google } from 'googleapis';
import key from './aslu-389507-10dca06b7642.json';
// @ts-ignore
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';

interface MetricEntry {
    expression: string;
}

interface DateRange {
    startDate: string;
    endDate: string;
}

interface ReportRequest {
    viewId: string;
    dateRanges: DateRange[];
    metrics: MetricEntry[];
}

interface MetricData {
    id: string;
}

interface MetricEntryData {
    title: string;
}

interface MetricResult {
    _count: MetricData;
    category_id: number;
    category: MetricEntryData;
    increase?: number;
    decrease?: number;
}

export default async function state() {
    try {
        const scopes = ['https://www.googleapis.com/auth/analytics.readonly'];

        const authClient = await google.auth.getClient({
            credentials: key,
            scopes,
        });

        const analyticsreporting = google.analyticsreporting({
            version: 'v4',
            auth: authClient,
        });

        const viewId = String(process.env.VIEW_ID);

        const today = new Date();
        const startDate = format(startOfMonth(subMonths(today, 1)), 'yyyy-MM-dd');
        const endDate = format(endOfMonth(subMonths(today, 1)), 'yyyy-MM-dd');

        const reportRequests: ReportRequest[] = [
            {
                viewId,
                dateRanges: [
                    {
                    startDate,
                    endDate,
                    },
                    {
                    startDate: format(startOfMonth(subMonths(today, 2)), 'yyyy-MM-dd'),
                    endDate: format(endOfMonth(subMonths(today, 2)), 'yyyy-MM-dd'),
                    },
                ],
                metrics: [
                    { expression: 'ga:sessions' },
                    { expression: 'ga:pageviews' },
                    { expression: 'ga:avgSessionDuration' },
                    { expression: 'ga:bounceRate' },
                ],
            },
        ];

        const response = await analyticsreporting.reports.batchGet({
            requestBody: {
                reportRequests,
            },
        });

        // @ts-ignore
        const report = response.data.reports[0];
        const columnHeader = report.columnHeader;
        // @ts-ignore
        const rows = report.data.rows;

        if (rows && rows.length > 0) {
            // @ts-ignore
            const currentMonthMetrics = rows[0].metrics[0].values.map((value:string) => Number(value));
            // @ts-ignore
            const previousMonthMetrics = rows[0].metrics[1].values.map((value:string) => Number(value));

            // @ts-ignore
            const metricNames = columnHeader.metricHeader.metricHeaderEntries.map((entry:{name:string}) => entry.name);

            const metrics: MetricResult[] = metricNames.map((metricName:string, index:number) => {
                const percentage = calculatePercentageChange(previousMonthMetrics[index], currentMonthMetrics[index]);
                const stat: MetricResult = {
                    // @ts-ignore
                    _count: { id: currentMonthMetrics[index].toFixed(2).replace(".00", "") },
                    category_id: index,
                    category: {
                    title: convertToTitleCase(metricName.replace('ga:', '')),
                    },
                };
                if (percentage > 0) {
                    stat.increase = percentage;
                } else {
                    stat.decrease = percentage;
                }
                return stat;
            });

            return metrics;
        } else {
            throw new Error('No data available for the specified date range.');
        }
    } catch (error) {
        return []
    }
}

function calculatePercentageChange(initialValue: number, finalValue: number): number {
    const difference = finalValue - initialValue;
    const percentageChange = (difference / initialValue) * 100;

    return parseFloat(percentageChange.toFixed(2));
}

function convertToTitleCase(text:string) {
    let convertedText = '';
    
    for (let i = 0; i < text.length; i++) {
      const currentChar = text[i];
      
      if (i > 0 && currentChar === currentChar.toUpperCase()) {
        convertedText += ' ';
      }
      
      convertedText += currentChar.toLowerCase();
    }
    
    return convertedText;
}