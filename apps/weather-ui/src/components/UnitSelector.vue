<script setup lang="ts">
export type UnitSystem = "metric" | "imperial" | "standard";

const unit = defineModel<UnitSystem>({
  default: "imperial",
});

const options = [
  { value: "metric", label: "Metric (°C, m/s)" },
  { value: "imperial", label: "Imperial (°F, mph)" },
  { value: "standard", label: "Standard (K, m/s)" },
];
</script>

<template>
  <div class="unit-selector">
    <select
      :value="unit"
      @change="unit = ($event.target as HTMLSelectElement).value as UnitSystem"
      class="unit-select"
    >
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.unit-selector {
  width: fit-content;
  margin: 0 auto;
}

.unit-select {
  padding: 0.5rem 2rem 0.5rem 1rem;
  font-size: 0.9rem;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-secondary);
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.9)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 0.8em;
  transition: color 0.2s ease;
}

.unit-select:hover {
  color: var(--text-primary);
}

.unit-select:focus {
  color: var(--text-primary);
}

.unit-select option {
  background: var(--bg-primary);
  color: var(--text-primary);
}
</style>
