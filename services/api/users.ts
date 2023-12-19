import type { API } from '.';
import type { Response } from '~/types/api';

// * Types
import type { User } from '~/types/api/user';


export default class Route {
    private api;

    constructor(api: API) {
        this.api = api;
    }

    me() {
        return this.api.fetch<User>(`/users/me`);
    }
}