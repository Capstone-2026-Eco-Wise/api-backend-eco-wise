import type { Response } from 'express';

class ResponseServer {
  private static templateResponse(
    res: Response,
    code: number,

    message: string,
    data: unknown,
    fromCacher: boolean = false,
  ) {
    res.set('X-Data-Source', fromCacher ? 'cache' : 'database');

    return res.status(code).json({
      message,
      data,
    });
  }

  private static paginationTemplate(
    res: Response,
    code: number,
    message: string,
    data: unknown,
    totalData: number,
    limit: number,
    fromCacher: boolean = false,
    page: number = 1,
  ) {
    const totalPage = Math.ceil(totalData / limit);
    res.set('X-Data-Source', fromCacher ? 'cache' : 'database');

    return res.status(code).json({
      message,
      data,
      pagination: {
        page,
        limit,
        totalData,
        totalPage,
      },
    });
  }

  public static success(
    res: Response,
    code: number,
    message: string,
    data: unknown,
    fromCacher: boolean = false,
  ) {
    return this.templateResponse(res, code, message, data, fromCacher);
  }

  public static error(
    res: Response,
    code: number,
    message: string,
    data = null,
  ) {
    return this.templateResponse(res, code, message, data);
  }

  public static paginationSuccess(
    res: Response,
    message: string,
    data: unknown,
    totalData: number,
    limit: number,
    page: number = 1,
    fromCacher: boolean = false,
  ) {
    return this.paginationTemplate(
      res,
      200,
      message,
      data,
      totalData,
      limit,
      fromCacher,
      page,
    );
  }
}

export default ResponseServer;
