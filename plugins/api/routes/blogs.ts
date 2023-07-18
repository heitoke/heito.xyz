import { type IAPI } from '../';

import { DocumentationAPI } from '~/libs/docs';

import type { IBlog, TBlogUserLike } from '~/types/api/blog';


const docs = new DocumentationAPI('blogs', {
    path: '/blogs',
    label: 'Blogs',
    icon: 'quill',
    version: 'beta'
});


export interface IBlogFilters {
    skip?: number;
    limit?: number;
    fields?: Array<string>;
    by?: Array<string>;
    text?: string;
    sort?: 'date' | 'name';
    order?: boolean;
}

export default class Route {
    private $api: IAPI;

    constructor(api: IAPI) {
        this.$api = api;
    }

    @docs.route({
        label: 'Get list blogs',
        icon: 'quill',
        description: 'Get a complete list of all blogs that are',
        statuses: [
            { code: 200, text: 'OK' },
            { code: 501, text: 'Server error' }
        ]
    })
    list({ skip = 0, limit = 16, fields = [], by = ['name', 'title'], text = '', sort = 'date', order = true }: IBlogFilters = {}): [{ count: number, results: Array<IBlog> }, number, any] {
        return this.$api.get(`/blogs?skip=${skip || 0}&limit=${limit || 0}&fields=${fields.join(',')}&by=${by.join(',')}&text=${text || ''}&sort=${sort || 'date'}&order=${order}`) as any;
    }

    @docs.route({
        label: 'Get blog',
        icon: 'quill',
        path: '/:blogId',
        description: 'Learn something about a specific blog',
        params: [
            { name: 'blogId', text: 'BlogId or Name' }
        ],
        statuses: [
            { code: 200, text: 'OK' },
            { code: 404, text: 'There is no such blog' },
            { code: 501, text: 'Server error' }
        ]
    })
    get(blogId: string): [IBlog, number, any] {
        return this.$api.get(`/blogs/${blogId}`) as any;
    }

    @docs.route({
        label: 'Create new blog',
        icon: 'quill',
        description: 'Create a new blog',
        body: [
            { name: 'name', type: 'string', required: true },
            { name: 'title', type: 'string', required: true }
        ],
        statuses: [
            { code: 200, text: 'OK' },
            { code: 400, text: 'You didn\'t specify the \'name\' or \'title\' field in \'body\'.' },
            { code: 401, text: 'You don\'t have editing rights' },
            { code: 501, text: 'Server error' }
        ],
        method: 'POST'
    })
    create(body: { name: string, title: string }): [IBlog, number, any] {
        return this.$api.post(`/blogs`, { body }) as any;
    }

    @docs.route({
        label: 'Update blog',
        icon: 'pencil',
        path: '/:blogId',
        description: 'Update your blog',
        params: [
            { name: 'blogId', text: 'BlogId' }
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
    update(blogId: string, body: IBlog): [IBlog, number, any] {
        return this.$api.patch(`/blogs/${blogId}`, { body }) as any;
    }

    @docs.route({
        label: 'Actions for blog',
        // icon: '',
        path: '/:blogId',
        // description: 'Switch to the configuration that you like best',
        params: [
            { name: 'blogId', text: 'BlogId' }
        ],
        statuses: [
            { code: 200, text: 'OK' },
            { code: 401, text: 'You don\'t have editing rights' },
            { code: 404, text: 'There is no such blog' },
            { code: 501, text: 'Server error' }
        ],
        method: 'PUT'
    })
    action(blogId: string, action: 'like' | 'dislike'): [string, number, any] {
        return this.$api.put(`/blogs/${blogId}`, { body: { action } }) as any;
    }

    @docs.route({
        label: 'Delete blog or blogs',
        icon: 'trash',
        description: 'Delete one or a list of blogs',
        queries: [
            { name: 'ids', type: 'array<string>', required: true }
        ],
        statuses: [
            { code: 200, text: 'OK' },
            { code: 400, text: 'You did not specify the blog ID' },
            { code: 401, text: 'You don\'t have editing rights' },
            { code: 404, text: 'More than one blog that can be deleted was not found' },
            { code: 501, text: 'Server error' }
        ],
        method: 'DELETE'
    })
    delete(ids: string | Array<string>): [{ deleted: Array<string>, notFound: Array<string> }, number, any] {
        return this.$api.delete(`/blogs?ids=${(Array.isArray(ids) ? ids : [ids]).join(',')}`) as any;
    }

    @docs.route({
        label: 'Get list likes or dislikes blog',
        icon: 'like',
        path: '/:blogId/:type',
        // description: 'Switch to the configuration that you like best',
        params: [
            { name: 'type', enum: { likes: {}, dislikes: {} } }
        ],
        statuses: [
            { code: 200, text: 'OK' },
            { code: 404, text: 'There is no such blog' },
            { code: 501, text: 'Server error' }
        ],
        method: 'GET'
    })
    likes(blogId: string, type: 'likes' | 'dislikes' = 'likes'): [Array<TBlogUserLike>, number, any] {
        return this.$api.get(`/blogs/${blogId}/${type}`) as any;
    }
}