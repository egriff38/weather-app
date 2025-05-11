import OpenWeatherAPI from "openweather-api-node";
import { once } from "typedash";

export const useWeatherService = once(() => {
  if (!process.env.OPENWEATHER_API_KEY)
    throw new Error("OPENWEATHER_API_KEY is not set");
  const ow = new OpenWeatherAPI({
    key: process.env.OPENWEATHER_API_KEY,
  });
  return ow;
});
