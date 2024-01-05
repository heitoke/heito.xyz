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

    hooks: {
        'pages:extend'(pages) {
            pages.push({
                name: 'repositories',
                path: '/repos',
                file: '~/pages/projects.vue',
                meta: {
                    pageOptions: {
                        padding: '0 10%',
                        name: 'repos',
                        icon: 'fork',
                        index: 2
                    }
                }
            });
        }
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