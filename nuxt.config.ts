export default defineNuxtConfig({
    css: [
        '~/assets/styles/root.scss',
        '~/assets/fonts/icons/style.css'
    ],

    components: {
        global: true,
        dirs: [
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
                pathPrefix: true
            }
        ]
    },

    modules: [
        '@pinia/nuxt'
    ],

    imports: {
        dirs: ['stores']
    },

    runtimeConfig: {
        public: {
            apiURL: process.env.API_URL
        }
    }
});