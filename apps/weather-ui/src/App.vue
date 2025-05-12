<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { provideWebClient } from "@/providers/apiClientProvider";
import { useTitle, useStorage } from "@vueuse/core";
import CitySearch from "./components/CitySearch.vue";
import WeatherDashboard from "./components/WeatherDashboard.vue";
import UnitSelector from "./components/UnitSelector.vue";
import type { Location } from "weather-client";
import type { UnitSystem } from "./components/UnitSelector.vue";
import iMdiGithub from "virtual:icons/mdi/github";

provideWebClient();

const selectedLocation = ref<Location | null>(null);
const selectedUnit = useStorage<UnitSystem>(
  "weather-unit",
  "imperial",
  sessionStorage
);
const title = useTitle("Weather Forecast");

// Update title when location changes
watchEffect(() => {
  if (selectedLocation.value) {
    title.value = `${selectedLocation.value.name} - Weather Forecast`;
  } else {
    title.value = "Weather Forecast";
  }
});

const bgPrimary = "#68baca";
const bgSecondary = "#589eac";
</script>

<template>
  <div
    class="app"
    :style="{ '--bg-primary': bgPrimary, '--bg-secondary': bgSecondary }"
  >
    <div class="header">
      <h1>Weather Forecast</h1>
      <CitySearch v-model="selectedLocation" />
      <UnitSelector v-model="selectedUnit" />
    </div>
    <div class="dashboard-container">
      <WeatherDashboard :location="selectedLocation" :unit="selectedUnit" />
    </div>
  </div>
  <a
    href="https://github.com/egriff38/weather-app"
    target="_blank"
    rel="noopener noreferrer"
    class="github-link"
  >
    <i-mdi-github class="github-icon" />
  </a>
</template>

<style>
:root {
  --bg-primary: #68baca;
  --bg-secondary: #589eac;
  --text-primary: white;
  --text-secondary: rgba(255, 255, 255, 0.9);
  --text-error: #ff6b6b;
}

body {
  margin: 0;
  background-color: var(--bg-secondary);
  min-height: 100vh;
}

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

::-webkit-scrollbar-track {
  background: var(--bg-primary);
  border-radius: 6px;
}

::-webkit-scrollbar-thumb {
  background: var(--bg-secondary);
  border-radius: 6px;
  border: 2px solid var(--bg-primary);
}

::-webkit-scrollbar-thumb:hover {
  background: #4a8a98;
}

/* Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: var(--bg-secondary) var(--bg-primary);
}
</style>

<style scoped>
.app {
  /* width: fit-content; */
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary);
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--text-primary);
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

.github-link {
  position: absolute;
  top: 2rem;
  right: 2rem;
  color: var(--text-primary);
  text-decoration: none;
  transition: transform 0.1s ease;
}

.github-link:hover {
  transform: scale(1.1);
}

.github-icon {
  width: 2rem;
  height: 2rem;
}

@media (max-width: 960px) {
  .github-link {
    position: relative;
    top: unset;
    right: unset;
    margin: 1rem auto;
    display: block;
  }
  .github-icon {
    width: 1.5rem;
    height: 1.5rem;
  }
}
@media (max-width: 600px) {
  .app {
    padding: 1rem;
    min-width: 0;
  }
  .header {
    position: relative;
  }
  h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
}

.header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}
</style>
