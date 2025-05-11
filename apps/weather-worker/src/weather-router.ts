import { Hono } from "hono";
import { City, searchCity } from "./lib/cityLookup";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

export const weatherRouter = new Hono()
  .get(
    "/lookup",
    zValidator(
      "query",
      z.object({
        q: z.string(),
      })
    ),
    async (c) => {
      const { q: query } = c.req.valid("query");
      const cities = await searchCity(query);
      return c.json(cities);
    }
  )
  .get(
    "/weather",
    zValidator(
      "query",
      z.object({
        lat: z.coerce.number(),
        lon: z.coerce.number(),
      })
    ),
    async (c) => {
      const { lat, lon } = c.req.valid("query");
      const city = await City.from({ coordinates: { lat, lon } });
      const weather = await city.getWeather();
      return c.json(weather);
    }
  );
