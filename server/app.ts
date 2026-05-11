import { Elysia } from "elysia";
import cors from "@elysiajs/cors";
import tagRoute from './routes/tags'
import recordRoute from './routes/records'
import extendPlugin from "./utils/extend";

const PORT = process.env.PORT;

export const app = new Elysia()
  .use(cors({
    origin: true,           // 允许所有来源
    credentials: false,      // 允许携带凭证
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    preflight: true         // 关键：启用预检请求处理
  }))
  .onBeforeHandle(({ set }) => {
    // 处理pwa进行缓存报错的问题
    set.headers['vary'] = 'Accept-Encoding'
  })
  .use(extendPlugin)
  // 健康检查
  .get("/", (ctx) => ({
    success: true,
    message: "计划通",
    version: "1.0.0",
  }))
  // 注册路由
  .use(tagRoute)
  .use(recordRoute)
  .listen(PORT);

console.log(`🌐 服务器运行在 http://localhost:${PORT}`);
