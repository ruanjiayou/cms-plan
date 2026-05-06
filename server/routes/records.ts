import { Elysia } from "elysia";
import { keyBy } from 'lodash'
import { addDays, addHours, endOfDay, startOfDay, subDays, subMonths, addMonths } from 'date-fns'
import db from "../prisma";
import Response from '../utils/Response'
import type { RecordCreateInput, RecordUpdateInput } from "../prisma/db/models";

const routes = new Elysia({ prefix: "/api/records" })
  .decorate('Response', new Response())

  // 获取所有记录（支持日期、类型筛选和分页）
  .get("/", async ({ query, Response }) => {
    const where: any = {};
    if (query.date) {
      where.date = query.date;
    }
    const list = await db.record.findMany({
      where,
      orderBy: {}
    })
    return Response.success({ list })
  })

  // 创建记录（带业务逻辑验证）
  .post("/", async ({ body, Response }) => {
    try {
      const data = body as RecordCreateInput
      data.time = addHours(new Date(data.time), 16)
      const record = await db.record.create({ data })
      return Response.success({ info: record })
    } catch (error: any) {
      return Response.failure(error.message)
    }
  })

  .get("/:date", async ({ params, Response }) => {
    try {
      const date = new Date(params.date)
      // 42天
      const start = subDays(date, (date.getDay() === 0 ? 7 : date.getDay()) - 1);
      const end = addDays(start, 41);
      const list = await db.record.findMany({
        where: { time: { gte: start, lte: end } },
      })
      return Response.success({ list });
    } catch (error: any) {
      return Response.failure(error.message)
    }
  })

  // 更新记录
  .put("/:id", async ({ params, body, Response }) => {
    try {
      await db.record.update({
        where: { id: params.id },
        data: body as RecordUpdateInput
      })
      return Response.success()
    } catch (error: any) {
      return Response.failure(error.message)
    }
  })

  // 删除记录
  .delete("/:id", async ({ params, Response }) => {
    try {
      await db.record.delete({ where: { id: params.id } })
      return Response.success()
    } catch (error: any) {
      return Response.failure(error.message);
    }
  })

export default routes