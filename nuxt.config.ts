// import Module from './module';
// import { resolve, dirname } from 'node:path';
// import { fileURLToPath } from 'url';
// import VueI18nVitePlugin from '@intlify/unplugin-vue-i18n/vite';

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
        },
        {
            path: '~/windows',
            pathPrefix: false
        }
    ],
    modules: [
        '@pinia/nuxt',
        // Module,
        // '@nuxtjs/i18n'
    ],
    plugins: [
        '~/plugins/api/index.ts',
        '~/plugins/i18n.ts'
    ],
    imports: {
        dirs: ['stores']
    },
    runtimeConfig: {
        public: {
            apiURL: process.env.API_URL
        }
    },

    // i18n: {
    //     defaultLocale: 'en',
    //     langDir: 'locales',
    //     locales: [
    //         {
    //             code: 'en',
    //             iso: 'en-US',
    //             name: 'English',
    //             file: 'en.ts',
    //         },
    //         {
    //             code: 'ru',
    //             iso: 'ru-RU',
    //             name: 'Russian',
    //             file: 'ru.ts'
    //         }
    //     ],
    //     detectBrowserLanguage: {
    //         useCookie: true
    //     }
    // }
});