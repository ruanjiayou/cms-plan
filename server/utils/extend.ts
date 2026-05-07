import { Elysia } from 'elysia';
import db from "@/prisma";

const getNumber = (value: any, defaultValue: number) => {
  if (!value) return defaultValue;
  const num = parseInt(value);
  return isNaN(num) ? defaultValue : num;
};

function paginate(query: { [key: string]: string }) {
  let page = getNumber(query.page, 1)
  let size = getNumber(query.size, 1)
  const skip = (Math.max(1, page) - 1) * Math.min(100, Math.max(1, size))
  return { page, size, skip }
}
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

function success(data?: any, param: { [key: string]: any } = {}) {
  const result = { success: true, code: 0, message: '', data }
  if (!data) {
    delete result.data;
  }
  return result;
}

function failure(message: string, code: number = -1) {
  return { code, message, success: false };
}

const extendPlugin = new Elysia({ name: 'extend' })
  .decorate('paginate', paginate)
  .decorate('success', success)
  .decorate('failure', failure)
  .decorate('db', db)
  .as('global');

export default extendPlugin;