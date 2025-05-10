import { provide, type InjectionKey, inject } from "vue";
import { createClient, type WeatherClient } from "weather-client";

const WEATHER_CLIENT_INJECT_KEY: InjectionKey<WeatherClient> = Symbol(
  "WEATHER_CLIENT_INJECT_KEY"
);
export const provideWebClient = () =>
  provide(
    WEATHER_CLIENT_INJECT_KEY,
    createClient(import.meta.env.VITE_API_URL)
  );

export const useWebClient = () => {
  const client = inject(WEATHER_CLIENT_INJECT_KEY);
  if (!client)
    throw new Error(
      "No injection found; call provideWebClient() in an ancestor component"
    );
  return client;
};
