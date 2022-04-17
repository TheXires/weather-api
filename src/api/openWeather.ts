import { City } from '../types/location';
import { Weather, WeatherOpenWeather } from '../types/weather';
import { openWeatherToGeneric } from '../util/mapWeatherData';

const baseUrl = 'https://api.openweathermap.org';

export const getWeatherOpenWeather = async (
  lat: number,
  lon: number,
  lang: string,
): Promise<Weather | undefined> => {
  console.log('called api weather data');

  try {
    const res = await fetch(
      // @ts-ignore
      `${baseUrl}/data/2.5/onecall?lat=${lat}&lon=${lon}&lang=${lang}&units=metric&exclude=minutely,alerts&appid=${api_key}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const data: WeatherOpenWeather = await res.json();
    return openWeatherToGeneric(data);
  } catch (error) {
    console.log('getWeatherOpenWeather error: ', error);
    return undefined;
  }
};

export const getCityByLocationOpenWeather = async (lat: number, lon: number) => {
  console.log('called api city by location data');

  try {
    const res = await fetch(
      // @ts-ignore
      `${baseUrl}/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${api_key}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const cities: City[] = await res.json();
    return cities[0];
  } catch (error) {
    console.error('getCityOpenWeather error: ', error);
    return error;
  }
};

export const getCityByNameOpenWeather = async (cityName: string, limit: number = 10) => {
  console.log('called getCityByNameOpenWeather');

  try {
    const res = await fetch(
      // @ts-ignore
      `${baseUrl}/geo/1.0/direct?q=${cityName}&limit=${limit}&appid=${api_key}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(JSON.stringify(error));
    return error;
  }
};
