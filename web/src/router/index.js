import { createRouter, createWebHistory } from 'vue-router'

// * Pages
import MainPage from '../views/Main.vue'
import ProjectsPage from '../views/Projects.vue'
import ListPage from '../views/List.vue'
import SongsPage from '../views/Songs.vue'

// * Blogs
import BlogsPage from '../views/Blogs.vue'
import BlogPage from '../views/Blog.vue'

// * Other
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
            path: '/songs',
            name: 'SongsPage',
            component: SongsPage,
            meta: { label: 'Songs', icon: 'uil uil-music', description: '' }
        },
        {
            path: '/blogs',
            name: 'BlogsPage',
            component: () => import('../views/Void.vue'),
            meta: { label: 'Blogs', icon: 'uil uil-document-layout-left', description: '' },
            children: [
                {
                    path: '',
                    name: 'BlogsPage',
                    component: BlogsPage
                },
                {
                    path: ':blogId',
                    name: 'BlogPage',
                    component: BlogPage,
                    meta: { label: 'Blog', icon: 'uil uil-document-layout-left', description: '' }
                }
            ]
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
