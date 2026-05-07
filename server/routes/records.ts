import { Elysia } from "elysia";
import { addDays, subDays } from 'date-fns'
import extendPlugin from '@/utils/extend'
import type { RecordCreateInput, RecordUpdateInput } from "@/prisma/db/models";

const routes = new Elysia({ prefix: "/api/records" })
  .use(extendPlugin)
  // 获取所有记录（支持日期、类型筛选和分页）
  .get("/", async (ctx) => {
    const pagination = ctx.paginate(ctx.query)
    const where: any = {};
    if (ctx.query.date) {
      where.date = ctx.query.date;
    }
    const list = await ctx.db.record.findMany({
      where,
      orderBy: { time: 'asc' },
      take: pagination.size,
      skip: pagination.skip,
    })
    return ctx.success({ list })
  })

  // 创建记录（带业务逻辑验证）
  .post("/", async (ctx) => {
    try {
      const data = ctx.body as RecordCreateInput
      data.time = data.time ? new Date(data.time) : new Date()
      const record = await ctx.db.record.create({ data })
      return ctx.success({ info: record })
    } catch (error: any) {
      return ctx.failure(error.message)
    }
  })

  .get("/:date", async (ctx) => {
    try {
      const date = new Date(ctx.params.date)
      // 42天
      const start = subDays(date, (date.getDay() === 0 ? 7 : date.getDay()) - 1);
      const end = addDays(start, 41);
      const list = await ctx.db.record.findMany({
        where: { time: { gte: start, lte: end } },
      })
      return ctx.success({ list });
    } catch (error: any) {
      return ctx.failure(error.message)
    }
  })

  // 更新记录
  .put("/:id", async (ctx) => {
    try {
      await ctx.db.record.update({
        where: { id: ctx.params.id },
        data: ctx.body as RecordUpdateInput
      })
      return ctx.success()
    } catch (error: any) {
      return ctx.failure(error.message)
    }
  })

  // 删除记录
  .delete("/:id", async (ctx) => {
    try {
      await ctx.db.record.delete({ where: { id: ctx.params.id } })
      return ctx.success()
    } catch (error: any) {
      return ctx.failure(error.message);
    }
  })

export default routes