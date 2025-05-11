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
        return [new City(res, this.ow)];
      }
    }
    const res = await this.ow.getAllLocations(cityOrZip, {});
    return res.map((city) => new City(city, this.ow));
  }
  async getCity(opts: Options) {
    const res = await this.ow.getLocation(opts);
    if (!res)
      throw new HTTPException(404, {
        message: "City not found",
      });
    return new City(res, this.ow);
  }
  static isZip(cityOrZip: string) {
    return /^\d{5}$/.test(cityOrZip);
  }
}

export class City {
  constructor(
    public readonly location: Location,
    private readonly ow: OpenWeatherAPI = useWeatherService()
  ) {}

  async getWeather() {
    const res = await this.ow.getForecast(1, {
      coordinates: this.location,
    });
    return res[0];
  }
  static from(opts: Options, ow: OpenWeatherAPI = useWeatherService()) {
    const lookup = new CityLookup(ow);
    return lookup.getCity(opts);
  }
}
