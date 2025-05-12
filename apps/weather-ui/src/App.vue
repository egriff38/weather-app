<script setup lang="ts">
import { ref, watch } from "vue";
import { provideWebClient } from "@/providers/apiClientProvider";
import { useTitle } from "@vueuse/core";
import CitySearch from "./components/CitySearch.vue";
import WeatherDashboard from "./components/WeatherDashboard.vue";
import type { Location } from "weather-client";

provideWebClient();

const selectedLocation = ref<Location | null>(null);
const title = useTitle("Weather Forecast");

// Update title when location changes
watch(selectedLocation, (location) => {
  if (location) {
    title.value = `${location.name} - Weather Forecast`;
  } else {
    title.value = "Weather Forecast";
  }
});
</script>

<template>
  <div class="app">
    <div class="header">
      <h1>Weather Forecast</h1>
      <CitySearch v-model="selectedLocation" />
    </div>
    <div class="dashboard-container">
      <WeatherDashboard :location="selectedLocation" />
    </div>
  </div>
</template>

<style scoped>
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
}

.header {
  margin-bottom: 2rem;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #42b883;
}

.dashboard-container {
  flex: 1;
  display: flex;
  justify-content: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
