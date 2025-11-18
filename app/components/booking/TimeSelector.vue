<template>
  <section class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
    <h2 class="text-lg font-semibold text-slate-800 mb-4">Select Time</h2>

    <!-- Date picker above -->
    <div class="space-y-2 mb-6">
      <label class="text-xs font-medium text-slate-600">
        Date ({{ timeZone }})
      </label>
      <input
        class="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-slate-200 text-black"
        type="date"
        :value="dateLocal"
        @change="onDateChange"
      />
    </div>

    <!-- Slots below -->
    <div>
      <div
        v-if="loadingSlots"
        class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2"
      >
        <div
          v-for="i in 10"
          :key="i"
          class="h-10 rounded-lg bg-slate-100 animate-pulse"
        />
      </div>

      <div v-else-if="slots.length === 0" class="text-sm text-slate-500">
        No available slots for this date.
      </div>

      <div v-else class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
        <button
          v-for="s in slots"
          :key="s.startUtc + s.endUtc"
          type="button"
          class="px-3 py-2 rounded-lg border text-sm transition text-black"
          :class="
            selectedSlot && selectedSlot.startUtc === s.startUtc
              ? 'border-transparent ring-2 ring-offset-2'
              : 'border-slate-200 hover:border-slate-300'
          "
          :style="
            selectedSlot && selectedSlot.startUtc === s.startUtc
              ? { boxShadow: '0 0 0 2px var(--brand)' }
              : undefined
          "
          @click="$emit('select-slot', s)"
        >
          {{ formatSlotLabel(s.startUtc, s.endUtc) }}
        </button>
      </div>

      <p v-if="selectedSlot" class="mt-3 text-xs text-slate-500">
        All times shown in {{ timeZone }}.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Slot {
  startUtc: string;
  endUtc: string;
}

const props = defineProps<{
  timeZone: string;
  dateLocal: string;
  slots: Slot[];
  selectedSlot: Slot | null;
  loadingSlots: boolean;
  formatSlotLabel: (startUtc: string, endUtc: string) => string;
}>();

const emit = defineEmits<{
  (e: "update:dateLocal", value: string): void;
  (e: "refresh-slots"): void;
  (e: "select-slot", slot: Slot): void;
}>();

function onDateChange(e: Event) {
  const val = (e.target as HTMLInputElement).value;
  emit("update:dateLocal", val);
  emit("refresh-slots");
}
</script>
