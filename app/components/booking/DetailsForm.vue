<template>
  <section
    class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-black"
  >
    <h2 class="text-lg font-semibold text-slate-800 mb-4">Add your details</h2>
    <form class="grid md:grid-cols-2 gap-4" @submit.prevent>
      <div class="space-y-1">
        <label class="text-xs text-slate-600">
          Full name <span class="text-rose-500">*</span>
        </label>
        <input
          :value="customerName"
          class="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-slate-200"
          placeholder="Juan Dela Cruz"
          @input="onInput('customerName', $event)"
        />
      </div>
      <div class="space-y-1">
        <label class="text-xs text-slate-600">Email (optional)</label>
        <input
          :value="customerEmail"
          type="email"
          class="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-slate-200"
          placeholder="name@email.com"
          @input="onInput('customerEmail', $event)"
        />
      </div>
      <div class="md:col-span-2 space-y-1">
        <label class="text-xs text-slate-600">Notes (optional)</label>
        <textarea
          :value="notes"
          class="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-slate-200 min-h-[90px]"
          placeholder="Anything we should know?"
          @input="onInput('notes', $event)"
        />
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  customerName: string;
  customerEmail: string;
  notes: string;
}>();

const emit = defineEmits<{
  (e: "update:customerName", value: string): void;
  (e: "update:customerEmail", value: string): void;
  (e: "update:notes", value: string): void;
}>();

function onInput(field: "customerName" | "customerEmail" | "notes", e: Event) {
  const val = (e.target as HTMLInputElement | HTMLTextAreaElement).value;

  if (field === "customerName") {
    emit("update:customerName", val);
  } else if (field === "customerEmail") {
    emit("update:customerEmail", val);
  } else {
    emit("update:notes", val);
  }
}
</script>
