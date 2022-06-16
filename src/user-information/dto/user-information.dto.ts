import { SortValue } from "aws-sdk/clients/alexaforbusiness";

export class UserInformationDto {
    uuid?: string;

    userId?: number;
    
    staffId?: string;

    firstName?: string;

    lastName?: string;

    remain?: number;

    remmote_remain_in_month?: number;

    remote_day_in_year?: number;

    dateOffNextYear?: number;

    profilePhotoKey?: string;

    phoneNumber?: string;

    dob?: Date;

    startDate?: Date;

    shortDescription?: string;

    position?: string;

    createdAt?: Date;

    updatedAt?: Date;

    teamId?:number;

    constructor() {
        this.uuid = "";
        this.userId = 0;
        this.firstName = "";
        this.lastName = "";
        this.profilePhotoKey = "";
        this.phoneNumber = "";
        this.dob = new Date('1995-01-01');
        this.shortDescription = "";
        this.position = "";
        this.staffId = "";
        this.teamId = null;
    }
}

export class UserInformationSortDto {
    uuid?: SortValue;

    userId?: SortValue;

    firstName?: SortValue;

    lastName?: SortValue;

    profilePhotoKey?: SortValue;

    phoneNumber?: SortValue;

    dob?: SortValue;

    shortDescription?: SortValue;

    teamId?:number;


    position?: SortValue;

    createdAt?: SortValue;

    updatedAt?: SortValue;
}