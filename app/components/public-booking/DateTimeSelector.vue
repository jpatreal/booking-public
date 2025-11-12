<script setup lang="ts">
const props = defineProps<{
  timeZone: string | any;
  dateLocal: string;
  slots: Array<{ startUtc: string; endUtc: string }>;
  loadingSlots: boolean;
  selectedSlot: { startUtc: string; endUtc: string } | null;
  formatSlotLabel: (s: string, e: string) => string;
}>();

const emit = defineEmits<{
  (e: "update:dateLocal", value: string): void;
  (
    e: "update:selectedSlot",
    slot: { startUtc: string; endUtc: string } | null
  ): void;
  (e: "set-today"): void;
}>();

function onDateChange(e: Event) {
  const val = (e.target as HTMLInputElement).value;
  emit("update:dateLocal", val);
}

function pickToday() {
  emit("set-today");
}

function pickSlot(slot: { startUtc: string; endUtc: string }) {
  emit("update:selectedSlot", slot);
}
</script>

<template>
  <section class="space-y-2">
    <div class="flex items-baseline justify-between gap-2">
      <h2 class="text-[11px] font-semibold text-slate-200">
        3 · Pick date &amp; time
      </h2>
      <p class="text-[9px] text-slate-500">
        Times shown in
        <span class="text-brand-400">
          {{ timeZone }}
        </span>
      </p>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <input
        :value="dateLocal"
        type="date"
        class="rounded-2xl border border-slate-800 bg-slate-950/80 px-3 py-1.5 text-[9px] text-slate-100 outline-none ring-brand-500/40 focus:border-brand-500 focus:ring-1"
        @change="onDateChange"
      />
      <button
        class="rounded-full border border-slate-800 px-3 py-1 text-[8px] text-slate-400 hover:border-brand-500/60 hover:text-brand-400"
        @click="pickToday"
      >
        Today
      </button>
    </div>

    <div class="mt-1 min-h-[56px]">
      <div
        v-if="loadingSlots"
        class="flex items-center gap-2 text-[9px] text-slate-500"
      >
        <span class="h-2 w-2 animate-pulse rounded-full bg-brand-500" />
        Loading available times...
      </div>

      <div
        v-else-if="!loadingSlots && slots.length === 0"
        class="rounded-2xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-[9px] text-slate-500"
      >
        No available slots for this day. Try another date or adjust your
        selections.
      </div>

      <div
        v-else
        class="grid grid-cols-3 gap-1.5 sm:grid-cols-4 md:grid-cols-5"
      >
        <button
          v-for="slot in slots"
          :key="slot.startUtc"
          @click="emit('update:selectedSlot', slot)"
          :class="[
            'rounded-2xl border px-2 py-1 text-[9px] transition-all',
            selectedSlot?.startUtc === slot.startUtc
              ? 'border-brand-500/80 bg-brand-500/10 text-brand-200 shadow-soft'
              : 'border-slate-800 bg-slate-950/80 text-slate-300 hover:border-brand-500/50 hover:text-brand-200',
          ]"
        >
          {{ props.formatSlotLabel(slot.startUtc, slot.endUtc) }}
        </button>
      </div>
    </div>
  </section>
</template>
