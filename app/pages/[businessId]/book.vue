<template>
  <div class="min-h-screen bg-gradient-to-br from-sky-50 via-white to-rose-50">
    <BookingPageLoading :show="loadingConfig" />

    <BookingHeader
      :business="bookingConfig?.business || null"
      @navigate="scrollToSection"
    />

    <section class="bg-white">
      <BookingHero
        :tagline="bookingConfig?.business.tagline || null"
        :brand-color="brandColor"
      />
    </section>

    <main class="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <div class="grid lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-10">
          <BookingServiceSelector
            id="services"
            :services="services"
            :selected-service-id="selectedServiceId"
            :selected-service-duration="selectedServiceDuration"
            :loading="loadingConfig"
            :format-price="formatPrice"
            @select-service="selectService"
          />

          <BookingStaffSelector
            :staff="staffForSelectedService"
            :selected-staff-id="selectedStaffId"
            @select-staff="selectStaff"
          />

          <BookingTimeSelector
            id="time"
            :time-zone="timeZone"
            :date-local="dateLocal"
            :slots="slots"
            :selected-slot="selectedSlot"
            :loading-slots="loadingSlots"
            :format-slot-label="formatSlotLabel"
            @update:dateLocal="(v) => (dateLocal = v)"
            @refresh-slots="fetchSlots"
            @select-slot="(slot) => (selectedSlot = slot)"
          />

          <BookingDetailsForm
            id="details"
            v-model:customerName="customerName"
            v-model:customerEmail="customerEmail"
            v-model:notes="notes"
          />

          <BookingContactSection
            id="contact"
            :contact="businessContact"
            :address="businessAddress"
            :formatted-address="formattedAddress"
            :normalized-hours="normalizedHours"
            :time-zone="timeZone"
            :format-local-time="formatLocalTimeHHMM"
          />
        </div>

        <aside class="lg:col-span-1">
          <BookingSummaryCard
            :service-name="selectedService?.name || '—'"
            :staff-name="selectedStaff?.name || '—'"
            :summary-when="summaryWhen"
            :duration="selectedServiceDuration || 0"
            :price-label="summaryPriceLabel"
            :form-valid="formValid"
            :submitting="submitting"
            :error-message="errorMessage"
            :success-data="successData"
            @submit="bookNow"
            @reset="resetFormForNewBooking"
          />
        </aside>
      </div>
    </main>
  </div>
</template>

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
    contact?: {
      email?: string;
      phone?: string;
      website?: string;
      facebookUrl?: string;
      instagramUrl?: string;
      tiktokUrl?: string;
      messenger?: string;
      viber?: string;
    } | null;
    contactJson?: any;
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
  hours?: Array<{
    dayOfWeek: number;
    openTimeLocal: string;
    closeTimeLocal: string;
  }>;

  staffServices?: Array<{
    staffId: string;
    serviceId: string;
    priceCentsOverride?: number | null;
    durationMinOverride?: number | null;
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

const timeZone = computed(
  () => bookingConfig.value?.business.timezone || "Asia/Manila"
);

// ---------- Contact & address helpers ----------
const businessContact = computed(() => {
  const biz: any = bookingConfig.value?.business;
  if (!biz) return null;
  return biz.contact || biz.contactJson || null;
});

const businessAddress = computed(
  () => bookingConfig.value?.business.address || null
);

const formattedAddress = computed(() => {
  const a = businessAddress.value;
  if (!a) return "";
  const parts = [
    a.line1,
    a.line2,
    [a.city, a.province].filter(Boolean).join(", ") || null,
    a.postalCode,
    a.country,
  ].filter((p) => !!p && String(p).trim().length > 0);
  return parts.join("\n");
});

const businessHours = computed(() => (bookingConfig.value as any)?.hours || []);

const normalizedHours = computed(() => {
  const raw = businessHours.value || [];

  const byDay = new Map<
    number,
    { openTimeLocal: string; closeTimeLocal: string }
  >();
  raw.forEach((h: any) => {
    if (!h) return;
    byDay.set(h.dayOfWeek, {
      openTimeLocal: h.openTimeLocal,
      closeTimeLocal: h.closeTimeLocal,
    });
  });

  const days = [
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" },
    { value: 7, label: "Sunday" },
  ];

  return days.map((d) => {
    const h = byDay.get(d.value);
    if (!h) {
      return {
        ...d,
        closed: true,
        open: "",
        close: "",
      };
    }
    return {
      ...d,
      closed: false,
      open: (h.openTimeLocal || "").slice(0, 5),
      close: (h.closeTimeLocal || "").slice(0, 5),
    };
  });
});

// ---------- Display helpers ----------
const formatPrice = (cents?: number | null) => {
  if (cents == null) return "";
  return `₱${(cents / 100).toLocaleString("en-PH", {
    minimumFractionDigits: 0,
  })}`;
};

const formatSlotLabel = (startUtc: string, endUtc: string) => {
  const tz = timeZone.value || "Asia/Manila";
  const fmt = new Intl.DateTimeFormat("en-PH", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: tz,
  });
  return `${fmt.format(new Date(startUtc))} – ${fmt.format(new Date(endUtc))}`;
};

const canSearchSlots = computed(
  () =>
    !!selectedServiceId.value && !!selectedStaffId.value && !!dateLocal.value
);

