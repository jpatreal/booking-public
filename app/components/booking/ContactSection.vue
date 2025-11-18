<template>
  <section
    class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-black"
  >
    <!-- Header -->
    <div class="flex items-center justify-between mb-5">
      <div class="flex items-center gap-2">
        <div
          class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/5 text-slate-500"
        >
          <!-- Map pin icon -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
          >
            <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" />
            <circle cx="12" cy="10" r="2.4" />
          </svg>
        </div>
        <div>
          <h2 class="text-base font-semibold text-slate-900">
            Contact & location
          </h2>
          <p class="text-xs text-slate-500">
            Reach out to the business or find them on the map.
          </p>
        </div>
      </div>
    </div>

    <div
      v-if="contact || address || normalizedHours.length"
      class="grid gap-4 md:grid-cols-2"
    >
      <!-- Contact card -->
      <div
        v-if="contact"
        class="rounded-xl border border-slate-100 bg-slate-50/60 p-4"
      >
        <h3
          class="mb-3 text-[11px] font-semibold tracking-[0.12em] text-slate-500 uppercase"
        >
          Contact details
        </h3>

        <div class="space-y-3 text-sm">
          <!-- Email -->
          <div v-if="contact?.email" class="flex items-start gap-3">
            <div
              class="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm text-slate-500"
            >
              <!-- Mail icon -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M4 7.5 12 13l8-5.5" />
              </svg>
            </div>
            <div>
              <p class="text-[11px] text-slate-500">Email</p>
              <a
                class="text-sm font-medium text-slate-900 hover:underline break-all"
                :href="`mailto:${contact.email}`"
              >
                {{ contact.email }}
              </a>
            </div>
          </div>

          <!-- Phone -->
          <div v-if="contact?.phone" class="flex items-start gap-3">
            <div
              class="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm text-slate-500"
            >
              <!-- Phone icon -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
              >
                <path
                  d="M7 3h2l1.2 3.6a1 1 0 0 1-.36 1.13l-1.5 1.1a11.5 11.5 0 0 0 4.8 4.8l1.1-1.5a1 1 0 0 1 1.13-.36L17 17v2a1 1 0 0 1-1 1 13 13 0 0 1-11-11 1 1 0 0 1 1-1Z"
                />
              </svg>
            </div>
            <div>
              <p class="text-[11px] text-slate-500">Phone</p>
              <p class="text-sm font-medium text-slate-900">
                {{ contact.phone }}
              </p>
            </div>
          </div>

          <!-- Website -->
          <div v-if="contact?.website" class="flex items-start gap-3">
            <div
              class="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm text-slate-500"
            >
              <!-- Globe icon -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18" />
                <path d="M12 3c2.5 3 2.5 9 0 18" />
                <path d="M12 3c-2.5 3-2.5 9 0 18" />
              </svg>
            </div>
            <div>
              <p class="text-[11px] text-slate-500">Website</p>
              <a
                class="text-sm font-medium text-slate-900 hover:underline break-all"
                :href="contact.website"
                target="_blank"
                rel="noreferrer"
              >
                {{ contact.website }}
              </a>
            </div>
          </div>

          <!-- Divider -->
          <div
            v-if="
              contact?.facebookUrl ||
              contact?.instagramUrl ||
              contact?.tiktokUrl ||
              contact?.messenger ||
              contact?.viber
            "
            class="pt-2 border-t border-slate-200/70"
          ></div>

          <!-- Social icons -->
          <div
            v-if="
              contact?.facebookUrl ||
              contact?.instagramUrl ||
              contact?.tiktokUrl
            "
            class="space-y-1"
          >
            <p class="text-[11px] text-slate-500">Social</p>
            <div class="flex flex-wrap gap-2">
              <!-- Facebook -->
              <a
                v-if="contact?.facebookUrl"
                :href="contact.facebookUrl"
                target="_blank"
                rel="noreferrer"
                class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700"
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
                v-if="contact?.instagramUrl"
                :href="contact.instagramUrl"
                target="_blank"
                rel="noreferrer"
                class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700"
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
                  <rect x="4" y="4" width="16" height="16" rx="4" ry="4" />
                  <circle cx="12" cy="12" r="3.5" />
                  <circle cx="17" cy="7" r="1" fill="currentColor" />
                </svg>
              </a>

              <!-- TikTok -->
              <a
                v-if="contact?.tiktokUrl"
                :href="contact.tiktokUrl"
                target="_blank"
                rel="noreferrer"
                class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700"
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

          <!-- Chat apps -->
          <div v-if="contact?.messenger || contact?.viber" class="space-y-1">
            <p class="text-[11px] text-slate-500">Chat apps</p>
            <div class="space-y-1 text-xs">
              <p v-if="contact?.messenger">
                <span class="text-slate-500">Messenger:</span>
                <span class="font-medium text-slate-900">
                  {{ contact.messenger }}
                </span>
              </p>
              <p v-if="contact?.viber">
                <span class="text-slate-500">Viber:</span>
                <span class="font-medium text-slate-900">
                  {{ contact.viber }}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Location card -->
      <div
        v-if="address"
        class="rounded-xl border border-slate-100 bg-slate-50/60 p-4 flex flex-col justify-between"
      >
        <div>
          <h3
            class="mb-3 text-[11px] font-semibold tracking-[0.12em] text-slate-500 uppercase"
          >
            Location
          </h3>
          <p class="text-sm text-slate-900 whitespace-pre-line leading-relaxed">
            {{ formattedAddress }}
          </p>
        </div>
      </div>

      <!-- Opening hours card -->
      <div
        v-if="normalizedHours.length"
        class="rounded-xl border border-slate-100 bg-slate-50/60 p-4"
      >
        <h3
          class="mb-3 text-[11px] font-semibold tracking-[0.12em] text-slate-500 uppercase"
        >
          Opening hours
        </h3>
        <div class="space-y-1.5 text-xs text-slate-700">
          <div
            v-for="d in normalizedHours"
            :key="d.value"
            class="flex items-center justify-between"
          >
            <span class="text-slate-500">{{ d.label }}</span>
            <span class="font-medium">
              {{
                d.closed
                  ? "Closed"
                  : `${formatLocalTime(d.open, timeZone)} – ${formatLocalTime(
                      d.close,
                      timeZone
                    )}`
              }}
            </span>
          </div>
        </div>
        <p class="mt-2 text-[11px] text-slate-500">
          Times shown in {{ timeZone }}.
        </p>
      </div>
    </div>

    <p v-else class="text-sm text-slate-500">
      This business hasn't added contact details yet. You can still book an
      appointment using the form above.
    </p>
  </section>
</template>

<script setup lang="ts">
interface Contact {
  email?: string;
  phone?: string;
  website?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  messenger?: string;
  viber?: string;
}

interface Address {
  line1?: string;
  line2?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  country?: string;
}

interface NormalizedHour {
  value: number;
  label: string;
  closed: boolean;
  open: string;
  close: string;
}

defineProps<{
  contact: Contact | null;
  address: Address | null;
  formattedAddress: string;
  normalizedHours: NormalizedHour[];
  timeZone: string;
  formatLocalTime: (t: string, tz: string) => string;
}>();
</script>
