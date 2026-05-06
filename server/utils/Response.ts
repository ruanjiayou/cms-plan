// 统一响应类型
export interface SuccessResponse<T = any> {
  code: number;
  data: {
    list: T[],
    page?: number,
    more?: boolean,
    total?: number,
    next_cursor?: string,
  } | {
    info: T,
  };
  success: boolean,
  message?: string;
}

export interface ErrorResponse {
  code: number;
  success: false,
  message: string;
}

export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;

// 查询参数
export interface QueryParams {
  page?: number;
  size?: number;
  sort?: string;
  count?: string;
  cursor?: string;
}

export default class Response {
  success(data?: any, param: { [key: string]: any } = {}) {
    const result = { success: true, code: 0, message: '', data }
    if (!data) {
      delete result.data;
    }
    return result;
  }
  failure(message: string, code: number = -1) {
    return { code, message, success: false };
  }
}