export type WeatherKind = "clear" | "cloudy" | "light_rain" | "heavy_rain" | "storm";

export interface ClimateSnapshot {
  day: number;
  hour: number;
  minute: number;
  light: number;
  weather: WeatherKind;
  rain: number;
  cloud: number;
}

const GAME_SECONDS_PER_REAL_SECOND = 60;
const WEATHER_PERIOD_GAME_HOURS = 3;
const WEATHER: WeatherKind[] = ["clear", "cloudy", "light_rain", "cloudy", "clear", "heavy_rain", "storm", "light_rain"];

function hash(n: number) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
}

export function createClimateClock(seed: number) {
  let gameSeconds = 8 * 3600;
  let speed = 1;

  const setSpeed = (value: 0 | 1 | 2 | 4) => { speed = value; };
  const getSpeed = () => speed;

  const tick = (realSeconds: number) => {
    gameSeconds += realSeconds * GAME_SECONDS_PER_REAL_SECOND * speed;
  };

  const snapshot = (): ClimateSnapshot => {
    const totalHours = gameSeconds / 3600;
    const day = Math.floor(totalHours / 24) + 1;
    const hourFloat = totalHours % 24;
    const hour = Math.floor(hourFloat);
    // Avoid floating-point underflow at exact minute boundaries (e.g. ×2 -> 08:01).
    const minute = Math.min(59, Math.floor((hourFloat - hour) * 60 + 1e-8));
    const solar = Math.sin(((hourFloat - 6) / 12) * Math.PI);
    const light = Math.max(0.12, Math.min(1, solar * 0.88 + 0.12));
    const slot = Math.floor(totalHours / WEATHER_PERIOD_GAME_HOURS);
    const offset = Math.floor(hash(seed + slot) * WEATHER.length);
    const weather = WEATHER[(slot + offset) % WEATHER.length];
    const rain = weather === "light_rain" ? 0.28 : weather === "heavy_rain" ? 0.58 : weather === "storm" ? 0.85 : 0;
    const cloud = weather === "clear" ? 0.05 : weather === "cloudy" ? 0.42 : Math.min(0.95, rain + 0.22);
    return { day, hour, minute, light, weather, rain, cloud };
  };

  return { tick, snapshot, setSpeed, getSpeed };
}

export function weatherLabel(weather: WeatherKind, language: "es" | "en" = "es") {
  if (language === "en") {
    switch (weather) {
      case "clear": return "Clear";
      case "cloudy": return "Cloudy";
      case "light_rain": return "Light rain";
      case "heavy_rain": return "Heavy rain";
      case "storm": return "Storm";
    }
  }
  switch (weather) {
    case "clear": return "Despejado";
    case "cloudy": return "Nublado";
    case "light_rain": return "Lluvia ligera";
    case "heavy_rain": return "Lluvia fuerte";
    case "storm": return "Tormenta";
  }
}
