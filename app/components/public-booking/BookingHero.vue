<script setup lang="ts">
const props = defineProps<{
  business: {
    name: string;
    tagline?: string | null;
    logoUrl?: string | null;
    address?: any;
  } | null;
}>();

function initials(name?: string) {
  if (!name) return "B";
  return name.trim().charAt(0).toUpperCase();
}
function formatAddress(addr?: any) {
  if (!addr) return "";
  const parts = [
    addr.line1,
    addr.line2,
    addr.city,
    addr.province,
    addr.postalCode,
    addr.country,
  ]
    .map((s: string | undefined) => (s || "").trim())
    .filter(Boolean);
  return parts.join(", ");
}
</script>

<template>
  <header
    class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
  >
    <div class="space-y-3">
      <div class="flex items-center gap-3">
        <!-- Logo (with graceful fallback) -->
        <div
          class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-slate-900 ring-1 ring-slate-800"
        >
          <img
            v-if="business?.logoUrl"
            :src="business.logoUrl!"
            alt="Business logo"
            class="h-full w-full object-contain"
            loading="lazy"
            @error="(e:any)=>{ e.target.style.display='none' }"
          />
          <span v-else class="text-lg font-semibold">
            {{ initials(business?.name) }}
          </span>
        </div>

        <div>
          <p class="text-[10px] uppercase tracking-[0.22em] text-brand-100">
            Online Booking
          </p>
          <h1 class="text-xl font-semibold text-slate-50 sm:text-2xl">
            {{ business?.name || "Your trusted appointment, in one tap." }}
          </h1>
        </div>
      </div>

      <p class="max-w-2xl text-xs text-slate-400 sm:text-[13px]">
        {{
          business?.tagline ||
          "Choose a service, pick your favorite specialist, and reserve a perfect time in under a minute."
        }}
      </p>

      <p v-if="business?.address" class="text-[9px] text-slate-500">
        {{ formatAddress(business.address) }}
      </p>

      <!-- badges... (unchanged) -->
    </div>

    <!-- right card... (unchanged) -->
  </header>
</template>
