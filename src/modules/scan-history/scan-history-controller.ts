import type { Request, Response } from 'express';
import ResponseServer from '../../utils/response-server.ts';
import type ScanHistoryService from './scan-history-service.ts';

export default class ScanHistoryController {
  private scanHistoryService: ScanHistoryService;

  constructor(scanHistoryService: ScanHistoryService) {
    this.scanHistoryService = scanHistoryService;
  }

  scan = async (req: Request, res: Response) => {
    if (!req.user) {
      return ResponseServer.error(res, 401, 'Unauthorized');
    }

    if (!req.file) {
      return ResponseServer.error(res, 400, 'Image not found');
    }

    const result = await this.scanHistoryService.processUserScan(
      req.user,
      req.file,
    );

    return ResponseServer.success(res, 201, 'Successfully predicted', result);
  };

  getAll = async (req: Request, res: Response) => {
    if (!req.user) {
      return ResponseServer.error(res, 401, 'Unauthorized');
    }

    const { fromCache, scanHistory } =
      await this.scanHistoryService.getScanHistoryUser(req.user);

    return ResponseServer.success(
      res,
      200,
      'Successfully fetched history scan',
      scanHistory,
      fromCache,
    );
  };

  getById = async (req: Request, res: Response) => {
    if (!req.user) {
      return ResponseServer.error(res, 401, 'Unauthorized');
    }

    const result = await this.scanHistoryService.getScanHistoryDetail(
      req.params.id as string,
      req.user,
    );

    return ResponseServer.success(
      res,
      200,
      'Successfully fetched scan history detail',
      result,
    );
  };
}
