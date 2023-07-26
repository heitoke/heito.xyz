import { type IAPI } from '../';

import { DocumentationAPI } from '~/libs/docs';

import type { IList } from '~/types/api/lists';
import type { IListTitle } from '~/types/api/lists/title';


const docs = new DocumentationAPI('lists', {
    path: '/lists',
    label: 'Lists',
    icon: 'book',
    version: 'beta'
});


interface BodyListTitle {
    name: string;
    title: string;
    description: string;
    image: string;
    category: string;
}


export default class Route {
    private $api: IAPI;

    constructor(api: IAPI) {
        this.$api = api;
    }

    @docs.route({
        label: 'Get list lists',
        icon: 'book',
        // description: 'Get a complete list of all blogs that are',
        statuses: [
            { code: 200, text: 'OK' },
            { code: 501, text: 'Server error' }
        ]
    })
    list(): [{ count: number, results: Array<IList> }, number, any] {
        return this.$api.get(`/lists`) as any;
    }

    @docs.route({
        label: 'Get list',
        icon: 'book',
        path: '/:listId',
        description: 'Learn something about a specific list',
        params: [
            { name: 'listId', text: 'ListID or Name' }
        ],
        statuses: [
            { code: 200, text: 'OK' },
            { code: 404, text: 'There is no such list' },
            { code: 501, text: 'Server error' }
        ]
    })
    get(listId: string): [IList, number, any] {
        return this.$api.get(`/lists/${listId}`) as any;
    }

    @docs.route({
        label: 'Get list titles in list',
        icon: 'images',
        path: '/lists/:listId/titles/:titleId',
        // description: 'Get a complete list of all blogs that are',
        queries: [
            { name: 'category', type: 'string' }
        ],
        statuses: [
            { code: 200, text: 'OK' },
            { code: 404, text: 'There is no such list' },
            { code: 501, text: 'Server error' }
        ]
    })
    listTitles(listId: string, category: string): [{ count: number, results: Array<IListTitle> }, number, any] {
        return this.$api.get(`/lists/${listId}/titles?category=${category || ''}`) as any;
    }

    @docs.route({
        label: 'Get title in list',
        icon: 'image',
        path: '/:listId/titles/:titleId',
        description: 'Learn something about a specific title in list',
        params: [
            { name: 'listId', text: 'ListID or Name' }
        ],
        statuses: [
            { code: 200, text: 'OK' },
            { code: 404, text: 'There is no such list' },
            { code: 404, text: 'Such a title does not exist in this list' },
            { code: 501, text: 'Server error' }
        ]
    })
    getTitle(listId: string, titleId: string): [IListTitle, number, any] {
        return this.$api.get(`/lists/${listId}/titles/${titleId}`) as any;
    }

    @docs.route({
        label: 'Create new list',
        icon: 'book',
        path: '/lists',
        body: [
            { name: 'name', type: 'string', required: true },
            { name: 'title', type: 'string' }
        ],
        statuses: [
            { code: 200, text: 'OK' },
            { code: 400, text: 'You didn\'t specify the \'name\' field in \'body\'.' },
            { code: 401, text: 'You don\'t have editing rights' },
            { code: 401, text: 'Such a list already exists' },
            { code: 501, text: 'Server error' }
        ],
        method: 'POST'
    })
    create(body: { name: string, title: string }): [IList, number, any] {
        return this.$api.post(`/lists`, { body }) as any;
    }

    @docs.route({
        label: 'Create new title in list',
        icon: 'image',
        path: '/lists/:listId/titles',
        body: [
            { name: 'name', type: 'string', required: true },
            { name: 'title', type: 'string' },
            { name: 'description', type: 'string' },
            { name: 'image', type: 'string' },
            { name: 'category', type: 'string', required: true }
        ],
        statuses: [
            { code: 200, text: 'OK' },
            { code: 400, text: 'You didn\'t specify the \'name\' field in \'body\'.' },
            { code: 401, text: 'You don\'t have editing rights' },
            { code: 401, text: 'Such a list already exists' },
            { code: 501, text: 'Server error' }
        ],
        method: 'POST'
    })
    createTitle(listId: string, body: BodyListTitle): [IListTitle, number, any] {
        return this.$api.post(`/lists/${listId}/titles`, { body }) as any;
    }

    @docs.route({
        label: 'Update list',
        icon: 'image',
        path: '/:listId',
        description: 'Update your list',
        params: [
            { name: 'listId', text: 'ListId or Name' }
        ],
        body: [],
        statuses: [
            { code: 200, text: 'OK' },
            { code: 401, text: 'You don\'t have editing rights' },
            { code: 404, text: 'There is no such blog' },
            { code: 501, text: 'Server error' }
        ],
        method: 'PATCH'
    })
    update(listId: string, body: Omit<IList, '_id' | 'user' | 'updatedAt' | 'createdAt'>): [string, number, any] {
        return this.$api.patch(`/lists/${listId}`, { body }) as any;
    }

    @docs.route({
        label: 'Update title in list',
        icon: 'image',
        path: '/:listId/titles/:titleId',
        description: 'Update your title',
        params: [
            { name: 'listId', text: 'ListId or Name' },
            { name: 'titleId', text: 'TitleId or Name' },
        ],
        body: [],
        statuses: [
            { code: 200, text: 'OK' },
            { code: 401, text: 'You don\'t have editing rights' },
            { code: 404, text: 'There is no such blog' },
            { code: 501, text: 'Server error' }
        ],
        method: 'PATCH'
    })
    updateTitle(listId: string, titleId: string, body: BodyListTitle): [string, number, any] {
        return this.$api.patch(`/lists/${listId}/titles/${titleId}`, { body }) as any;
    }
}