export class DayOffSearch {
    dateFrom?: Date;

    dateTo?: Date;
    
    status?: string;

    perPage?: number;

    dateLeave?: Date;

    fromDate?: Date;

    toDate?: Date;

    staffId?: number;

    time?: string;

    reason?: string;

    type?: string;

    listDateOff:DateOffItem[];

    page = 0;
}
export class DateOffItem {
    time?: string;
    date?: Date;
    isError?:boolean;
}
