<template>
  <section class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold text-slate-800">Select Service</h2>
      <span v-if="selectedServiceDuration" class="text-xs text-slate-500">
        Duration: {{ selectedServiceDuration }} min
      </span>
    </div>

    <!-- Skeleton while loading config -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="i in 6"
        :key="i"
        class="h-16 rounded-xl bg-slate-100 animate-pulse"
      />
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <button
        v-for="svc in services"
        :key="svc.id"
        type="button"
        @click="$emit('select-service', svc.id)"
        class="group w-full text-left rounded-xl border p-4 transition shadow-sm focus:outline-none"
        :class="
          svc.id === selectedServiceId
            ? 'border-transparent ring-2 ring-offset-2 ring-offset-white'
            : 'border-slate-200 hover:border-slate-300'
        "
        :style="
          svc.id === selectedServiceId
            ? { boxShadow: '0 0 0 2px var(--brand)' }
            : undefined
        "
      >
        <div class="flex items-start gap-3">
          <div
            class="mt-1 h-4 w-4 rounded-full border flex items-center justify-center"
            :class="
              svc.id === selectedServiceId
                ? 'border-[var(--brand)]'
                : 'border-slate-300'
            "
          >
            <div
              v-if="svc.id === selectedServiceId"
              class="h-2.5 w-2.5 rounded-full"
              :style="{ background: 'var(--brand)' }"
            />
          </div>
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <p class="font-medium text-slate-800">
                {{ svc.name }}
              </p>
              <p class="text-sm text-slate-500">
                {{ svc.priceCents ? formatPrice(svc.priceCents) : "Free" }}
              </p>
            </div>
            <p
              v-if="svc.description"
              class="text-xs text-slate-500 mt-1 line-clamp-2"
            >
              {{ svc.description }}
            </p>
          </div>
        </div>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Service {
  id: string;
  name: string;
  durationMin?: number | null;
  priceCents?: number | null;
  description?: string | null;
}

defineProps<{
  services: Service[];
  selectedServiceId: string | null;
  selectedServiceDuration: number | null | undefined;
  loading: boolean;
  formatPrice: (cents?: number | null) => string;
}>();

defineEmits<{
  (e: "select-service", id: string): void;
}>();
</script>
