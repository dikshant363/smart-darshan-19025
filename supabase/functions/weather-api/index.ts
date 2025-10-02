import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WeatherRequest {
  temple_id: string;
  lat?: number;
  lon?: number;
}

const TEMPLE_COORDINATES: Record<string, { lat: number; lon: number }> = {
  'somnath': { lat: 20.8880, lon: 70.4015 },
  'dwarka': { lat: 22.2394, lon: 68.9685 },
  'ambaji': { lat: 24.3305, lon: 72.8537 },
  'pavagadh': { lat: 22.4809, lon: 73.5319 },
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { temple_id, lat, lon } = await req.json() as WeatherRequest;

    // Get coordinates
    const coords = TEMPLE_COORDINATES[temple_id?.toLowerCase()] || { lat: lat || 21.5222, lon: lon || 72.8777 };

    console.log('Fetching weather for coordinates:', coords);

    // Using Open-Meteo API (free, no API key required)
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia/Kolkata`;

    const response = await fetch(weatherUrl);

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.statusText}`);
    }

    const weatherData = await response.json();

    console.log('Weather data retrieved successfully');

    // Transform data for our app
    const current = weatherData.current;
    const daily = weatherData.daily;

    const result = {
      current: {
        temperature: Math.round(current.temperature_2m),
        humidity: current.relative_humidity_2m,
        windSpeed: Math.round(current.wind_speed_10m),
        weatherCode: current.weather_code,
        condition: getWeatherCondition(current.weather_code),
      },
      forecast: {
        maxTemp: Math.round(daily.temperature_2m_max[0]),
        minTemp: Math.round(daily.temperature_2m_min[0]),
        precipitationProbability: daily.precipitation_probability_max[0],
      },
      crowdImpact: analyzeCrowdImpact(current, daily),
      location: coords,
      timestamp: new Date().toISOString(),
    };

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in weather-api function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

function getWeatherCondition(code: number): string {
  if (code === 0) return 'Clear';
  if (code <= 3) return 'Partly Cloudy';
  if (code <= 48) return 'Foggy';
  if (code <= 67) return 'Rainy';
  if (code <= 77) return 'Snowy';
  if (code <= 82) return 'Heavy Rain';
  if (code <= 86) return 'Heavy Snow';
  return 'Stormy';
}

function analyzeCrowdImpact(current: any, daily: any): {
  level: 'low' | 'medium' | 'high';
  factors: string[];
} {
  const factors: string[] = [];
  let impactScore = 0;

  // Temperature impact
  if (current.temperature_2m > 35) {
    factors.push('High temperature may reduce crowd');
    impactScore += 1;
  } else if (current.temperature_2m < 15) {
    factors.push('Cold weather may reduce crowd');
    impactScore += 1;
  } else {
    factors.push('Pleasant weather may increase crowd');
    impactScore -= 1;
  }

  // Rain impact
  if (daily.precipitation_probability_max[0] > 60) {
    factors.push('High rain probability may significantly reduce crowd');
    impactScore += 2;
  } else if (daily.precipitation_probability_max[0] > 30) {
    factors.push('Rain possible, slight crowd reduction expected');
    impactScore += 1;
  }

  // Wind impact
  if (current.wind_speed_10m > 30) {
    factors.push('Strong winds may affect outdoor activities');
    impactScore += 1;
  }

  const level = impactScore >= 2 ? 'low' : impactScore <= -1 ? 'high' : 'medium';

  return { level, factors };
}
