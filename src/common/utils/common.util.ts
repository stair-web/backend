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

export const isUuid = (target) => {
    const regexp = new RegExp(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
    return regexp.test(target);
}