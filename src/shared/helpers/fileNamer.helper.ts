/* eslint-disable @typescript-eslint/ban-types */
import { Request } from 'express';
import { v4 as uuid } from 'uuid';

/**
 * Filter function for uploaded files
 * @param req Request object
 * @param file Uploaded file
 * @param callback Callback function
 * @returns Callback function
 */
export const fileNamer = (
  req: Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  if (!file) return callback(new Error('No file provided'), false);

  const fileExtension = file.mimetype.split('/')[1];
  const fileName = `${uuid()}.${fileExtension}`;

  callback(null, fileName);
};
