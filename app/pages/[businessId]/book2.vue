<script setup lang="ts">
const route = useRoute();
const config = useRuntimeConfig();
const apiBase = config.public.apiBase;

const businessId = computed(() => route.params.businessId as string);

const loadingConfig = ref(true);
const loadingSlots = ref(false);
const submitting = ref(false);

const bookingConfig = ref<null | {
  business: {
    id: string;
    name: string;
    slug?: string;
    logoUrl?: string | null;
    primaryColor?: string;
    timezone: string;
    address?: {
      line1?: string;
      line2?: string;
      city?: string;
      province?: string;
      postalCode?: string;
      country?: string;
    } | null;
    tagline?: string | null;
  };
  services: Array<{
    id: string;
    name: string;
    durationMin?: number | null;
    priceCents?: number | null;
    description?: string | null;
    capacity?: number | null;
  }>;
  staff: Array<{
    id: string;
    name: string;
    avatarUrl?: string | null;
    bio?: string | null;
    serviceIds?: string[];
  }>;
}>(null);

const selectedServiceId = ref<string | null>(null);
const selectedStaffId = ref<string | null>(null);

const dateLocal = ref<string>("");
const slots = ref<Array<{ startUtc: string; endUtc: string }>>([]);
const selectedSlot = ref<{ startUtc: string; endUtc: string } | null>(null);

const customerName = ref("");
const customerEmail = ref("");
const notes = ref("");

const errorMessage = ref("");
const successData = ref<any>(null);

const todayYmd = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const formatPrice = (cents?: number | null) => {
  if (cents == null) return "";
  return `₱${(cents / 100).toLocaleString("en-PH", {
    minimumFractionDigits: 0,
  })}`;
};

const timeZone = computed(
  () => bookingConfig.value?.business.timezone || "Asia/Manila"
);

const formatSlotLabel = (startUtc: string, endUtc: string) => {
  const tz = timeZone.value || "Asia/Manila";

  const fmt = new Intl.DateTimeFormat("en-PH", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: tz,
  });

  return `${fmt.format(new Date(startUtc))} - ${fmt.format(new Date(endUtc))}`;
};

const canSearchSlots = computed(
  () =>
    !!selectedServiceId.value && !!selectedStaffId.value && !!dateLocal.value
);

// ------------ API calls

async function fetchConfig() {
  try {
    const res: any = await $fetch(
      `${apiBase}/public/${businessId.value}/bookings/config`
    );
    const data = res.data || res;
    if (!data) {
      errorMessage.value = "Unable to load booking configuration.";
      return;
    }

    bookingConfig.value = data;
    console.log("Booking config TZ:", bookingConfig.value?.business.timezone);

    const cfg = bookingConfig.value;
    if (!cfg) return;

    const firstService = cfg.services?.[0];
    if (firstService) {
      selectedServiceId.value = firstService.id;

      const staffForSvc =
        (cfg.staff || []).filter((s) =>
          s.serviceIds?.includes(firstService.id)
        ) || [];

      const firstStaff = staffForSvc[0];
      if (firstStaff) {
        selectedStaffId.value = firstStaff.id;
      }
    }

    dateLocal.value = ymdInTz(
      new Date(),
      bookingConfig.value?.business.timezone
    );

    if (selectedServiceId.value && selectedStaffId.value) {
      await fetchSlots();
    }
  } catch (e: any) {
    console.error(e);
    errorMessage.value =
      e?.data?.message || "Unable to load booking page. Please try again.";
  } finally {
    loadingConfig.value = false;
  }
}

async function fetchSlots() {
  if (!canSearchSlots.value) return;
  loadingSlots.value = true;
  errorMessage.value = "";
  selectedSlot.value = null;
  slots.value = [];

  try {
    const res: any = await $fetch(
      `${apiBase}/public/${businessId.value}/bookings/availability`,
      {
        params: {
          serviceId: selectedServiceId.value,
          staffId: selectedStaffId.value,
          dateLocal: dateLocal.value,
        },
      }
    );
    const payload = res.data || res;
    const tz = timeZone.value || "Asia/Manila";
    let list: Array<{ startUtc: string; endUtc: string }> = payload.slots || [];

    if (isSameYmdInTz(dateLocal.value, tz)) {
      list = filterPastSlotsForToday(list, 10);
    }

    slots.value = list;
  } catch (e: any) {
    console.error(e);
    errorMessage.value =
      e?.data?.message ||
      "Unable to load available times. Please adjust your selection.";
  } finally {
    loadingSlots.value = false;
  }
}

const formValid = computed(
  () =>
    !!selectedServiceId.value &&
    !!selectedStaffId.value &&
    !!selectedSlot.value &&
    !!customerName.value
);

async function submitBooking() {
  if (!formValid.value || !selectedSlot.value) return;
  submitting.value = true;
  errorMessage.value = "";
  successData.value = null;

  try {
    const idemKey =
      (crypto as any).randomUUID?.() ||
      Math.random().toString(36).substring(2) + Date.now().toString(36);

    const body = {
      serviceId: selectedServiceId.value,
      staffId: selectedStaffId.value,
      customerName: customerName.value,
      customerEmail: customerEmail.value || undefined,
      startUtc: selectedSlot.value.startUtc,
      endUtc: selectedSlot.value.endUtc,
      notes: notes.value || undefined,
      channelRef: "public-landing",
    };

    const res: any = await $fetch(
      `${apiBase}/public/${businessId.value}/bookings`,
      {
        method: "POST",
        body,
        headers: {
          "x-idempotency-key": idemKey,
        },
      }
    );

    successData.value = res.data || res;
  } catch (e: any) {
    console.error(e);
    errorMessage.value =
      e?.data?.message ||
      e?.message ||
      "Sorry, something went wrong while creating your booking.";
  } finally {
    submitting.value = false;
  }
}

