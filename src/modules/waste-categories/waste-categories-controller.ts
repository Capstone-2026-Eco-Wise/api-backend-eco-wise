import type { Request, Response } from 'express';
import ResponseServer from '../../utils/response-server.ts';
import type WasteCategoriesService from './waste-categories-service.ts';

export default class WasteCategoriesController {
  private wasteCategoriesService: WasteCategoriesService;

  constructor(wasteCategoriesService: WasteCategoriesService) {
    this.wasteCategoriesService = wasteCategoriesService;
  }

  create = async (req: Request, res: Response) => {
    const wasteCategory = await this.wasteCategoriesService.createWasteCategory(
      req.body,
    );

    return ResponseServer.success(
      res,
      201,
      'Succesfully create waste category',
      wasteCategory,
    );
  };

  getAll = async (req: Request, res: Response) => {
    const { fromCache, wasteCategories } =
      await this.wasteCategoriesService.getAllWasteCategories();

    return ResponseServer.success(
      res,
      200,
      'Succesfully get all waste categories',
      wasteCategories,
      fromCache,
    );
  };

  getById = async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await this.wasteCategoriesService.getWasteCategoryById(
      id as string,
    );

    return ResponseServer.success(
      res,
      200,
      'Successfully get waste category by id',
      result,
    );
  };

  update = async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await this.wasteCategoriesService.updateWasteCategory({
      id: id as string,
      ...req.body,
    });

    return ResponseServer.success(
      res,
      200,
      'Successfully update waste category',
      result,
    );
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await this.wasteCategoriesService.deleteWasteCategory(
      id as string,
    );

    return ResponseServer.success(
      res,
      200,
      'Successfully delete waste category',
      result,
    );
  };
}
