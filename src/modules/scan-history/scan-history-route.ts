import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth-middleware.ts';
import UploadMiddleware from '../../middlewares/upload-middleware.ts';
import { container } from '../../utils/container.ts';
import ScanHistoryController from './scan-history-controller.ts';

class ScanHistoryRoute {
  private scanHistoryRoute: Router;
  private scanHistoryController: ScanHistoryController;
  private uploadMiddleware: UploadMiddleware;

  constructor() {
    this.scanHistoryRoute = Router();
    this.scanHistoryController = new ScanHistoryController(
      container.scanHistoryService,
    );
    this.uploadMiddleware = new UploadMiddleware();
    this.routes();
  }

  routes(): Router {
    this.scanHistoryRoute.post(
      '/',
      authMiddleware,
      this.uploadMiddleware.uploadSingle('image'),
      this.scanHistoryController.scan,
    );
    this.scanHistoryRoute.get(
      '/',
      authMiddleware,
      this.scanHistoryController.getAll,
    );
    this.scanHistoryRoute.get(
      '/:id',
      authMiddleware,
      this.scanHistoryController.getById,
    );

    return this.scanHistoryRoute;
  }
}

export default new ScanHistoryRoute().routes();
