import { Hono } from "hono";
import { CityLookup } from "./lib/cityLookup";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

export const weatherRouter = new Hono().get(
  "/lookup",
  zValidator(
    "query",
    z.object({
      q: z.string(),
    })
  ),
  async (c) => {
    const query = c.req.query("q");
    if (!query) {
      return c.json({ error: "City is required" }, 400);
    }
    const cities = await new CityLookup().lookupCity(query);
    return c.json(cities);
  }
);