function formatLocalTimeHHMM(t: string, tz: string) {
  if (!t) return "";

  const iso = `2000-01-01T${t}:00`;

  const date = new Date(
    new Date(iso).toLocaleString("en-US", { timeZone: tz })
  );

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: tz,
  }).format(date);
}

// date helpers
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
function filterPastSlotsForToday(
  all: Array<{ startUtc: string; endUtc: string }>,
  leadMinutes = 0
) {
  const now = new Date();
  const nowWithLead = new Date(now.getTime() + leadMinutes * 60_000);
  return all.filter((s) => new Date(s.endUtc) > nowWithLead);
}

// ---------- Brand color ----------
const brandColor = computed(
  () => bookingConfig.value?.business.primaryColor || "#ff784b"
);

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
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
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

// ---------- Head tags ----------
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
    const meta: any[] = [
      { property: "og:title", content: biz.name },
      {
        property: "og:description",
        content: biz.tagline || "Book in one tap.",
      },
    ];
    if (biz.logoUrl) {
      meta.push({ property: "og:image", content: biz.logoUrl });
    }
    useHead({ meta });
  },
  { immediate: true }
);

// ---------- Selections ----------
const services = computed(() => bookingConfig.value?.services || []);
const staff = computed(() => bookingConfig.value?.staff || []);
const staffServices = computed(() => bookingConfig.value?.staffServices || []);
const selectedStaffServiceLink = computed(() => {
  if (!selectedServiceId.value || !selectedStaffId.value) return null;
  return (
    staffServices.value.find(
      (ss) =>
        ss.serviceId === selectedServiceId.value &&
        ss.staffId === selectedStaffId.value
    ) || null
  );
});

const effectivePriceCents = computed(() => {
  const svc = selectedService.value;
  if (!svc) return null;
  const link = selectedStaffServiceLink.value;
  return link?.priceCentsOverride ?? svc.priceCents ?? null;
});

const selectedService = computed(
  () => services.value.find((s) => s.id === selectedServiceId.value) || null
);

const selectedServiceDuration = computed(() => {
  const svc = selectedService.value;
  if (!svc) return 0;
  const link = selectedStaffServiceLink.value;
  return link?.durationMinOverride ?? svc.durationMin ?? 0;
});

const staffForSelectedService = computed(() => {
  if (!selectedServiceId.value) return staff.value;
  return staff.value.filter(
    (s) =>
      !s.serviceIds?.length || s.serviceIds.includes(selectedServiceId.value!)
  );
});

const selectedStaff = computed(
  () =>
    staffForSelectedService.value.find((s) => s.id === selectedStaffId.value) ||
    null
);

const summaryWhen = computed(() => {
  if (!selectedSlot.value) return "—";
  return formatSlotLabel(
    selectedSlot.value.startUtc,
    selectedSlot.value.endUtc
  );
});

const summaryPriceLabel = computed(() => {
  const price = effectivePriceCents.value;
  if (!price || price <= 0) return "Free";
  return formatPrice(price);
});
// ---------- API calls ----------
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

    const b: any = data.business || {};
    if (!b.contact && b.contactJson) {
      b.contact = b.contactJson;
    }
    bookingConfig.value = {
      ...data,
      business: b,
    };

    const cfg = bookingConfig.value;
    if (!cfg) return;

    const firstService = cfg.services?.[0];
    if (firstService) {
      selectedServiceId.value = firstService.id;
      const staffForSvc = (cfg.staff || []).filter((s) =>
        s.serviceIds?.includes(firstService.id)
      );
      const firstStaff = staffForSvc[0];
      if (firstStaff) selectedStaffId.value = firstStaff.id;
    }

    dateLocal.value = ymdInTz(new Date(), cfg.business.timezone);

    if (selectedServiceId.value && selectedStaffId.value) await fetchSlots();
  } catch (e: any) {
    console.error(e);
    errorMessage.value =
      e?.data?.message || "Unable to load booking page. Please try again.";
  } finally {
    loadingConfig.value = false;
  }
}

function selectService(id: string) {
  selectedServiceId.value = id;
  if (
    !staffForSelectedService.value.find((s) => s.id === selectedStaffId.value)
  ) {
    selectedStaffId.value = staffForSelectedService.value?.[0]?.id || null;
  }
  selectedSlot.value = null;
  fetchSlots();
}

function selectStaff(id: string) {
  selectedStaffId.value = id;
  selectedSlot.value = null;
  fetchSlots();
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

async function bookNow() {
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
      channelRef: "public-landing-alt",
    };
    const res: any = await $fetch(
      `${apiBase}/public/${businessId.value}/bookings`,
      { method: "POST", body, headers: { "x-idempotency-key": idemKey } }
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

const scrollToSection = (id: string) => {
  if (typeof window === "undefined") return;

  const el = document.getElementById(id);
  if (!el) return;

  const headerOffset = 72;
  const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
  const offsetPosition = elementPosition - headerOffset;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });
};

onMounted(fetchConfig);
</script>

<style>
:root {
  --brand: #ff784b;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.loading-fade-enter-active,
.loading-fade-leave-active {
  transition: opacity 0.18s ease-out;
}
.loading-fade-enter-from,
.loading-fade-leave-to {
  opacity: 0;
}
</style>
