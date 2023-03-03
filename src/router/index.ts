import { createRouter, createMemoryHistory, createWebHistory, type RouteRecordRaw } from 'vue-router';

let baseUrl = import.meta.env.BASE_URL;

const routes: RouteRecordRaw[] = [
    {
        name: 'MainPage',
        path: '/',
        component: () => import('../pages/Main.vue')
    },
    {
        name: 'ProjectsPage',
        path: '/projects',
        component: () => import('../pages/projects/Main.vue'),
    },
    {
        name: 'ProjectPage',
        path: '/projects/:projectId',
        component: () => import('../pages/projects/Project.vue')
    },
    {
        name: 'BlogsPage',
        path: '/blogs',
        component: () => import('../pages/blogs/Main.vue')
    },
    {
        name: 'BlogPage',
        path: '/blogs/:blogId',
        component: () => import('../pages/blogs/Blog.vue')
    },
    {
        path: '/:catchAll(.*)',
        name: 'ErrorPage',
        component: () => import('../pages/Error.vue')
    }
];

const router = createRouter({
    history: import.meta.env.SSR ? createMemoryHistory(baseUrl) : createWebHistory(baseUrl),
    routes
});

let a: number | string = 'asd';

export default router;