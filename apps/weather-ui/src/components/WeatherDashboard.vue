<script setup lang="ts">
import { ref, watch } from "vue";
import { useWebClient } from "@/providers/apiClientProvider";
import type { Location } from "weather-client";
import type { SerializedForecastWeather } from "@/types/weather";

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
      <div class="weather-card">
        <div class="card-title">Date</div>
        <div class="card-value">
          {{
            new Date(
              forecast.astronomical.sunriseRaw * 1000
            ).toLocaleDateString()
          }}
        </div>
      </div>

      <div class="weather-card temperature">
        <div class="card-title">Temperature</div>
        <div class="card-value">
          {{ Math.round(forecast.weather.temp.cur) }}°C
        </div>
      </div>

      <div class="weather-card">
        <div class="card-title">Feels Like</div>
        <div class="card-value">
          {{ Math.round(forecast.weather.feelsLike.cur) }}°C
        </div>
      </div>

      <div class="weather-card">
        <div class="card-title">Weather</div>
        <div class="card-value">{{ forecast.weather.description }}</div>
      </div>

      <div class="weather-card">
        <div class="card-title">Humidity</div>
        <div class="card-value">{{ forecast.weather.humidity }}%</div>
      </div>

      <div class="weather-card">
        <div class="card-title">Wind Speed</div>
        <div class="card-value">
          {{ Math.round(forecast.weather.wind.speed) }} m/s
        </div>
      </div>

      <div class="weather-card">
        <div class="card-title">Wind Direction</div>
        <div class="card-value">{{ forecast.weather.wind.deg }}°</div>
      </div>

      <div class="weather-card">
        <div class="card-title">Pressure</div>
        <div class="card-value">{{ forecast.weather.pressure }} hPa</div>
      </div>

      <div class="weather-card">
        <div class="card-title">Clouds</div>
        <div class="card-value">{{ forecast.weather.clouds }}%</div>
      </div>

      <div class="weather-card">
        <div class="card-title">Visibility</div>
        <div class="card-value">
          {{ forecast.weather.visibility / 1000 }} km
        </div>
      </div>

      <div class="weather-card">
        <div class="card-title">Sunrise</div>
        <div class="card-value">
          {{
            new Date(
              forecast.astronomical.sunriseRaw * 1000
            ).toLocaleTimeString()
          }}
        </div>
      </div>

      <div class="weather-card">
        <div class="card-title">Sunset</div>
        <div class="card-value">
          {{
            new Date(
              forecast.astronomical.sunsetRaw * 1000
            ).toLocaleTimeString()
          }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.weather-dashboard {
  width: 100%;
  max-width: 1200px;
  margin: 2rem auto;
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
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  padding: 2rem;
  background: var(--bg-primary);
  border-radius: 24px;
  transition: opacity 0.3s ease;
  min-width: 800px;
}

.forecast-grid.is-loading {
  opacity: 0.5;
}

@media (max-width: 1024px) {
  .forecast-grid {
    grid-template-columns: repeat(3, 1fr);
    min-width: 600px;
  }
}

@media (max-width: 768px) {
  .forecast-grid {
    grid-template-columns: repeat(2, 1fr);
    min-width: 400px;
  }
}

@media (max-width: 480px) {
  .forecast-grid {
    grid-template-columns: 1fr;
    min-width: 300px;
  }
}

.weather-card {
  background: var(--bg-primary);
  border-radius: 50px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 0;
  box-shadow: 20px 20px 60px var(--bg-secondary),
    -20px -20px 60px var(--bg-primary);
}

.card-title {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.temperature .card-value {
  color: var(--text-primary);
  font-size: 2rem;
}
</style>
