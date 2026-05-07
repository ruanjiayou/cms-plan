import { Elysia } from "elysia";
import db from "../prisma";
import extendPlugin from '@/utils/extend'
import type { TagUpdateInput, TagCreateInput } from "../prisma/db/models";

export const routes = new Elysia({ prefix: "/api/tags" })
  .use(extendPlugin)
  // 获取所有分类
  .get("/", async (ctx) => {
    const list = await db.tag.findMany({
      where: {},
      orderBy: { time: 'asc' }
    });
    return ctx.success({ list })
  })

  // 获取单个分类
  .get("/:id", async (ctx) => {
    const info = await db.tag.findFirst({ where: { id: ctx.params.id } })
    if (!info) {
      return ctx.failure('NotFound')
    }
    return ctx.success({ info });
  })

  // 创建分类
  .post("/", async (ctx) => {
    try {
      const data = ctx.body as TagCreateInput;

      const info = await db.tag.create({ data: { ...data } });
      return ctx.success({ info })
    } catch (error: any) {
      return ctx.failure(error.message)
    }
  })

  // 更新分类 
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

  // 删除分类（级联删除会删除关联的菜品）
  .delete("/:id", async (ctx) => {
    try {
      await db.tag.delete({ where: { id: ctx.params.id } })
      return ctx.success();
    } catch (error: any) {
      return ctx.failure(error.message)
    }
  })

export default routes