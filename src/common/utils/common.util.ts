import { v4 } from 'uuid';

/**
 * 
 * @returns uuid as string
 */
export const uuidv4 = () => v4();

/**
 * @description check if null or undefined
 * @param value 
 * @returns boolean
 */
export const isNullOrUndefined = function (value: any): boolean {
    if (value === null || value === undefined) {
        return true;
    }
    return false;
}