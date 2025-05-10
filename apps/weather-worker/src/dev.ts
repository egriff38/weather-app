import "dotenv/config";
import { app } from "./router";
import { serve } from "@hono/node-server";

console.log("Starting server on http://localhost:3000");

serve({
  fetch: app.fetch,
  port: 3000,
});
