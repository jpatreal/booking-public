<script setup lang="ts">
const props = defineProps<{
  staff: Array<{
    id: string;
    name: string;
    avatarUrl?: string | null;
    bio?: string | null;
  }>;
  selectedStaffId: string | null;
}>();

const emit = defineEmits<{
  (e: "update:selectedStaffId", id: string): void;
}>();

function select(id: string) {
  emit("update:selectedStaffId", id);
}
</script>

<template>
  <section class="space-y-2">
    <div class="flex items-baseline justify-between gap-2">
      <h2 class="text-[11px] font-semibold text-slate-200">
        2 · Choose a specialist
      </h2>
      <p class="text-[9px] text-slate-500">
        Only bookable staff are shown here
      </p>
    </div>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="st in staff"
        :key="st.id"
        @click="select(st.id)"
        :class="[
          'flex items-center gap-2 rounded-2xl border px-3 py-1.5 text-left text-[9px] transition-all',
          selectedStaffId === st.id
            ? 'border-brand-500/80 bg-brand-500/5 shadow-soft'
            : 'border-slate-800 bg-slate-950/60 hover:border-brand-500/40 hover:bg-slate-900/70',
        ]"
      >
        <div
          class="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-[9px] font-semibold text-slate-200"
        >
          {{ st.name[0] || "S" }}
        </div>
        <div class="flex flex-col">
          <span class="font-medium text-slate-100">
            {{ st.name }}
          </span>
          <span class="text-[8px] text-slate-500 line-clamp-1">
            {{ st.bio || "Available for selected services" }}
          </span>
        </div>
      </button>
    </div>
  </section>
</template>
