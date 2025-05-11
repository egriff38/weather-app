import { OpenWeatherAPI, Location, Options } from "openweather-api-node";
import { HTTPException } from "hono/http-exception";
import { useWeatherService } from "./services";

export class CityLookup {
  constructor(private readonly ow: OpenWeatherAPI = useWeatherService()) {}

  async lookupCity(cityOrZip: string) {
    if (CityLookup.isZip(cityOrZip)) {
      const res = await this.ow.getLocation({
        zipCode: cityOrZip,
      });
      if (res) {
        return [new City(res)];
      }
    }
    const res = await this.ow.getAllLocations(cityOrZip, {});
    return res.map((city) => new City(city));
  }
  async getCity(opts: Options) {
    const res = await this.ow.getLocation(opts);
    if (!res)
      throw new HTTPException(404, {
        message: "City not found",
      });
    return new City(res);
  }
  static isZip(cityOrZip: string) {
    return /^\d{5}$/.test(cityOrZip);
  }
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
  static from(opts: Options, ow: OpenWeatherAPI = useWeatherService()) {
    const lookup = new CityLookup(ow);
    return lookup.getCity(opts);
  }
}
