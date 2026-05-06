import { Elysia } from "elysia";
import db from "../prisma";
import Response from '../utils/Response'
import type { TagUpdateInput, TagCreateInput } from "../prisma/db/models";

export const routes = new Elysia({ prefix: "/api/tags" })
  .decorate('Response', new Response())
  // 获取所有分类
  .get("/", async ({ Response }) => {
    const list = await db.tag.findMany({
      where: {},
      orderBy: { time: 'asc' }
    });
    return Response.success({ list })
  })

  // 获取单个分类
  .get("/:id", async ({ params, Response }) => {
    const info = await db.tag.findFirst({ where: { id: params.id } })
    if (!info) {
      return Response.failure('NotFound')
    }
    return Response.success({ info });
  })

  // 创建分类
  .post("/", async ({ body, Response }) => {
    try {
      const data = body as TagCreateInput;

      const info = await db.tag.create({ data: { ...data } });
      return Response.success({ info })
    } catch (error: any) {
      return Response.failure(error.message)
    }
  })

  // 更新分类 
  .put("/:id",
    async ({ params, body, Response }) => {
      try {
        await db.tag.update({
          where: { id: params.id },
          data: body as TagUpdateInput
        })
        return Response.success()
      } catch (error: any) {
        return Response.failure(error.message)
      }
    })

  // 删除分类（级联删除会删除关联的菜品）
  .delete("/:id", async ({ params, Response }) => {
    try {
      await db.tag.delete({ where: { id: params.id } })
      return Response.success();
    } catch (error: any) {
      return Response.failure(error.message)
    }
  })

export default routes