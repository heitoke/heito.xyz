import type { API } from '.';
import type { Response } from '~/types/api';

// * Types
interface SuccessAuthAccount {
    user: any;
    tokens: {
        access?: string;
        refresh?: string;
    }
}


export default class Route {
    private api;

    constructor(api: API) {
        this.api = api;
    }

    register(username: string, email: string, password: string) {
        return this.api.fetch<SuccessAuthAccount>('/auth/register', {
            body: {
                username,
                email,
                password
            },
            method: 'POST'
        });
    }

    login(login: string, password: string) {
        return this.api.fetch<SuccessAuthAccount>('/auth/login', {
            body: {
                login,
                password
            },
            method: 'POST'
        });
    }

    logout() {
        return this.api.fetch<string>('/auth/logout', {
            method: 'POST'
        });
    }

    refresh(token: string) {
        return this.api.fetch<{ access: string }>(`/auth/refresh`, {
            body: {
                token
            },
            method: 'POST'
        });
    }

    guast() {
        return this.api.fetch<SuccessAuthAccount>('/auth/guast', {
            method: 'POST'
        });
    }
}