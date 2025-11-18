<template>
  <transition name="loading-fade">
    <div
      v-if="show"
      class="fixed inset-0 z-40 flex items-center justify-center bg-white/80 backdrop-blur-sm"
    >
      <div class="flex flex-col items-center gap-3">
        <div
          class="h-10 w-10 rounded-full border-2 border-sky-400 border-t-transparent animate-spin"
        />
        <p class="text-xs text-slate-500 tracking-wide uppercase">
          Loading booking page…
        </p>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean;
}>();
</script>
