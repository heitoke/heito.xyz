// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {
        enabled: true
    },
    css: [
        '~/assets/styles/root.scss'
    ],
    modules: ['@pinia/nuxt'],
    nitro: {
        preset: 'vercel-edge'
    }
});
