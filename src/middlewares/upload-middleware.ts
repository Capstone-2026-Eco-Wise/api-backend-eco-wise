import type { Request } from 'express';
import type { FileFilterCallback, StorageEngine } from 'multer';
import multer from 'multer';
import { ErrorFactory } from '../errors/error-factory.ts';

export default class UploadMiddleware {
  private storage: StorageEngine;

  constructor() {
    this.storage = this.configureStorage();
  }

  private configureStorage() {
    return multer.memoryStorage();
  }

  private fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      throw ErrorFactory.clientError(
        'Only JPG, JPEG, PNG files are allowed',
        400,
      );
    }
  };

  public uploadSingle = (fieldName: string) => {
    return multer({
      storage: this.storage,
      fileFilter: this.fileFilter,
      limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
      },
    }).single(fieldName);
  };
}
