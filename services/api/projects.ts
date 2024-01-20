import type { API } from '.';
import type { Response, ResponseList } from '~/types/api';

// * Types
import type { Member, Project } from '~/types/api/project';


export default class Route {
    private api;

    constructor(api: API) {
        this.api = api;
    }


    list(skip: number = 0, limit: number = 16) {
        return this.api.fetch<ResponseList<Project>>(`/projects`, {
            query: {
                skip,
                limit
            }
        });
    }

    get(projectId: string) {
        return this.api.fetch<Project>(`/projects/${projectId}`);
    }


    create(name: string, displayName: string) {
        return this.api.fetch<Project>('/projects', {
            body: {
                name,
                displayName
            },
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        });
    }
}