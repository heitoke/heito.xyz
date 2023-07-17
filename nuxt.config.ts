// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {
        enabled: true
    },
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
        '@pinia/nuxt',
        '@vite-pwa/nuxt',
        'nuxt-simple-sitemap'
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

    pwa: {
        manifest: {
            name: 'heito.xyz',
            short_name: 'heito.xyz',
            description: 'Website'
        },
        workbox: {
            navigateFallback: '/'
        }
    },

    sitemap: {
        sitemaps: {
            pages: {
                include: [
                    '/blogs/**',
                    '/docs/**',
                    '/users/**',
                    '/projects/**',
                    '/music/playlists/**'
                ]
            },
            index: [
                { sitemap: 'https://www.google.com/sitemap-pages.xml' }
            ]
        }
    }
});