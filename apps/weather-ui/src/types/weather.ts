import type { ForecastWeather } from "weather-client";

type DateToString<T> = T extends Date
  ? string
  : T extends object
  ? { [K in keyof T]: DateToString<T[K]> }
  : T;

export type SerializedForecastWeather = DateToString<ForecastWeather>;
