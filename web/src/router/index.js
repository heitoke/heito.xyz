import { createRouter, createWebHistory } from 'vue-router'
import Store from '../store/index.js'

import MainPage from '../views/Main.vue'
import ListPage from '../views/List.vue'

import ErrorPage from '../views/Error.vue'

const routes = [
    {
        path: '/',
        name: 'MainPage',
        component: MainPage
    },
    {
        path: '/list',
        name: 'ListPage',
        component: ListPage
    },
    {
        path: '/:catchAll(.*)',
        name: 'ErrorPage',
        component: ErrorPage
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

router.beforeResolve(() => {
    if (Store.state.connect.ws !== null) Store.state.connect.ws.close()
})

export default router
