import type { AppSession } from "weather-worker/router";
import { hc, type ClientRequestOptions } from "hono/client";

export const createClient = (url: string, opts?: ClientRequestOptions) => {
  return hc<AppSession>(url, opts);
};

export type WeatherClient = ReturnType<typeof createClient>;
