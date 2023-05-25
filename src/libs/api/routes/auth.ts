import $api, { descriptors } from '../';
import { type IUser } from './users';

export enum ESessionType {
    Access = 'access',
    Refresh = 'refresh',
    GuastToken = 'guast_token'
}

export interface ISession {
    _id: string;
    user: IUser;
    token: string;
    ip: string;
    userAgent: string;
    type: ESessionType;
    refresh: ISession;
    updatedAt: Date;
    createdAt: Date;
}

@descriptors.addCategory({
    label: 'Auth',
    name: 'auth',
    icon: 'exit',
    path: '/auth',
    version: 'beta'
})
class Route {
    constructor() {}

    @descriptors.addRoute('auth', {
        label: 'User register',
        icon: 'hand',
        path: '/register',
        method: 'POST',
        description: 'Register in order not to lose data in the future',
        body: [
            { name: 'login', type: 'string', required: true },
            { name: 'email', type: 'string', required: true },
            { name: 'password', type: 'string', required: true },
            { name: 'repeatPassword', type: 'string', required: true },
        ],
        statuses: [
            { code: 200, text: 'OK' },
            { code: 400, text: 'You have not filled in all the required fields' },
            { code: 401, text: 'Password and repeat password do not match' },
            { code: 409, text: 'You already registered' },
            { code: 501, text: 'Server error' }
        ]
    })
    register(body: { login: string, email: string, password: string, repeatPassword: string }) {
        return $api.post('/auth/register', { body });
    }

    @descriptors.addRoute('auth', {
        label: 'User login',
        icon: 'user-circle',
        path: '/login',
        method: 'POST',
        description: 'Register in order not to lose data in the future',
        body: [
            { name: 'login', type: 'string', required: true },
            { name: 'password', type: 'string', required: true }
        ],
        statuses: [
            { code: 200, text: 'OK' },
            { code: 400, text: 'You have not filled in all the required fields' },
            { code: 401, text: 'Password and repeat password do not match' },
            { code: 409, text: 'You already registered' },
            { code: 501, text: 'Server error' }
        ]
    })
    login(body: { login: string, password: string }) {
        return $api.post('/auth/login', { body: { login: body.login, password: body.password } });
    }

    @descriptors.addRoute('auth', {
        label: 'User sessions',
        icon: 'users',
        path: '/sessions',
        description: 'Find out all active devices connected to the account',
        statuses: [
            { code: 200, text: 'OK' },
            { code: 404, text: 'There is no such user' },
            { code: 501, text: 'Server error' }
        ]
    })
    sessions(): [Array<ISession>, number, any] {
        return $api.get('/auth/sessions') as any;
    }

    @descriptors.addRoute('auth', {
        label: 'User session',
        icon: 'user-circle',
        path: '/sessions',
        description: 'View the data of a specific session',
        statuses: [
            { code: 200, text: 'OK' },
            { code: 403, text: 'You don\'t have rights to view the session' },
            { code: 404, text: 'There is no such session' },
            { code: 501, text: 'Server error' }
        ]
    })
    session(sessionIdOrToken: string): [ISession, number, any] {
        return $api.get(`/auth/sessions/${sessionIdOrToken}`) as any;
    }

    @descriptors.addRoute('auth', {
        label: 'Close user session(s)',
        icon: 'close',
        path: '/sessions',
        method: 'DELETE',
        description: 'End and period.',
        statuses: [
            { code: 200, text: 'OK' },
            { code: 400, text: 'You did not specify the session ID' },
            // { code: 401, text: 'You don\'t have editing rights' },
            { code: 404, text: 'No more than one session found that can be deleted' },
            { code: 501, text: 'Server error' }
        ]
    })
    closeSessions(ids: Array<string> | string): [ISession, number, any] {
        return $api.delete(`/auth/sessions?ids=${(Array.isArray(ids) ? ids : [ids]).join(',')}`) as any;
    }
}

export default new Route();