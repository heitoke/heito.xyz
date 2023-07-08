import type { RouterConfig } from "nuxt/schema";

import Projects from '~/pages/projects/index.vue';

export default <RouterConfig> {
    routes: (_routes) => [
        ..._routes,
        {
            name: 'projects',
            path: '/:name(projects|repos)',
            component: Projects,
            props: ({ params, query }) => ({
                login: query?.login || 'heitoke',
                type: params?.name
            })
        },
        {
            name: 'user-repos',
            path: '/repos/:login',
            redirect: (to) => `/repos?login=${to.params.login || 'heitoke'}`
        }
    ]
}