<script setup lang="ts">
const props = defineProps<{
  services: Array<{
    id: string;
    name: string;
    description?: string | null;
    durationMin?: number | null;
    priceCents?: number | null;
  }>;
  selectedServiceId: string | null;
  formatPrice: (cents?: number | null) => string;
}>();

const emit = defineEmits<{
  (e: "update:selectedServiceId", id: string): void;
}>();

function select(id: string) {
  emit("update:selectedServiceId", id);
}
</script>

<template>
  <section class="space-y-2">
    <div class="flex items-baseline justify-between gap-2">
      <h2 class="text-[11px] font-semibold text-slate-200">
        1 · Choose a service
      </h2>
      <p class="text-[9px] text-slate-500">
        Tailored slots based on your selection
      </p>
    </div>
    <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
      <button
        v-for="svc in services"
        :key="svc.id"
        @click="select(svc.id)"
        :class="[
          'group flex flex-col items-start gap-1 rounded-2xl border px-3 py-2 text-left transition-all duration-150',
          selectedServiceId === svc.id
            ? 'border-brand-500/80 bg-brand-500/5 shadow-soft'
            : 'border-slate-800 bg-slate-950/60 hover:border-brand-500/40 hover:bg-slate-900/70',
        ]"
      >
        <div class="flex items-center gap-1.5">
          <span
            class="h-1.5 w-1.5 rounded-full"
            :class="
              selectedServiceId === svc.id ? 'bg-brand-500' : 'bg-slate-600'
            "
          />
          <span class="text-[10px] font-medium text-slate-50">
            {{ svc.name }}
          </span>
        </div>
        <p
          class="line-clamp-2 text-[8px] text-slate-500 group-hover:text-slate-400"
        >
          {{ svc.description || "Click to view times for this service." }}
        </p>
        <p class="mt-0.5 text-[9px] text-brand-400">
          <span v-if="svc.durationMin"> {{ svc.durationMin }} mins </span>
          <span v-if="svc.priceCents">
            • {{ formatPrice(svc.priceCents) }}
          </span>
        </p>
      </button>
    </div>
  </section>
</template>
