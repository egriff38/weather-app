<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useWebClient } from "@/providers/apiClientProvider";
import type { Location } from "weather-client";
import type { SerializedForecastWeather } from "@/types/weather";
import iWiDaySunny from "virtual:icons/wi/day-sunny";
import iWiNightClear from "virtual:icons/wi/night-clear";
import iWiCloudy from "virtual:icons/wi/cloudy";
import iWiRain from "virtual:icons/wi/rain";
import iWiSnow from "virtual:icons/wi/snow";
import iWiThunderstorm from "virtual:icons/wi/thunderstorm";
import iWiFog from "virtual:icons/wi/fog";
import iWiHumidity from "virtual:icons/wi/humidity";
import iWiStrongWind from "virtual:icons/wi/strong-wind";
import iWiBarometer from "virtual:icons/wi/barometer";
import iWiSunrise from "virtual:icons/wi/sunrise";
import iWiSunset from "virtual:icons/wi/sunset";

const props = defineProps<{
  location: Location | null;
}>();

const forecast = ref<SerializedForecastWeather>();
const isLoading = ref(false);
const error = ref<string | null>(null);

const {
  weather: {
    weather: { $get: getCurrentWeather },
  },
} = useWebClient();

const fetchWeather = async () => {
  if (!props.location) {
    forecast.value = undefined;
    return;
  }

  try {
    isLoading.value = true;
    error.value = null;
    const response = await getCurrentWeather({
      query: {
        lat: props.location.lat.toString(),
        lon: props.location.lon.toString(),
      },
    });
    const data = await response.json();
    forecast.value = data;
  } catch (err) {
    console.error("Error fetching weather:", err);
    error.value = "Failed to load weather data";
    forecast.value = undefined;
  } finally {
    isLoading.value = false;
  }
};

watch(() => props.location, fetchWeather, { immediate: true });

const getWeatherIcon = computed(() => {
  if (!forecast.value) return iWiDaySunny;

  const desc = forecast.value.weather.description.toLowerCase();
  const hour = new Date().getHours();
  const isNight = hour < 6 || hour > 18;

  if (desc.includes("clear")) return isNight ? iWiNightClear : iWiDaySunny;
  if (desc.includes("cloud")) return iWiCloudy;
  if (desc.includes("rain")) return iWiRain;
  if (desc.includes("snow")) return iWiSnow;
  if (desc.includes("thunder")) return iWiThunderstorm;
  if (desc.includes("fog") || desc.includes("mist")) return iWiFog;

  return iWiDaySunny;
});

const formatTime = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDate = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};
</script>

<template>
  <div class="weather-dashboard">
    <div v-if="!location" class="no-location">
      Select a location to view weather data
    </div>
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    <div
      v-else-if="forecast"
      class="forecast-grid"
      :class="{ 'is-loading': isLoading }"
    >
      <div class="weather-card main-weather">
        <div class="weather-icon">
          <component :is="getWeatherIcon" class="icon" />
        </div>
        <div class="card-content">
          <div class="card-title">Current Weather</div>
          <div class="card-value temperature">
            {{ Math.round(forecast.weather.temp.cur) }}°C
          </div>
          <div class="card-value feels-like">
            Feels like {{ Math.round(forecast.weather.feelsLike.cur) }}°C
          </div>
          <div class="card-value description">
            {{ forecast.weather.description }}
          </div>
          <div class="card-value date">
            {{ formatDate(forecast.astronomical.sunriseRaw) }}
          </div>
        </div>
      </div>

      <div class="bottom-cards">
        <div class="weather-card conditions">
          <div class="card-content">
            <div class="card-title">Conditions</div>
            <div class="conditions-grid">
              <div class="condition-item">
                <i-wi-humidity class="icon" />
                <span>{{ forecast.weather.humidity }}%</span>
              </div>
              <div class="condition-item">
                <i-wi-strong-wind class="icon" />
                <span>{{ Math.round(forecast.weather.wind.speed) }} m/s</span>
              </div>
              <div class="condition-item">
                <i-wi-barometer class="icon" />
                <span>{{ forecast.weather.pressure }} hPa</span>
              </div>
              <div class="condition-item">
                <i-wi-cloudy class="icon" />
                <span>{{ forecast.weather.clouds }}%</span>
              </div>
            </div>
          </div>
        </div>

        <div class="weather-card sun-times">
          <div class="card-content">
            <div class="card-title">Sun Times</div>
            <div class="sun-times-grid">
              <div class="sun-time">
                <i-wi-sunrise class="icon" />
                <span>{{ formatTime(forecast.astronomical.sunriseRaw) }}</span>
              </div>
              <div class="sun-time">
                <i-wi-sunset class="icon" />
                <span>{{ formatTime(forecast.astronomical.sunsetRaw) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.weather-dashboard {
  width: 100%;
  max-width: 1200px;
  margin: 1rem auto;
  padding: 0 1rem;
}

.no-location,
.error {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  background: var(--bg-primary);
  border-radius: 50px;
  box-shadow: 20px 20px 60px var(--bg-secondary),
    -20px -20px 60px var(--bg-primary);
  color: var(--text-primary);
}

.error {
  color: var(--text-error);
}

.forecast-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  padding: 2rem;
  background: var(--bg-primary);
  border-radius: 24px;
  transition: opacity 0.3s ease;
}

.forecast-grid.is-loading {
  opacity: 0.5;
}

.weather-card {
  background: var(--bg-primary);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 8px 8px 16px var(--bg-secondary), -8px -8px 16px var(--bg-primary);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.main-weather {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
}

.weather-icon {
  flex-shrink: 0;
}

.weather-icon .icon {
  width: 8rem;
  height: 8rem;
  color: var(--text-primary);
}

.card-content {
  flex: 1;
}

.card-title {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.card-value {
  color: var(--text-primary);
}

.temperature {
  font-size: 3rem;
  font-weight: bold;
  line-height: 1;
}

.feels-like {
  font-size: 1.2rem;
  color: var(--text-secondary);
}

.description {
  font-size: 1.5rem;
  text-transform: capitalize;
  margin: 0.5rem 0;
}

.date {
  font-size: 1rem;
  color: var(--text-secondary);
}

.conditions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.condition-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.condition-item .icon {
  width: 2rem;
  height: 2rem;
  color: var(--text-primary);
}

.sun-times-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sun-time {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sun-time .icon {
  width: 2rem;
  height: 2rem;
  color: var(--text-primary);
}

.bottom-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

@media (max-width: 600px) {
  .weather-dashboard {
    padding: 0 0.25rem;
    margin: 0.5rem 0;
  }
  .forecast-grid {
    padding: 0.5rem 0.1rem;
    gap: 1.2rem;
  }
  .main-weather {
    flex-direction: column;
    align-items: flex-start;
    padding: 1.2rem;
    gap: 1.2rem;
  }
  .weather-icon .icon {
    width: 4.2rem;
    height: 4.2rem;
  }
  .card-title {
    font-size: 1rem;
  }
  .temperature {
    font-size: 2rem;
  }
  .description {
    font-size: 1.1rem;
  }
  .date {
    font-size: 0.9rem;
  }
  .bottom-cards {
    grid-template-columns: 1fr;
    gap: 1.2rem;
  }
  .weather-card {
    padding: 1.2rem;
    gap: 1.2rem;
  }
  .condition-item .icon,
  .sun-time .icon {
    width: 1.3rem;
    height: 1.3rem;
  }
}
</style>
