<template>
  <div
    class="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16 grid md:grid-cols-2 gap-8 items-center"
  >
    <div>
      <p class="text-xs uppercase tracking-wider text-slate-400 mb-2">
        Welcome
      </p>
      <h1 class="text-3xl sm:text-4xl font-bold text-slate-800 leading-tight">
        We focus on your
        <span :style="{ color: brandColor }">story</span>.
      </h1>
      <p class="mt-3 text-slate-600 text-sm sm:text-base">
        {{
          tagline || "Book a time with our team and move your project forward."
        }}
      </p>
    </div>
    <div class="hidden md:block">
      <div
        class="aspect-[4/3] rounded-2xl bg-gradient-to-br from-sky-100 to-rose-100 border border-slate-100 flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          class="w-40 h-40 text-slate-300"
        >
          <path
            fill="currentColor"
            d="M12 12q-.825 0-1.413-.588T10 10q0-.825.588-1.413T12 8q.825 0 1.413.588T14 10q0 .825-.588 1.413T12 12m0 9q-3.75-3.2-5.875-6.1T4 9q0-3.35 2.325-5.675T12 1q3.35 0 5.675 2.325T20 9q0 2.8-2.125 5.7T12 21"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  tagline: string | null;
  brandColor: string;
}>();
</script>