function resetFormForNewBooking() {
  selectedSlot.value = null;
  customerName.value = "";
  customerEmail.value = "";
  notes.value = "";
  successData.value = null;
  fetchSlots();
}

function ymdInTz(d: Date, tz: any) {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return fmt.format(d);
}

function isSameYmdInTz(ymd: string, tz: string) {
  return ymd === ymdInTz(new Date(), tz);
}

/** Filter out slots that have already passed "now" (UTC instant), with optional lead minutes. */
function filterPastSlotsForToday(
  all: Array<{ startUtc: string; endUtc: string }>,
  leadMinutes = 0
) {
  const now = new Date();
  const nowWithLead = new Date(now.getTime() + leadMinutes * 60_000);
  return all.filter((s) => new Date(s.endUtc) > nowWithLead);
}

const brandColor = computed(
  () => bookingConfig.value?.business.primaryColor || "#3b82f6"
);

// optional: convert hex to rgba for soft backgrounds
function hexToRgba(hex: string, alpha = 1) {
  const v = hex.replace("#", "");
  const bigint = parseInt(
    v.length === 3
      ? v
          .split("")
          .map((c) => c + c)
          .join("")
      : v,
    16
  );
  const r = (bigint >> 16) & 255,
    g = (bigint >> 8) & 255,
    b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function setBrandVars(c: string) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--brand", c);
  root.style.setProperty("--brand-10", hexToRgba(c, 0.1));
  root.style.setProperty("--brand-15", hexToRgba(c, 0.15));
  root.style.setProperty("--brand-30", hexToRgba(c, 0.3));
}

if (import.meta.client) {
  watch(brandColor, (c) => setBrandVars(c), { immediate: true });
}

watch(
  () => bookingConfig.value?.business.logoUrl,
  (logo) => {
    if (!logo) return;
    useHead({
      link: [
        { rel: "icon", type: "image/png", href: logo },
        { rel: "apple-touch-icon", href: logo, sizes: "180x180" },
      ],
    });
  },
  { immediate: true }
);

watch(
  () => bookingConfig.value?.business,
  (biz) => {
    if (!biz) return;
    useHead({
      meta: [
        { property: "og:title", content: biz.name },
        {
          property: "og:description",
          content: biz.tagline || "Book in one tap.",
        },
        biz.logoUrl ? { property: "og:image", content: biz.logoUrl } : {},
      ].filter(Boolean) as any,
    });
  },
  { immediate: true }
);

onMounted(fetchConfig);
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-50">
    <div
      class="pointer-events-none fixed inset-0"
      :style="{
        background: `linear-gradient(135deg, var(--brand-10), transparent 60%)`,
      }"
    />
    <div
      class="pointer-events-none fixed -top-40 -right-32 h-72 w-72 rounded-full blur-3xl"
      :style="{ background: 'var(--brand-15)' }"
    />

    <div class="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 lg:py-12">
      <PublicBookingHero :business="bookingConfig?.business || null" />

      <div
        v-if="!loadingConfig && errorMessage && !bookingConfig"
        class="rounded-2xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-[11px] text-red-200"
      >
        {{ errorMessage }}
      </div>

      <div v-if="bookingConfig" class="grid gap-5 lg:grid-cols-[1.9fr,1.2fr]">
        <div
          class="space-y-4 rounded-3xl bg-slate-950/60 p-4 ring-1 ring-slate-800/80 backdrop-blur"
        >
          <PublicBookingServiceSelector
            :services="bookingConfig.services"
            :selectedServiceId="selectedServiceId"
            :formatPrice="formatPrice"
            @update:selectedServiceId="
              (id: any) => {
                selectedServiceId = id;
                selectedSlot = null;
                fetchSlots();
              }
            "
          />

          <PublicBookingStaffSelector
            :staff="bookingConfig.staff"
            :selectedStaffId="selectedStaffId"
            @update:selectedStaffId="
              (id: any) => {
                selectedStaffId = id;
                selectedSlot = null;
                fetchSlots();
              }
            "
          />

          <PublicBookingDateTimeSelector
            :timeZone="timeZone"
            :dateLocal="dateLocal"
            :slots="slots"
            :loadingSlots="loadingSlots"
            :selectedSlot="selectedSlot"
            :formatSlotLabel="formatSlotLabel"
            @update:dateLocal="
              (val: any) => {
                dateLocal = val;
                fetchSlots();
              }
            "
            @update:selectedSlot="(slot: any) => (selectedSlot = slot)"
            @set-today="
              () => {
                const tz = timeZone;
                dateLocal = ymdInTz(new Date(), tz);
                fetchSlots();
              }
            "
          />

          <PublicBookingDetailsForm
            v-model:customerName="customerName"
            v-model:customerEmail="customerEmail"
            v-model:notes="notes"
            :errorMessage="errorMessage"
            :submitting="submitting"
            :canSubmit="formValid"
            @submit="submitBooking"
          />
        </div>

        <PublicBookingSummary
          :bookingConfig="bookingConfig"
          :selectedServiceId="selectedServiceId"
          :selectedStaffId="selectedStaffId"
          :dateLocal="dateLocal"
          :selectedSlot="selectedSlot"
          :timeZone="timeZone"
          :formatSlotLabel="formatSlotLabel"
          :successData="successData"
          @reset="resetFormForNewBooking"
        />
      </div>

      <div
        v-if="loadingConfig"
        class="flex items-center gap-2 text-[10px] text-slate-400"
      >
        <span
          class="h-2 w-2 animate-spin rounded-full border border-slate-300 border-t-transparent"
        />
        Preparing your booking experience...
      </div>
    </div>
  </div>
</template>
