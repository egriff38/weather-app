import { Hono } from "hono";
import { cors } from "hono/cors";
import { weatherRouter } from "./weather-router";
if (!process.env.WEB_ORIGIN) {
  throw new Error("WEB_ORIGIN is not set");
}
export const app = new Hono()
  .use(
    "/*",
    cors({
      origin: process.env.WEB_ORIGIN,
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization"],
      exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
      maxAge: 600,
      credentials: true,
    })
  )
  .get("/", (c) => {
    return c.text("Hello Hono!!");
  })
  .route("/weather", weatherRouter);

export type AppSession = typeof app;
