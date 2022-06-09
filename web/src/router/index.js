import { h, resolveComponent, defineAsyncComponent } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

const
    // * Pages
    MainPage = defineAsyncComponent(() => import('../views/Main.vue')),
    ProjectsPage = defineAsyncComponent(() => import('../views/Projects.vue')),
    ListPage = defineAsyncComponent(() => import('../views/List.vue')),
    SongsPage = defineAsyncComponent(() => import('../views/Songs.vue')),
    // * Blogs
    BlogsPage = defineAsyncComponent(() => import('../views/Blogs.vue')),
    BlogPage = () => import('../views/Blog.vue'),
    // * Other
    ErrorPage = defineAsyncComponent(() => import('../views/Error.vue'));

const createVoidSpace = () => {
    return {
        render() {
            return h(resolveComponent('router-view'))
        }
    }
}

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
            component: () => createVoidSpace(),
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
