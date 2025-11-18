export default defineNuxtConfig({
  modules: [
    "@nuxtjs/tailwindcss",
    // '@nuxt/ui', // optional; comment out if you’re not using it
  ],
  css: ["~/assets/css/tailwind.css"],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:4000",
    },
  },
  app: {
    head: {
      title: "Online Booking",
      meta: [
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
      ],
      bodyAttrs: {
        class: "bg-slate-950 text-slate-50 antialiased",
      },
    },
  },
});
