import { useWeatherService } from "./lib/services";
import * as C from "./lib/cityLookup";

Object.assign(
  globalThis,
  {
    ow: useWeatherService(),
  },
  C
);
