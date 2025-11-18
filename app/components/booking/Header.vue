<template>
  <header
    class="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-100"
  >
    <div
      class="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between"
    >
      <div class="flex items-center gap-3">
        <img
          v-if="business?.logoUrl"
          :src="business.logoUrl"
          :alt="business.name"
          class="h-7 w-auto object-contain"
        />
        <span class="text-sm font-semibold text-slate-700">
          {{ business?.name || "Business" }}
        </span>
      </div>
      <nav class="hidden md:flex items-center gap-6 text-sm text-slate-500">
        <button
          type="button"
          class="hover:text-slate-700"
          @click="$emit('navigate', 'services')"
        >
          Services
        </button>
        <button
          type="button"
          class="hover:text-slate-700"
          @click="$emit('navigate', 'time')"
        >
          Time
        </button>
        <button
          type="button"
          class="hover:text-slate-700"
          @click="$emit('navigate', 'details')"
        >
          Details
        </button>
        <button
          type="button"
          class="hover:text-slate-700"
          @click="$emit('navigate', 'contact')"
        >
          Contact
        </button>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
interface BusinessHeader {
  name: string;
  logoUrl?: string | null;
}

defineProps<{
  business: BusinessHeader | null;
}>();

defineEmits<{
  (e: "navigate", sectionId: string): void;
}>();
</script>
