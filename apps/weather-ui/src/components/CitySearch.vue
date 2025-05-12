<script setup lang="ts">
import { onWatcherCleanup, ref, watch, nextTick, shallowRef } from "vue";
import { useWebClient } from "@/providers/apiClientProvider";
import type { Location } from "weather-client";

const selectedLocation = defineModel<Location | null>();

const searchQuery = ref("");
const searchResults = shallowRef<Location[]>([]);
const isLoading = ref(false);
const selectedIndex = ref(-1);
const searchInput = shallowRef<HTMLInputElement | null>(null);
const isEditing = ref(false);

const {
  weather: {
    lookup: { $get: lookupCity },
  },
} = useWebClient();

const maintainFocus = async () => {
  await nextTick();
  if (searchInput.value) {
    searchInput.value.focus();
  }
};

const searchCities = async (query: string, signal?: AbortSignal) => {
  if (!query.trim()) {
    searchResults.value = [];
    return;
  }

  try {
    isLoading.value = true;
    await maintainFocus();
    const response = await lookupCity(
      { query: { q: query } },
      {
        init: {
          signal,
        },
      }
    );

    searchResults.value = await response.json();
    await maintainFocus();
  } catch (error) {
    console.error("Error searching cities:", error);
    searchResults.value = [];
    selectedIndex.value = -1;
  } finally {
    isLoading.value = false;
    await maintainFocus();
  }
};

// Debounce the search to avoid too many API calls
let debounceTimeout: number;
watch(searchQuery, (newQuery) => {
  const abortController = new AbortController();
  onWatcherCleanup(() => {
    clearTimeout(debounceTimeout);
    abortController.abort();
  });
  debounceTimeout = setTimeout(() => {
    searchCities(newQuery, abortController.signal);
  }, 300);
});

watch(selectedLocation, () => {
  searchQuery.value = "";
});
watch(searchResults, (newResults) => {
  selectedIndex.value = newResults.length ? 0 : -1;
});

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    event.preventDefault();
    if (isEditing.value) {
      isEditing.value = false;
      searchQuery.value = "";
      searchResults.value = [];
      selectedIndex.value = -1;
    } else {
      searchResults.value = [];
      selectedIndex.value = -1;
    }
    return;
  }

  if (!searchResults.value.length) return;

  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      selectedIndex.value = Math.min(
        selectedIndex.value + 1,
        searchResults.value.length - 1
      );
      break;
    case "ArrowUp":
      event.preventDefault();
      selectedIndex.value = Math.max(selectedIndex.value - 1, 0);
      break;
    case "Enter":
      event.preventDefault();
      if (selectedIndex.value >= 0) {
        const selectedCity = searchResults.value[selectedIndex.value];
        selectedLocation.value = selectedCity;
        isEditing.value = false;
      }
      break;
  }
};

const startEditing = () => {
  isEditing.value = true;
  nextTick(() => {
    if (searchInput.value) {
      searchInput.value.focus();
    }
  });
};
</script>

<template>
  <div class="city-search">
    <div class="search-container">
      <div
        v-if="selectedLocation && !isEditing"
        class="selected-city"
        @click="startEditing"
      >
        <div class="city-info">
          <span class="city-name">{{ selectedLocation.name }}</span>
          <span class="city-details">
            {{ selectedLocation.state ? `${selectedLocation.state}, ` : ""
            }}{{ selectedLocation.country }}
          </span>
        </div>
        <button class="clear-button" @click.stop="selectedLocation = null">
          <span class="clear-icon">×</span>
        </button>
      </div>
      <input
        v-else
        ref="searchInput"
        type="text"
        v-model="searchQuery"
        :placeholder="
          selectedLocation
            ? 'Search for another city...'
            : 'Search for a city...'
        "
        class="search-input"
        @keydown="handleKeyDown"
      />
    </div>

    <div v-show="searchResults.length > 0" class="results-container">
      <ul class="results-list">
        <li
          v-for="(city, index) in searchResults"
          :key="`${city.name}-${city.country}`"
          class="result-item"
          :class="{ selected: index === selectedIndex }"
          @mousedown.prevent="
            selectedLocation = city;
            isEditing = false;
          "
          @mouseover="selectedIndex = index"
        >
          <div class="city-info">
            <span class="city-name">{{ city.name }}</span>
            <span class="city-details">
              {{ city.state ? `${city.state}, ` : "" }}{{ city.country }}
            </span>
          </div>
        </li>
        <li v-if="searchResults.length === 0" class="no-results">
          No cities found
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.city-search {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  position: relative;
}

.search-container {
  margin-bottom: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1.25rem;
  font-size: 1rem;
  background: var(--bg-primary);
  border: 1px solid var(--bg-secondary);
  border-radius: 50px;
  outline: none;
  color: var(--text-primary);
  box-shadow: 15px 15px 30px var(--bg-secondary),
    -15px -15px 30px var(--bg-primary);
  transition: box-shadow 0.2s ease;
  box-sizing: border-box;
}

.search-input:focus {
  box-shadow: 20px 20px 40px var(--bg-secondary),
    -20px -20px 40px var(--bg-primary);
}

.search-input::placeholder {
  color: var(--text-secondary);
}

.search-input:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.results-container {
  background: var(--bg-primary);
  border: 1px solid var(--bg-secondary);
  border-radius: 24px;
  box-shadow: 15px 15px 30px var(--bg-secondary),
    -15px -15px 30px var(--bg-primary);
  position: absolute;
  width: 100%;
  z-index: 10;
  margin-top: 0.5rem;
  overflow: auto;
  box-sizing: border-box;
  padding-right: 4px;
}

/* Custom scrollbar for results container only */
.results-container::-webkit-scrollbar {
  width: 7px;
  height: 7px;
}

.results-container::-webkit-scrollbar-track {
  background: var(--bg-primary);
  border-radius: 6px;
}

.results-container::-webkit-scrollbar-thumb {
  background: var(--bg-secondary);
  border-radius: 6px;
  border: 1px solid var(--bg-primary);
}

.results-container::-webkit-scrollbar-thumb:hover {
  background: #4a8a98;
}

.results-list {
  list-style: none;
  padding: 0.5rem;
  margin: 0;
  max-height: 300px;
  overflow-y: auto;
}

.result-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-radius: 16px;
  transition: background-color 0.2s;
  color: var(--text-primary);
}

.result-item:hover,
.result-item.selected {
  background: var(--bg-secondary);
}

.city-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.city-name {
  font-weight: 500;
  color: var(--text-primary);
}

.city-details {
  color: var(--text-secondary);
  font-size: 0.9em;
}

.loading {
  text-align: center;
  color: var(--text-secondary);
  padding: 1rem;
}

.no-results {
  text-align: center;
  color: var(--text-secondary);
  padding: 1rem;
}

.selected-city {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.25rem;
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--bg-secondary);
  border-radius: 50px;
  box-shadow: 15px 15px 30px var(--bg-secondary),
    -15px -15px 30px var(--bg-primary);
  cursor: pointer;
  transition: box-shadow 0.2s ease;
}

.selected-city:hover {
  box-shadow: 20px 20px 40px var(--bg-secondary),
    -20px -20px 40px var(--bg-primary);
}

.selected-city .city-info {
  flex: 1;
}

.selected-city .city-name {
  color: var(--text-primary);
  font-size: 1.1rem;
  font-weight: 600;
}

.selected-city .city-details {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.clear-button {
  background: none;
  border: none;
  color: var(--text-primary);
  font-size: 1.5rem;
  padding: 0 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
}

.clear-button:hover {
  opacity: 0.8;
}

.clear-icon {
  line-height: 1;
}
</style>
