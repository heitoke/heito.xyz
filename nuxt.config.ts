// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {
        enabled: true
    },
    css: [
        '~/assets/styles/root.scss'
    ],
    components: [
        {
            path: '~/components/UI',
            pathPrefix: false
        }
    ],
    modules: ['@pinia/nuxt'],
    runtimeConfig: {
        public: {
            apiURL: process.env.API_URL
        }
    },
    nitro: {
        preset: 'vercel-edge'
    }
});
