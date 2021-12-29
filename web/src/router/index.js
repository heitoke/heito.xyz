import { createRouter, createWebHistory } from 'vue-router'
// import Store from '../store/index.js'

import MainPage from '../views/Main.vue'
import MenuPage from '../views/Menu.vue'
import ProjectsPage from '../views/Projects.vue'
// import FriendsPage from '../views/Friends.vue'
// import GamesPage from '../views/Games.vue'

import ErrorPage from '../views/Error.vue'

// * Menu
import BlockMenuOnline from '../components/menu/online.vue'
// import BlockMenuPages from '../components/menu/pages.vue'
import BlockMenuProjects from '../components/menu/projects.vue'

// * Games
// import GamePets from '../views/games/Pets.vue'
// import GamePetsCollections from '../components/games/pets/collections.vue'
// import GamePetsStore from '../components/games/pets/store.vue'

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
            component: ProjectsPage,
            meta: { name: 'projects' }
        },
        // {
        //     path: '/friends',
        //     name: 'FriendsPage',
        //     component: FriendsPage
        // },
        // {
        //     path: '/games',
        //     name: 'GamesPage',
        //     component: GamesPage,
        //     children: [
        //         {
        //             path: 'pets',
        //             name: 'GamePets',
        //             component: GamePets,
        //             children: [
        //                 {
        //                     path: '',
        //                     name: 'GamePetsCollections',
        //                     component: GamePetsCollections
        //                 },
        //                 {
        //                     path: 'store',
        //                     name: 'GamePetsStore',
        //                     component: GamePetsStore
        //                 }
        //             ]
        //         }
        //     ]
        // },
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
                // {
                //     path: 'pages',
                //     name: 'BlockMenuPages',
                //     component: BlockMenuPages
                // },
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
