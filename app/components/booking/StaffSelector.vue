<template>
  <section class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
    <h2 class="text-lg font-semibold text-slate-800 mb-3">Select Staff</h2>
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <button
        v-for="st in staff"
        :key="st.id"
        type="button"
        @click="$emit('select-staff', st.id)"
        class="flex items-center gap-3 rounded-xl border p-3 transition"
        :class="
          st.id === selectedStaffId
            ? 'border-transparent ring-2 ring-offset-2 ring-offset-white'
            : 'border-slate-200 hover:border-slate-300'
        "
        :style="
          st.id === selectedStaffId
            ? { boxShadow: '0 0 0 2px var(--brand)' }
            : undefined
        "
      >
        <div
          class="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-[9px] font-semibold text-slate-200"
        >
          {{ st.name[0] || "S" }}
        </div>
        <div>
          <p class="text-sm font-medium text-slate-800">
            {{ st.name }}
          </p>
          <p v-if="st.bio" class="text-[11px] text-slate-500 line-clamp-1">
            {{ st.bio }}
          </p>
        </div>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Staff {
  id: string;
  name: string;
  bio?: string | null;
}

defineProps<{
  staff: Staff[];
  selectedStaffId: string | null;
}>();

defineEmits<{
  (e: "select-staff", id: string): void;
}>();
</script>
