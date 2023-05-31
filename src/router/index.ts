import { createRouter, createMemoryHistory, createWebHistory, type RouteRecordRaw } from 'vue-router';

let baseUrl = import.meta.env.BASE_URL;

const routes: RouteRecordRaw[] = [
    {
        name: 'MainPage',
        path: '/',
        component: () => import('../pages/Main.vue'),
        meta: {
            title: 'Main',
            icon: 'earth',
            description: '',
            hide: ['footer']
        }
    },
    {
        name: 'ProjectsPage',
        path: '/projects',
        component: () => import('../pages/projects/Main.vue'),
        props: { type: 'projects' },
        meta: {
            title: 'Projects',
            icon: 'images'
        }
    },
    {
        name: 'RepositoriesPage',
        path: '/repositories',
        alias: [
            '/repos/',
            '/repos/:login',
            '/repositories/:login'
        ],
        component: () => import('../pages/projects/Main.vue'),
        props: ({ query, params }) => ({
            login: params?.login || query?.login || 'heitoke',
            type: 'repos'
        }),
        meta: {
            title: 'Repositories',
            icon: 'repo'
        }
    },
    // {
    //     name: 'ProjectPage',
    //     path: '/projects/:projectId',
    //     component: () => import('../pages/projects/Project.vue'),
    //     meta: {
    //         hide: ['page']
    //     }
    // },
    {
        name: 'BlogsPage',
        path: '/blogs',
        component: () => import('../pages/blogs/Main.vue'),
        meta: {
            title: 'Blogs',
            icon: 'quill'
        }
    },
    {
        name: 'BlogPage',
        path: '/blogs/:blogId',
        component: () => import('../pages/blogs/Blog.vue'),
        meta: {
            hide: ['page']
        }
    },
    {
        name: 'StatsPage',
        path: '/stats',
        redirect: '/stats/code',
        children: [
            {
                name: 'StatsCode',
                path: 'code',
                component: () => import('../pages/stats/Code.vue')
            }
        ],
        meta: {
            title: 'Stats',
            icon: 'stats'
        }
    },
    {
        name: 'RefPage',
        path: '/ref/:refId',
        alias: [
            '/referral/:refId',
            '/r/:refId'
        ],
        component: () => import('../pages/Ref.vue'),
        meta: {
            hide: ['page']
        }
    },
    {
        name: 'APIPage',
        path: '/api',
        redirect: '/api/users',
        meta: {
            title: 'API',
            icon: 'filter'
        },
        children: [
            {
                name: 'APIPage',
                path: ':routerName',
                component: () => import('../pages/api/Main.vue')
            }
        ]
    },
    {
        name: 'MusicPage',
        path: '/music',
        component: () => import('../pages/music/Main.vue'),
        meta: {
            title: 'Music',
            icon: 'music-note'
        },
        children: [
            {
                name: 'MusicPlaylistPage',
                path: 'playlists/:playlistId',
                component: () => import('../pages/music/Playlist.vue')
            }
        ]
    },
    {
        path: '/:catchAll(.*)',
        name: 'ErrorPage',
        component: () => import('../pages/Error.vue'),
        meta: {
            hide: ['page', 'footer']
        }
    }
];

const router = createRouter({
    history: import.meta.env.SSR ? createMemoryHistory(baseUrl) : createWebHistory(baseUrl),
    routes
});

let a: number | string = 'asd';

export default router;