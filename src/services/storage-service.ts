import { ErrorFactory } from '../errors/error-factory.ts';
import { supabase } from '../infrastructure/database/supabase.ts';

export default class StorageService {
  uploadImageToSupabase = async (
    file: Express.Multer.File,
    bucketName: string,
    folderName: string,
  ) => {
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExt}`;
    const filePath = `${folderName}/${fileName}`;

    const fileBody = new Uint8Array(file.buffer).buffer;

    const { error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, fileBody, {
        contentType: file.mimetype,
      });

    if (error) {
      throw ErrorFactory.serverError(
        `Error upload file to bucket ${bucketName}: ${error.message}`,
      );
    }

    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return urlData;
  };

  private extractPathFromUrl = (publicUrl: string): string => {
    const urlParts = publicUrl.split(`/public/${storageConfig.bucketName}/`);

    if (urlParts.length !== 2) {
      return '';
    }

    return urlParts[1] as string;
  };

  deleteFileFromSupabase = async (publicUrl: string) => {
    const filePath = this.extractPathFromUrl(publicUrl);

    if (!filePath) {
      throw ErrorFactory.clientError('Url is not valid');
    }

    const { error, data } = await supabase.storage
      .from(storageConfig.bucketName)
      .remove([filePath]);

    if (error) {
      throw ErrorFactory.serverError(
        `Error delete file from bucket ${storageConfig.bucketName}: ${error.message}`,
      );
    }

    return data;
  };
}

export const storageConfig = {
  bucketName: 'eco-wise-media',
  scannedMedia: 'scanned-media',
  categories: 'waste-categories-media',
  avatarUrl: 'avatars-media',
};
