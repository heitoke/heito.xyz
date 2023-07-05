// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {
        enabled: true
    },
    css: [
        '~/assets/styles/root.scss',
        '~/assets/fonts/icons/style.css'
    ],
    components: [
        {
            path: '~/components/UI',
            pathPrefix: false
        }
    ],
    modules: ['@pinia/nuxt'],
    plugins: ['~/plugins/api/index.ts'],
    imports: {
        dirs: ['stores']
    },
    runtimeConfig: {
        public: {
            apiURL: process.env.API_URL
        }
    },
    nitro: {
        preset: 'vercel-edge'
    }
});
