<template>
  <div class="min-h-screen bg-gradient-to-br from-sky-50 via-white to-rose-50">
    <!-- Top bar -->
    <header
      class="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-100"
    >
      <div
        class="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between"
      >
        <div class="flex items-center gap-3">
          <img
            v-if="bookingConfig?.business.logoUrl"
            :src="bookingConfig.business.logoUrl"
            :alt="bookingConfig.business.name"
            class="h-7 w-auto object-contain"
          />
          <span class="text-sm font-semibold text-slate-700">
            {{ bookingConfig?.business.name || "Business" }}
          </span>
        </div>
        <nav class="hidden md:flex items-center gap-6 text-sm text-slate-500">
          <a class="hover:text-slate-700" href="#services">Services</a>
          <a class="hover:text-slate-700" href="#time">Time</a>
          <a class="hover:text-slate-700" href="#details">Details</a>
          <a class="hover:text-slate-700" href="#contact">Contact</a>
        </nav>
      </div>
    </header>

    <!-- Hero -->
    <section class="bg-white">
      <div
        class="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16 grid md:grid-cols-2 gap-8 items-center"
      >
        <div>
          <p class="text-xs uppercase tracking-wider text-slate-400 mb-2">
            Welcome
          </p>
          <h1
            class="text-3xl sm:text-4xl font-bold text-slate-800 leading-tight"
          >
            We focus on your <span :style="{ color: brandColor }">story</span>.
          </h1>
          <p class="mt-3 text-slate-600 text-sm sm:text-base">
            {{
              bookingConfig?.business.tagline ||
              "Book a time with our team and move your project forward."
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
    </section>

    <!-- Main content -->
    <main class="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Left: selectors -->
        <div class="lg:col-span-2 space-y-10">
          <!-- Services -->
          <section
            id="services"
            class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
          >
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-slate-800">
                Select Service
              </h2>
              <span
                v-if="selectedServiceDuration"
                class="text-xs text-slate-500"
              >
                Duration: {{ selectedServiceDuration }} min
              </span>
            </div>

            <div
              v-if="loadingConfig"
              class="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div
                v-for="i in 6"
                :key="i"
                class="h-16 rounded-xl bg-slate-100 animate-pulse"
              />
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                v-for="svc in services"
                :key="svc.id"
                type="button"
                @click="selectService(svc.id)"
                class="group w-full text-left rounded-xl border p-4 transition shadow-sm focus:outline-none"
                :class="
                  svc.id === selectedServiceId
                    ? 'border-transparent ring-2 ring-offset-2 ring-offset-white'
                    : 'border-slate-200 hover:border-slate-300'
                "
                :style="
                  svc.id === selectedServiceId
                    ? { boxShadow: '0 0 0 2px var(--brand)' }
                    : undefined
                "
              >
                <div class="flex items-start gap-3">
                  <div
                    class="mt-1 h-4 w-4 rounded-full border flex items-center justify-center"
                    :class="
                      svc.id === selectedServiceId
                        ? 'border-[var(--brand)]'
                        : 'border-slate-300'
                    "
                  >
                    <div
                      v-if="svc.id === selectedServiceId"
                      class="h-2.5 w-2.5 rounded-full"
                      :style="{ background: 'var(--brand)' }"
                    />
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center justify-between">
                      <p class="font-medium text-slate-800">{{ svc.name }}</p>
                      <p class="text-sm text-slate-500">
                        {{
                          svc.priceCents ? formatPrice(svc.priceCents) : "Free"
                        }}
                      </p>
                    </div>
                    <p
                      v-if="svc.description"
                      class="text-xs text-slate-500 mt-1 line-clamp-2"
                    >
                      {{ svc.description }}
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </section>

          <!-- Staff -->
          <section
            class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
          >
            <h2 class="text-lg font-semibold text-slate-800 mb-3">
              Select Staff
            </h2>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button
                v-for="st in staffForSelectedService"
                :key="st.id"
                type="button"
                @click="selectStaff(st.id)"
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
                  <p
                    v-if="st.bio"
                    class="text-[11px] text-slate-500 line-clamp-1"
                  >
                    {{ st.bio }}
                  </p>
                </div>
              </button>
            </div>
          </section>

          <!-- Time -->
          <section
            id="time"
            class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
          >
            <h2 class="text-lg font-semibold text-slate-800 mb-4">
              Select Time
            </h2>

            <!-- Date picker above -->
            <div class="space-y-2 mb-6">
              <label class="text-xs font-medium text-slate-600">
                Date ({{ timeZone }})
              </label>
              <input
                class="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-slate-200 text-black"
                type="date"
                v-model="dateLocal"
                @change="fetchSlots()"
              />
            </div>

            <!-- Slots below -->
            <div>
              <div
                v-if="loadingSlots"
                class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2"
              >
                <div
                  v-for="i in 10"
                  :key="i"
                  class="h-10 rounded-lg bg-slate-100 animate-pulse"
                />
              </div>

              <div
                v-else-if="slots.length === 0"
                class="text-sm text-slate-500"
              >
                No available slots for this date.
              </div>

              <div
                v-else
                class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2"
              >
                <button
                  v-for="s in slots"
                  :key="s.startUtc + s.endUtc"
                  type="button"
                  class="px-3 py-2 rounded-lg border text-sm transition text-black"
                  :class="
                    selectedSlot && selectedSlot.startUtc === s.startUtc
                      ? 'border-transparent ring-2 ring-offset-2'
                      : 'border-slate-200 hover:border-slate-300'
                  "
                  :style="
                    selectedSlot && selectedSlot.startUtc === s.startUtc
                      ? { boxShadow: '0 0 0 2px var(--brand)' }
                      : undefined
                  "
                  @click="selectedSlot = s"
                >
                  {{ formatSlotLabel(s.startUtc, s.endUtc) }}
                </button>
              </div>

              <p v-if="selectedSlot" class="mt-3 text-xs text-slate-500">
                All times shown in {{ timeZone }}.
              </p>
            </div>
          </section>

          <!-- Details -->
          <section
            id="details"
            class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-black"
          >
            <h2 class="text-lg font-semibold text-slate-800 mb-4">
              Add your details
            </h2>
            <form class="grid md:grid-cols-2 gap-4" @submit.prevent>
              <div class="space-y-1">
                <label class="text-xs text-slate-600">
                  Full name <span class="text-rose-500">*</span>
                </label>
                <input
                  v-model="customerName"
                  class="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-slate-200"
                  placeholder="Juan Dela Cruz"
                />
              </div>
              <div class="space-y-1">
                <label class="text-xs text-slate-600">Email (optional)</label>
                <input
                  v-model="customerEmail"
                  type="email"
                  class="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-slate-200"
                  placeholder="name@email.com"
                />
              </div>
              <div class="md:col-span-2 space-y-1">
                <label class="text-xs text-slate-600">Notes (optional)</label>
                <textarea
                  v-model="notes"
                  class="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-slate-200 min-h-[90px]"
                  placeholder="Anything we should know?"
                />
              </div>
            </form>
          </section>

          <!-- Contact & Location -->
          <section
            id="contact"
            class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-black"
          >
            <h2 class="text-lg font-semibold text-slate-800 mb-4">
              Contact & location
            </h2>

            <div
              v-if="businessContact || businessAddress"
              class="grid md:grid-cols-2 gap-6 text-sm"
            >
              <!-- Contact info -->
              <div class="space-y-3">
                <h3
                  class="text-xs font-semibold tracking-wide text-slate-500 uppercase"
                >
                  Contact
                </h3>

                <div v-if="businessContact?.email">
                  <p class="text-[11px] text-slate-500">Email</p>
                  <a
                    class="text-sm font-medium text-slate-800 hover:underline break-all"
                    :href="`mailto:${businessContact.email}`"
                  >
                    {{ businessContact.email }}
                  </a>
                </div>

                <div v-if="businessContact?.phone">
                  <p class="text-[11px] text-slate-500">Phone</p>
                  <p class="text-sm font-medium text-slate-800">
                    {{ businessContact.phone }}
                  </p>
                </div>

                <div v-if="businessContact?.website">
                  <p class="text-[11px] text-slate-500">Website</p>
                  <a
                    class="text-sm font-medium text-slate-800 hover:underline break-all"
                    :href="businessContact.website"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {{ businessContact.website }}
                  </a>
                </div>

                <!-- Social icons -->
                <div
                  v-if="
                    businessContact?.facebookUrl ||
                    businessContact?.instagramUrl ||
                    businessContact?.tiktokUrl
                  "
                  class="space-y-1"
                >
                  <p class="text-[11px] text-slate-500">Social</p>
                  <div class="flex flex-wrap gap-2">
                    <!-- Facebook -->
                    <a
                      v-if="businessContact?.facebookUrl"
                      :href="businessContact.facebookUrl"
                      target="_blank"
                      rel="noreferrer"
                      class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                      aria-label="Facebook"
                    >
                      <span class="sr-only">Facebook</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        class="h-4 w-4"
                        fill="currentColor"
                      >
                        <path
                          d="M13.5 9H15V6.75A8.8 8.8 0 0 0 13.28 6C12.17 6 11.36 6.37 10.8 6.93 10.24 7.5 10 8.24 10 9.35V11H8v3h2v5h3v-5h2.1l.9-3H13v-1.5c0-.5.12-.84.31-1.04.19-.19.46-.31.86-.31Z"
                        />
                      </svg>
                    </a>

                    <!-- Instagram -->
                    <a
                      v-if="businessContact?.instagramUrl"
                      :href="businessContact.instagramUrl"
                      target="_blank"
                      rel="noreferrer"
                      class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                      aria-label="Instagram"
                    >
                      <span class="sr-only">Instagram</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        class="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.6"
                      >
                        <rect
                          x="4"
                          y="4"
                          width="16"
                          height="16"
                          rx="4"
                          ry="4"
                        />
                        <circle cx="12" cy="12" r="3.5" />
                        <circle cx="17" cy="7" r="1" fill="currentColor" />
                      </svg>
                    </a>

                    <!-- TikTok -->
                    <a
                      v-if="businessContact?.tiktokUrl"
                      :href="businessContact.tiktokUrl"
                      target="_blank"
                      rel="noreferrer"
                      class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                      aria-label="TikTok"
                    >
                      <span class="sr-only">TikTok</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        class="h-4 w-4"
                        fill="currentColor"
                      >
                        <path
                          d="M16.5 7.25c.6.67 1.32 1.22 2.13 1.62.5.25 1.03.43 1.57.54v2.52c-.98-.08-1.94-.34-2.82-.78a7.5 7.5 0 0 1-1.38-.87v5.57c0 3.13-2.54 5.65-5.67 5.65C7.2 21.5 4.7 19 4.7 15.88 4.7 12.77 7.2 10.25 10.33 10.25c.27 0 .54.02.8.06v2.73a2.72 2.72 0 0 0-.8-.12 2.91 2.91 0 0 0-2.9 2.96 2.9 2.9 0 0 0 2.9 2.92c1.6 0 2.88-1.28 2.88-2.92V2.5h3.29c.06.88.34 1.73.82 2.48.3.47.69.9 1.15 1.27Z"
                        />
                      </svg>
                    </a>
                  </div>
                </div>

                <div
                  v-if="businessContact?.messenger || businessContact?.viber"
                  class="space-y-1"
                >
                  <p class="text-[11px] text-slate-500">Chat apps</p>
                  <div class="space-y-1">
                    <p v-if="businessContact?.messenger" class="text-xs">
                      Messenger:
                      <span class="font-medium text-slate-800">
                        {{ businessContact.messenger }}
                      </span>
                    </p>
                    <p v-if="businessContact?.viber" class="text-xs">
                      Viber:
                      <span class="font-medium text-slate-800">
                        {{ businessContact.viber }}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <!-- Address -->
              <div v-if="businessAddress" class="space-y-3">
                <h3
                  class="text-xs font-semibold tracking-wide text-slate-500 uppercase"
                >
                  Location
                </h3>
                <p class="text-sm text-slate-800 whitespace-pre-line">
                  {{ formattedAddress }}
                </p>
              </div>
            </div>

            <p v-else class="text-sm text-slate-500">
              This business hasn’t added contact details yet. You can still book
              an appointment using the form above.
            </p>
          </section>
        </div>

        <!-- Right: summary -->
        <aside class="lg:col-span-1">
          <div
            class="sticky top-24 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-black"
          >
            <h3 class="text-base font-semibold text-slate-800">Summary</h3>
            <div class="mt-4 space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-slate-500">Service</span>
                <span class="font-medium">
                  {{ selectedService?.name || "—" }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">Staff</span>
                <span class="font-medium">
                  {{ selectedStaff?.name || "—" }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">When</span>
                <span class="font-medium">
                  {{ summaryWhen }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">Duration</span>
                <span class="font-medium">
                  {{ selectedServiceDuration || 0 }} min
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">Price</span>
                <span class="font-medium">
                  {{
                    selectedService?.priceCents
                      ? formatPrice(selectedService.priceCents)
                      : "Free"
                  }}
                </span>
              </div>
            </div>

            <button
              class="mt-6 w-full py-3 rounded-xl text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              :style="{ background: 'var(--brand)' }"
              :disabled="!formValid || submitting"
              @click="bookNow"
            >
              {{ submitting ? "Booking…" : "Confirm booking" }}
            </button>

            <p v-if="errorMessage" class="mt-3 text-xs text-rose-600">
              {{ errorMessage }}
            </p>

            <div
              v-if="successData"
              class="mt-3 text-xs text-emerald-600 space-y-1"
            >
              <p>
                Booked! Reference:
                <span class="font-mono">
                  {{ successData?.id || successData?.booking?.id || "OK" }}
                </span>
              </p>
              <button
                class="text-emerald-700/80 underline"
                @click="resetFormForNewBooking"
              >
                Book another
              </button>
            </div>
          </div>
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

const selectedService = computed(
  () => services.value.find((s) => s.id === selectedServiceId.value) || null
);

const selectedServiceDuration = computed(
  () => selectedService.value?.durationMin || 0
);

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
  // choose first staff that can do this service if current staff doesn't match
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

onMounted(fetchConfig);
</script>

<!-- Default brand color (overridden by JS via CSS variables) -->
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
</style>
