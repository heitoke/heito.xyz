import type { API } from '~/plugins/api';
import type { Response } from '~/types/api';

// * Types
import type { User } from '~/types/api/user';


export default class Route {
    private api;

    constructor(api: API) {
        this.api = api;
    }

    me(): Response<{
        200: User;
    }> {
        return this.api.get(`/users/me`);
    }
}