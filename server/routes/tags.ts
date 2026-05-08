import { Elysia } from "elysia";
import db from "../prisma";
import extendPlugin from '@/utils/extend'
import type { TagUpdateInput, TagCreateInput } from "../prisma/db/models";

export const routes = new Elysia({ prefix: "/api/tags" })
  .use(extendPlugin)
  // 获取所有标签
  .get("/", async (ctx) => {
    const list = await db.tag.findMany({
      where: {},
      orderBy: { time: 'asc' }
    });
    return ctx.success({ list })
  })

  // 获取单个标签
  .get("/:id", async (ctx) => {
    const info = await db.tag.findFirst({ where: { id: ctx.params.id } })
    if (!info) {
      return ctx.failure('NotFound')
    }
    return ctx.success({ info });
  })

  // 创建标签
  .post("/", async (ctx) => {
    try {
      const data = ctx.body as TagCreateInput;
      data.time = new Date();

      const info = await db.tag.create({ data: { ...data } });
      return ctx.success({ info })
    } catch (error: any) {
      return ctx.failure(error.message)
    }
  })

  // 更新标签
  .put("/:id",
    async (ctx) => {
      try {
        await db.tag.update({
          where: { id: ctx.params.id },
          data: ctx.body as TagUpdateInput
        })
        return ctx.success()
      } catch (error: any) {
        return ctx.failure(error.message)
      }
    })

  // 删除标签
  .delete("/:id", async (ctx) => {
    try {
      await db.tag.delete({ where: { id: ctx.params.id } })
      return ctx.success();
    } catch (error: any) {
      return ctx.failure(error.message)
    }
  })

export default routes