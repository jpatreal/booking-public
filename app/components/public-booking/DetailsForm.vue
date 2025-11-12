<script setup lang="ts">
const props = defineProps<{
  customerName: string;
  customerEmail: string;
  notes: string;
  errorMessage: string;
  submitting: boolean;
  canSubmit: boolean;
}>();

const emit = defineEmits<{
  (e: "update:customerName", v: string): void;
  (e: "update:customerEmail", v: string): void;
  (e: "update:notes", v: string): void;
  (e: "submit"): void;
}>();
</script>

<template>
  <section class="space-y-2">
    <div class="flex items-baseline justify-between gap-2">
      <h2 class="text-[11px] font-semibold text-slate-200">4 · Your details</h2>
      <p class="text-[8px] text-slate-500">
        We’ll send confirmation to your email (optional).
      </p>
    </div>

    <div class="grid gap-2 sm:grid-cols-2">
      <div class="space-y-1">
        <label class="text-[8px] text-slate-500">Full name *</label>
        <input
          :value="customerName"
          type="text"
          placeholder="Enter your full name"
          class="w-full rounded-2xl border border-slate-800 bg-slate-950/80 px-3 py-1.5 text-[9px] text-slate-100 outline-none ring-brand-500/40 focus:border-brand-500 focus:ring-1"
          @input="
            emit(
              'update:customerName',
              ($event.target as HTMLInputElement).value
            )
          "
        />
      </div>
      <div class="space-y-1">
        <label class="text-[8px] text-slate-500"> Email (optional) </label>
        <input
          :value="customerEmail"
          type="email"
          placeholder="you@example.com"
          class="w-full rounded-2xl border border-slate-800 bg-slate-950/80 px-3 py-1.5 text-[9px] text-slate-100 outline-none ring-brand-500/40 focus:border-brand-500 focus:ring-1"
          @input="
            emit(
              'update:customerEmail',
              ($event.target as HTMLInputElement).value
            )
          "
        />
      </div>
    </div>

    <div class="space-y-1">
      <label class="text-[8px] text-slate-500"> Notes (optional) </label>
      <textarea
        :value="notes"
        rows="2"
        placeholder="Add any specific concerns, preferences, or requests..."
        class="w-full rounded-2xl border border-slate-800 bg-slate-950/80 px-3 py-1.5 text-[9px] text-slate-100 outline-none ring-brand-500/40 focus:border-brand-500 focus:ring-1"
        @input="
          emit('update:notes', ($event.target as HTMLTextAreaElement).value)
        "
      />
    </div>

    <div v-if="errorMessage" class="pt-1">
      <div
        class="rounded-2xl border border-red-500/40 bg-red-500/5 px-3 py-2 text-[9px] text-red-200"
      >
        {{ errorMessage }}
      </div>
    </div>

    <div class="flex items-center justify-between pt-1">
      <p class="text-[8px] text-slate-500">
        By confirming, your booking will be marked as
        <span class="text-brand-400">pending</span>
        until approved by the business.
      </p>
      <button
        class="inline-flex items-center gap-1.5 rounded-2xl bg-brand-600 px-4 py-1.5 text-[9px] font-semibold text-slate-50 shadow-soft transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:bg-slate-700"
        :disabled="!canSubmit || submitting"
        @click="emit('submit')"
      >
        <span
          v-if="submitting"
          class="h-2 w-2 animate-spin rounded-full border border-slate-50 border-t-transparent"
        />
        {{ submitting ? "Booking..." : "Confirm Booking" }}
      </button>
    </div>
  </section>
</template>
