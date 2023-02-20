import { createRouter, createMemoryHistory, createWebHistory, type RouteRecordRaw } from 'vue-router';

let baseUrl = import.meta.env.BASE_URL;

const routes: RouteRecordRaw[] = [
    {
        name: 'MainPage',
        path: '/',
        component: () => import('../pages/Main.vue')
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

export default router;