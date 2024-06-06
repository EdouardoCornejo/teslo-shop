/* eslint-disable @typescript-eslint/ban-types */
import { Request } from 'express';

/**
 * Filter function for uploaded files
 * @param req Request object
 * @param file Uploaded file
 * @param callback Callback function
 * @returns Callback function
 */
export const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  if (!file) return callback(new Error('No file provided'), false);

  const fileExtension = file.mimetype.split('/')[1];
  const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];

  if (!validExtensions.includes(fileExtension)) {
    return callback(null, false);
  }

  return callback(null, true);
};
