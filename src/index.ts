import { Router } from 'itty-router';
import {
  getCityByLocationOpenWeather,
  getCityByNameOpenWeather,
  getWeatherOpenWeather,
} from './api/openWeather';

// Create a new router
const router = Router();

router.get('/data/2.5/onecall', async (request) => {
  const lat = request.query?.lat ? Number(request.query?.lat) : null;
  const lon = request.query?.lon ? Number(request.query?.lon) : null;
  const lang = request.query?.lang ?? '';

  if (lat == null || lon == null) {
    return new Response('lat or lon is not set', {
      status: 400,
      statusText: 'lat and lon need to be set',
    });
  }

  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return new Response('lat or lon is not a number', {
      status: 400,
      statusText: 'lat and lon need to be a number',
    });
  }

  const res = await getWeatherOpenWeather(lat, lon, lang);

  return new Response(JSON.stringify(res), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
});

router.get('/geo/1.0/reverse', async (request) => {
  const lat = request.query?.lat ? Number(request.query?.lat) : null;
  const lon = request.query?.lon ? Number(request.query?.lon) : null;

  if (lat == null || lon == null) {
    return new Response('lat or lon is not set', {
      status: 400,
      statusText: 'lat and lon need to be set',
    });
  }

  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return new Response('lat or lon is not a number', {
      status: 400,
      statusText: 'lat and lon need to be a number',
    });
  }

  const res = await getCityByLocationOpenWeather(lat, lon);

  return new Response(JSON.stringify(res), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
});

router.get('/geo/1.0/direct', async (request) => {
  const cityName = request.query?.q;
  const limitParam = Number(request.query?.limit);
  const limit = Number.isNaN(limitParam) ? 10 : limitParam;

  if (cityName == null || cityName === '') {
    return new Response('q not set', {
      status: 400,
      statusText: 'q needs to be set',
    });
  }

  const res = await getCityByNameOpenWeather(cityName, limit);

  return new Response(JSON.stringify(res), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
});

/*
This is the last route we define, it will match anything that hasn't hit a route we've defined
above, therefore it's useful as a 404 (and avoids us hitting worker exceptions, so make sure to include it!).

Visit any page that doesn't exist (e.g. /foobar) to see it in action.
*/
router.all('*', () => new Response('404, not found!', { status: 404 }));

/*
This snippet ties our worker to the router we deifned above, all incoming requests
are passed to the router where your routes are called and the response is sent.
*/
addEventListener('fetch', (e: FetchEvent) => {
  e.respondWith(router.handle(e.request));
});
