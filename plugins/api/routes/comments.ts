import { type IAPI } from '../';

import { DocumentationAPI } from '~/libs/docs';

import type { IComment, TCommentCreate } from '~/types/api/comments';


const docs = new DocumentationAPI('comments', {
    path: '/comments',
    label: 'Comments',
    icon: 'comments-alt',
    version: 'beta'
});

export default class Route {
    private $api: IAPI;

    constructor(api: IAPI) {
        this.$api = api;
    }

    @docs.route({
        label: 'Get list comments for page',
        icon: 'comments-alt',
        // description: 'Get a complete list of all blogs that are',
        statuses: [
            { code: 200, text: 'OK' },
            { code: 501, text: 'Server error' }
        ]
    })
    page(url: string | Array<string>, { skip = 0, limit = 32 }): [{ count: number, results: Array<IComment> }, number, any] {
        if (typeof url === 'string') url = [url];

        return this.$api.get(`/comments?${url.map(u => `url=${u}`).join('&')}&skip=${skip}&limit=${limit}`) as any;
    }

    @docs.route({
        label: 'Get comment',
        icon: 'comment',
        path: '/:commentId',
        description: 'Learn something about a specific comment',
        params: [
            { name: 'commentId' }
        ],
        statuses: [
            { code: 200, text: 'OK' },
            { code: 404, text: 'There is no such comment' },
            { code: 501, text: 'Server error' }
        ]
    })
    get(commentId: string): [IComment, number, any] {
        return this.$api.get(`/comments/${commentId}`) as any;
    }

    comments(commentId: string): [{ count: number, results: Array<IComment> }, number, any] {
        return this.$api.get(`/comments/${commentId}/comments`) as any;
    }

    likes(commentId: string, type: 'likes' | 'dislikes') {
        return this.$api.get(`/comments/${commentId}/${type}`);
    }

    @docs.route({
        label: 'Update comment',
        icon: 'comment',
        path: '/:commentId',
        description: 'Update your comment',
        params: [
            { name: 'commentId', text: 'CommentId' }
        ],
        body: [
            { name: 'content', type: 'string', required: true }
        ],
        statuses: [
            { code: 200, text: 'OK' },
            { code: 401, text: 'You don\'t have editing rights' },
            { code: 404, text: 'There is no such comment' },
            { code: 501, text: 'Server error' }
        ],
        method: 'PATCH'
    })
    update(commentId: string, body: { content: string }): [IComment, number, any] {
        return this.$api.patch(`/comments/${commentId}`, { body }) as any;
    }

    @docs.route({
        label: 'Actions for comment',
        // icon: '',
        path: '/:commentId',
        // description: 'Switch to the configuration that you like best',
        params: [
            { name: 'commentId', text: 'CommentId' }
        ],
        statuses: [
            { code: 200, text: 'OK' },
            { code: 401, text: 'You don\'t have editing rights' },
            { code: 404, text: 'There is no such comment' },
            { code: 501, text: 'Server error' }
        ],
        method: 'PUT'
    })
    action(commentId: string, action: 'like' | 'dislike'): [string, number, any] {
        return this.$api.put(`/comments/${commentId}`, { body: { action } }) as any;
    }

    @docs.route({
        label: 'Create new page comment',
        icon: 'comment',
        body: [
            { name: 'url', type: 'string', required: true },
            { name: 'content', type: 'string', required: true },
            { name: 'position.x', type: 'number', required: true },
            { name: 'position.y', type: 'number', required: true },
            { name: 'window.width', type: 'number', required: true },
            { name: 'window.height', type: 'number', required: true }
        ],
        statuses: [
            { code: 200, text: 'OK' },
            { code: 400, text: '' },
            { code: 401, text: 'You don\'t have editing rights' },
            { code: 501, text: 'Server error' }
        ],
        method: 'POST'
    })
    create(body: TCommentCreate): [IComment, number, any] {
        return this.$api.post(`/comments`, { body }) as any;
    }

    @docs.route({
        label: 'Delete comment or comments',
        icon: 'trash',
        description: 'Delete one or a list of comments',
        queries: [
            { name: 'ids', type: 'array<string>', required: true }
        ],
        statuses: [
            { code: 200, text: 'OK' },
            { code: 400, text: 'You did not specify the comment ID' },
            { code: 401, text: 'You don\'t have editing rights' },
            { code: 404, text: 'More than one comment that can be deleted was not found' },
            { code: 501, text: 'Server error' }
        ],
        method: 'DELETE'
    })
    delete(ids: string | Array<string>): [{ deleted: Array<string> }, number, any] {
        return this.$api.delete(`/comments`, {
            body: typeof ids === 'string' ? [ids] : ids
        }) as any;
    }
}