import { handle } from "hono/aws-lambda";
import { app } from "./router";

export const handler = handle(app);
