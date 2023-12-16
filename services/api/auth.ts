import type { API } from '~/plugins/api';
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

    register(username: string, email: string, password: string): Response<{
        200: SuccessAuthAccount;
        400: string;
    }> {
        return this.api.post('/auth/register', {
            body: {
                username,
                email,
                password
            }
        });
    }

    login(login: string, password: string): Response<{
        200: SuccessAuthAccount;
        401: string;
    }> {
        return this.api.post('/auth/login', {
            body: {
                login,
                password
            }
        });
    }

    logout(): Response<{
        200: string;
    }> {
        return this.api.post('/auth/logout');
    }

    refresh(token: string): Response<{
        200: { access: string }
    }> {
        return this.api.post(`/auth/refresh`, {
            body: {
                token
            }
        });
    }

    guast(): Response<{
        200: SuccessAuthAccount;
    }> {
        return this.api.post('/auth/guast');
    }
}