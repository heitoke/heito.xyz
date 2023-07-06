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
        },
        {
            path: '~/components/animation',
            pathPrefix: true
        }
    ],
    modules: [
        '@pinia/nuxt',
        '@nuxtjs/i18n'
    ],
    plugins: ['~/plugins/api/index.ts'],
    imports: {
        dirs: ['stores']
    },
    runtimeConfig: {
        public: {
            apiURL: process.env.API_URL
        }
    },
    // nitro: {
    //     preset: 'vercel-edge'
    // },

    i18n: {
        experimental: {
            jsTsFormatResource: true
        },
        precompile: {
            strictMessage: false,
            escapeHtml: true
        },
        baseUrl: 'http://localhost:3000',
        lazy: true,
        defaultLocale: 'en',
        langDir: 'locales',
        locales: [
            {
                code: 'en',
                iso: 'en-US',
                name: 'English',
                file: 'en.ts',
            },
            {
                code: 'ru',
                iso: 'ru-RU',
                name: 'Russian',
                file: 'ru.ts'
            }
        ],
        dynamicRouteParams: true,
        detectBrowserLanguage: {
            useCookie: true
        }
    }
});