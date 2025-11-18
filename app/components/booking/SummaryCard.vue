<template>
  <div
    class="sticky top-24 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-black"
  >
    <h3 class="text-base font-semibold text-slate-800">Summary</h3>
    <div class="mt-4 space-y-3 text-sm">
      <div class="flex justify-between">
        <span class="text-slate-500">Service</span>
        <span class="font-medium">
          {{ serviceName }}
        </span>
      </div>
      <div class="flex justify-between">
        <span class="text-slate-500">Staff</span>
        <span class="font-medium">
          {{ staffName }}
        </span>
      </div>
      <div class="flex justify-between">
        <span class="text-slate-500">When</span>
        <span class="font-medium">
          {{ summaryWhen }}
        </span>
      </div>
      <div class="flex justify-between">
        <span class="text-slate-500">Duration</span>
        <span class="font-medium"> {{ duration }} min </span>
      </div>
      <div class="flex justify-between">
        <span class="text-slate-500">Price</span>
        <span class="font-medium">
          {{ priceLabel }}
        </span>
      </div>
    </div>

    <button
      class="mt-6 w-full py-3 rounded-xl text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      :style="{ background: 'var(--brand)' }"
      :disabled="!formValid || submitting"
      @click="$emit('submit')"
    >
      {{ submitting ? "Booking…" : "Confirm booking" }}
    </button>

    <p v-if="errorMessage" class="mt-3 text-xs text-rose-600">
      {{ errorMessage }}
    </p>

    <div v-if="successData" class="mt-3 text-xs text-emerald-600 space-y-1">
      <p>
        Booked! Reference:
        <span class="font-mono">
          {{ successData?.id || successData?.booking?.id || "OK" }}
        </span>
      </p>
      <button class="text-emerald-700/80 underline" @click="$emit('reset')">
        Book another
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  serviceName: string;
  staffName: string;
  summaryWhen: string;
  duration: number;
  priceLabel: string;
  formValid: boolean;
  submitting: boolean;
  errorMessage: string;
  successData: any;
}>();

defineEmits<{
  (e: "submit"): void;
  (e: "reset"): void;
}>();
</script>
