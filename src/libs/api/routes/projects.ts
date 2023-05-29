import $api, { DocumentationAPI } from '../';

import { IUser, EPermissions } from './users';

const docs = new DocumentationAPI('projects', {
    path: '/projects',
    label: 'Projects',
    icon: 'images',
    version: 'beta'
});

export interface ILink {
    label: string;
    text: string;
    icon: string;
    img: string;
    color: string;
    url: string;
    updatedAt: Date;
    createdAt: Date;
}

export enum EProjectPermission {
    Member = 'member',
    Moderator = 'moderator',
    Admin = 'admin',
    Owner = 'owner'
}

export interface IProjectMember {
    member: IUser;
    permission: EProjectPermission;
    updatedAt: Date;
    joinedAt: Date;
}

export interface IProject {
    _id: string;
    private?: boolean;
    name?: string;
    displayName?: string;
    image?: string;
    banner?: string;
    description?: string;
    color?: string;
    verified?: boolean;
    isDeleted?: boolean;
    members?: Array<IProjectMember>;
    links?: Array<ILink>;
    tags?: Array<String>;
    updatedAt?: Date;
    createdAt?: Date;
}


class Route {
    constructor() {}

    @docs.route({
        label: 'Get list projects',
        icon: 'images',
        description: 'Get a complete list of all projects that are',
        statuses: [
            { code: 200, text: 'OK' },
            { code: 501, text: 'Server error' }
        ]
    })
    list(): [{ results: Array<IProject>, count: number }, number, any] {
        return $api.get(`/projects`) as any;
    }

    @docs.route({
        label: 'Get project',
        icon: 'image',
        path: '/:projectId',
        description: 'Learn something about a specific project',
        params: [
            { name: 'projectId', text: 'ProjectId or Name' }
        ],
        statuses: [
            { code: 200, text: 'OK' },
            { code: 404, text: 'There is no such project' },
            { code: 501, text: 'Server error' }
        ]
    })
    get(projectId: string): [IProject, number, any] {
        return $api.get(`/projects/${projectId}`) as any;
    }

    @docs.route({
        label: 'Create new project',
        // icon: 'settings-plus',
        description: 'Create a new project',
        body: [
            { name: 'name', type: 'string', required: true }
        ],
        statuses: [
            { code: 200, text: 'OK' },
            { code: 400, text: 'You didn\'t specify the \'name\' field in \'body\'.' },
            { code: 401, text: 'You don\'t have editing rights' },
            { code: 501, text: 'Server error' }
        ],
        method: 'POST'
    })
    create(body: IProject): [IProject, number, any] {
        return $api.post(`/projects`, { body }) as any;
    }

    @docs.route({
        label: 'Update user account',
        icon: 'pencil',
        path: '/:projectId',
        description: 'If you want to change the project, then you need the right to change projects (Projects permission)',
        params: [
            { name: 'projectId', text: 'ProjectId or Name' }
        ],
        queries: [
            { name: 'type', type: 'string', enum: { person: {}, default: {}, links: {} }, default: 'default' }
        ],
        body: [
            { name: 'private', type: 'boolean', text: '' },
            { name: 'name', type: 'string', text: '' },
            { name: 'displayName', type: 'string', text: '' },
            { name: 'image', type: 'string', text: 'URL' },
            { name: 'banner', type: 'string', text: 'URL' },
            { name: 'description', type: 'string', text: 'Max length - 512' },
            { name: 'color', type: 'string', text: '' },
            { name: 'tags', type: 'array<string>' },
            { name: 'links', type: 'array<Link>' },
            { name: 'verified', type: 'boolean', text: '', permissions: [EPermissions.Projects] }
        ],
        statuses: [
            { code: 200, text: 'OK' },
            { code: 400, text: 'You have not specified more than one field to change' },
            { code: 401, text: 'You don\'t have editing rights' },
            { code: 404, text: 'There is no such project' },
            { code: 501, text: 'Server error' }
        ],
        permissions: [EPermissions.Users],
        method: 'PATCH'
    })
    update(projectId: string, body: IProject) {
        return $api.patch(`/projects/${projectId}`, { body });
    }

    @docs.route({
        label: 'Invate members in project',
        icon: 'users',
        description: 'We are expanding our social circle',
        body: [
            { name: 'type', type: 'string', enum: { invate: {}, delete: {} }, default: 'invate' },
            {
                name: 'members',
                type: 'array<{ id: UserId, permission: ProjectPermission }>'
            }
        ],
        statuses: [
            { code: 200, text: 'OK' },
            { code: 400, text: 'You have not specified any user you would like to invite' },
            { code: 401, text: 'You don\'t have editing rights' },
            { code: 404, text: 'There is no such project' },
            { code: 501, text: 'Server error' }
        ],
        method: 'PUT'
    })
    invateMembers(projectId: string, members: Array<{ id: string, permission: EProjectPermission }>, type: 'invate' | 'delete' = 'invate'): [{ message: string, invited: Array<string>, deleted: Array<string> }, number, any] {
        return $api.put(`/projects/${projectId}/members`, {
            body: {
                type,
                members
            }
        }) as any; 
    }
}

export default new Route();