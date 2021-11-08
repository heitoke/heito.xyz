import { createRouter, createWebHistory } from 'vue-router'
// import Store from '../store/index.js'

import MainPage from '../views/Main.vue'
import MenuPage from '../views/Menu.vue'
import ProjectsPage from '../views/Projects.vue'
import FriendsPage from '../views/Friends.vue'

import ErrorPage from '../views/Error.vue'


import BlockMenuOnline from '../components/menu/online.vue'
import BlockMenuPages from '../components/menu/pages.vue'
import BlockMenuProjects from '../components/menu/projects.vue'

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'MainPage',
            component: MainPage
        },
        {
            path: '/projects',
            name: 'ProjectsPage',
            component: ProjectsPage
        },
        {
            path: '/friends',
            name: 'FriendsPage',
            component: FriendsPage
        },
        {
            path: '/menu',
            name: 'MenuPage',
            component: MenuPage,
            children: [
                {
                    path: '',
                    name: 'BlockMenuOnline',
                    component: BlockMenuOnline
                },
                {
                    path: 'pages',
                    name: 'BlockMenuPages',
                    component: BlockMenuPages
                },
                {
                    path: 'projects',
                    name: 'BlockMenuProjects',
                    component: BlockMenuProjects
                }
            ]
        },
        {
            path: '/:catchAll(.*)',
            name: 'ErrorPage',
            component: ErrorPage
        }
    ]
})

export default router
