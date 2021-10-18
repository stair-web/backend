import { Response } from 'express';

export const isNullOrUndefined = (object) => {
  if (object === null || object === undefined) {
    return true;
  } else {
    return false;
  }
};

export const isEmptyObject = (obj) => {
  return Object.keys(obj).length === 0;
};

export const paramStringToJson = (obj) => {
  return JSON.parse(String(obj));
};

export const removeAccents = (str: string) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
};

export const bytesToMegaBytes = (bytes) => bytes / (1024 * 1024);

export const setHeaderType = (
  res: Response,
  type: string,
  fileName: string,
) => {
  res.type(type);
  fileName = removeAccents(fileName);
  res.header('Content-Disposition', `attachment; filename=${fileName}`);
};
