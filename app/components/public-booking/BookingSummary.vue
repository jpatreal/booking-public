<script setup lang="ts">
const props = defineProps<{
  bookingConfig: any;
  selectedServiceId: string | null;
  selectedStaffId: string | null;
  dateLocal: string;
  selectedSlot: { startUtc: string; endUtc: string } | null;
  timeZone: string | any;
  formatSlotLabel: (s: string, e: string) => string;
  successData: any;
}>();

const emit = defineEmits<{
  (e: "reset"): void;
}>();
</script>

<template>
  <aside
    class="flex flex-col gap-3 rounded-3xl bg-slate-950/70 p-4 ring-1 ring-slate-800/80 backdrop-blur"
  >
    <h3 class="text-[11px] font-semibold text-slate-200">Booking summary</h3>

    <div
      class="space-y-2 rounded-2xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-[9px] text-slate-300"
    >
      <p class="text-[8px] uppercase tracking-[0.14em] text-slate-500">
        Selected
      </p>
      <p>
        <span class="text-slate-500">Service:</span>
        <span class="ml-1 font-medium text-slate-100">
          {{
            bookingConfig.services.find((s: any) => s.id === selectedServiceId)
              ?.name || "None selected"
          }}
        </span>
      </p>
      <p>
        <span class="text-slate-500">Specialist:</span>
        <span class="ml-1 font-medium text-slate-100">
          {{
            bookingConfig.staff.find((s: any) => s.id === selectedStaffId)
              ?.name || "None selected"
          }}
        </span>
      </p>
      <p>
        <span class="text-slate-500">Date:</span>
        <span class="ml-1">
          {{ dateLocal || "Select a date" }}
        </span>
      </p>
      <p>
        <span class="text-slate-500">Time:</span>
        <span class="ml-1">
          {{
            selectedSlot
              ? formatSlotLabel(selectedSlot.startUtc, selectedSlot.endUtc)
              : "Choose an available slot"
          }}
        </span>
      </p>
      <p>
        <span class="text-slate-500">Timezone:</span>
        <span class="ml-1 text-brand-400">
          {{ timeZone }}
        </span>
      </p>
    </div>

    <div
      v-if="successData"
      class="space-y-2 rounded-2xl border border-emerald-500/40 bg-emerald-500/5 px-3 py-2 text-[9px] text-emerald-100"
    >
      <div class="flex items-center gap-2">
        <div
          class="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/80 text-[9px] text-slate-950"
        >
          ✓
        </div>
        <p class="font-semibold">Your booking request has been received!</p>
      </div>
      <p>
        Reference:
        <span class="font-mono text-[8px]">
          {{ successData.id }}
        </span>
      </p>
      <p>
        Status:
        <span class="font-semibold">
          {{ successData.status }}
        </span>
      </p>
      <p class="text-[8px] text-emerald-200/80">
        You may receive an email or SMS once the business confirms your
        appointment.
      </p>
      <button
        class="mt-1 inline-flex items-center gap-1.5 rounded-2xl bg-slate-950/90 px-3 py-1 text-[8px] font-semibold text-emerald-200 ring-1 ring-emerald-400/40 hover:bg-slate-900"
        @click="emit('reset')"
      >
        Book another appointment
      </button>
    </div>

    <div
      class="mt-auto space-y-1 rounded-2xl border border-slate-900 bg-slate-950/90 px-3 py-2 text-[8px] text-slate-500"
    >
      <p class="font-semibold text-slate-400">
        {{ bookingConfig.business.name || "This business" }}
      </p>
      <p v-if="bookingConfig.business.address">
        {{ bookingConfig.business.address }}
      </p>
      <p>
        Powered by
        <span class="font-semibold text-brand-400">
          your booking platform
        </span>
        — designed to make clients love booking online.
      </p>
    </div>
  </aside>
</template>
