<script setup lang="ts">
import { ref } from "vue";
import { provideWebClient } from "@/providers/apiClientProvider";
import CitySearch from "./components/CitySearch.vue";
import WeatherDashboard from "./components/WeatherDashboard.vue";
import type { Location } from "weather-client";

provideWebClient();

const selectedLocation = ref<Location | null>(null);
</script>

<template>
  <div class="app">
    <h1>Weather Forecast</h1>
    <CitySearch v-model="selectedLocation" />
    <WeatherDashboard :location="selectedLocation" />
  </div>
</template>

<style scoped>
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #42b883;
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
