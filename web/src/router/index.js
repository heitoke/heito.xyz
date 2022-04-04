import { createRouter, createWebHistory } from 'vue-router'

// * Pages
import MainPage from '../views/Main.vue'
import ProjectsPage from '../views/Projects.vue'
import ListPage from '../views/List.vue'
import ErrorPage from '../views/Error.vue'

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'MainPage',
            component: MainPage,
            meta: { label: 'Main', icon: 'uil uil-estate', description: '' }
        },
        {
            path: '/projects',
            name: 'ProjectsPage',
            component: ProjectsPage,
            meta: { label: 'Projects', icon: 'uil uil-folder', description: '' }
        },
        {
            path: '/list',
            name: 'ListPage',
            component: ListPage,
            meta: { label: 'List', icon: 'uil uil-list-ul', description: '' }
        },
        {
            path: '/:catchAll(.*)',
            name: 'ErrorPage',
            component: ErrorPage,
            meta: { hide: true }
        }
    ]
})

export default router
