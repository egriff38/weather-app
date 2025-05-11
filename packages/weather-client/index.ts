import type { AppSession } from "weather-worker/lib";
import { hc, type ClientRequestOptions } from "hono/client";

export const createClient = (url: string, opts?: ClientRequestOptions) => {
  return hc<AppSession>(url, opts);
};

export type WeatherClient = ReturnType<typeof createClient>;

// Re-export types from weather-worker
export type {
  AirPollution,
  ForecastWeather,
  Location,
} from "weather-worker/lib";
