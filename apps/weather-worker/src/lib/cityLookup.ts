import { OpenWeatherAPI, Location, Options } from "openweather-api-node";
import { HTTPException } from "hono/http-exception";
import { useWeatherService } from "./services";

export function isZip(cityOrZip: string) {
  return /^\d{5}$/.test(cityOrZip);
}

export async function searchCity(
  cityOrZip: string,
  ow: OpenWeatherAPI = useWeatherService()
): Promise<Location[]> {
  if (isZip(cityOrZip)) {
    try {
      const res = await ow.getLocation({
        zipCode: cityOrZip,
      });
      if (res) {
        return [res];
      }
    } catch (e) {
      throw new HTTPException(404, {
        message: `City not found with zip code ${cityOrZip}`,
        cause: e,
      });
    }
  }
  const res = await ow.getAllLocations(cityOrZip, {});
  return res;
}

export class City {
  readonly name: string;
  readonly country: string;
  readonly state?: string;
  readonly coordinates: {
    latitude: number;
    longitude: number;
  };
  constructor(location: Location) {
    this.name = location.name;
    this.country = location.country;
    this.state = location.state;
    this.coordinates = {
      latitude: location.lat,
      longitude: location.lon,
    };
  }

  async getWeather(ow: OpenWeatherAPI = useWeatherService()) {
    const res = await ow.getForecast(1, {
      coordinates: {
        lat: this.coordinates.latitude,
        lon: this.coordinates.longitude,
      },
    });
    return res[0];
  }
  static async from(opts: Options, ow: OpenWeatherAPI = useWeatherService()) {
    const res = await ow.getLocation(opts);
    if (!res)
      throw new HTTPException(404, {
        message: "City not found",
      });
    return new City(res);
  }
}
