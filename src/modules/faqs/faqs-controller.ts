import type { Request, Response } from 'express';
import ResponseServer from '../../utils/response-server.ts';
import type FaqsService from './faqs-service.ts';

export default class FaqsController {
  private faqsService: FaqsService;

  constructor(faqsService: FaqsService) {
    this.faqsService = faqsService;
  }

  create = async (req: Request, res: Response) => {
    const faqs = await this.faqsService.createFAQ({
      ...req.body,
      createdBy: req.user?.id,
    });

    return ResponseServer.success(res, 201, 'FAQ created successfully', faqs);
  };

  getPublicFAQs = async (req: Request, res: Response) => {
    const { category } = req.query;

    const { faqs, fromCache } = await this.faqsService.getFAQSForPublic({
      category: category as string,
    });

    return ResponseServer.success(
      res,
      200,
      'FAQs retrieved successfully',
      faqs,
      fromCache,
    );
  };

  getFAQsCreator = async (req: Request, res: Response) => {
    if (!req.user) {
      return ResponseServer.error(res, 401, 'Unauthorized');
    }

    const { faqs, fromCache } = await this.faqsService.getFAQSByCreator(
      req.user,
    );

    return ResponseServer.success(
      res,
      200,
      'FAQs retrieved successfully',
      faqs,
      fromCache,
    );
  };

  updateByCreator = async (req: Request, res: Response) => {
    const { id } = req.params;

    const faqs = await this.faqsService.updateFAQByCreator({
      ...req.body,
      id,
      createdBy: req.user?.id,
      updatedBy: req.user?.id,
    });

    return ResponseServer.success(res, 200, 'FAQ updated successfully', faqs);
  };

  deleteByCreator = async (req: Request, res: Response) => {
    const { id } = req.params;

    const faqs = await this.faqsService.deleteFAQCreator({
      id: id as string,
      createdBy: req.user?.id as string,
    });

    return ResponseServer.success(res, 200, 'FAQ deleted successfully', faqs);
  };
}
