import type { Request } from 'express';
import type { FileFilterCallback, StorageEngine } from 'multer';
import multer from 'multer';
import path from 'node:path';

class UploadMiddleware {
  private storage: StorageEngine;

  constructor() {
    this.storage = this.configureStorage();
    this.fileFilter = this.fileFilter.bind(this);
  }

  private configureStorage() {
    return multer.diskStorage({
      filename: (req, file, callback) => {
        const ext = path.extname(file.originalname);
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        callback(null, uniqueName);
      },
    });
  }

  private fileFilter(
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, JPEG, PNG files are allowed'));
    }
  }

  /**
   * upload single file
   */
  public uploadSingle(fieldName: string) {
    return multer({
      storage: this.storage,
      fileFilter: this.fileFilter,
      limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
      },
    }).single(fieldName);
  }
}

export default new UploadMiddleware();
