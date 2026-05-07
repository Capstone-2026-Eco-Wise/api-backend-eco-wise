import axios from 'axios';
import FormData from 'form-data';
import { ErrorFactory } from '../errors/error-factory.ts';
import { env } from '../utils/env.ts';
import { logger } from '../infrastructure/logger/logger.ts';
import type { ResponseAiType } from '../types/scan-history-type.ts';

const instanceApi = axios.create({
  baseURL: env.AI_API_URL,
});

export default class AiService {
  private serviceName: string;

  constructor() {
    this.serviceName = '[AI Service]';
  }

  async classifyImage(file: Express.Multer.File) {
    try {
      logger.info(`${this.serviceName} classifying image`);

      const formData = new FormData();
      formData.append('file', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      });

      const response = await instanceApi.post('/predict', formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });

      if (!response.data) {
        throw ErrorFactory.clientError('Invalid response from AI service', 400);
      }

      logger.info(`${this.serviceName} image classified successfully`);

      return response.data as ResponseAiType;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw ErrorFactory.clientError(
            error.response.data?.message ||
              'An error occurred in the AI Service',
            error.response.status,
          );
        } else if (error.request) {
          throw ErrorFactory.serverError(
            'AI Service is currently unavailable or undergoing maintenance. Please try again later.',
          );
        }
      }

      ErrorFactory.handlerServiceError(error, this.serviceName);
    }
  }
}
