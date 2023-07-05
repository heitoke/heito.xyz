import { DocumentationAPI, type IAPI } from '~/plugins/api';

import { ISession } from '~/types/api/auth';

// const { $api } = useNuxtApp();

// const docs = new DocumentationAPI('auth', {
//     path: '/auth',
//     label: 'Auth',
//     icon: 'exit',
//     version: 'beta'
// });


export default class Route {
    private $api: IAPI;

    constructor(api: IAPI) {
        this.$api = api;
    }

    // @docs.route({
    //     label: 'User register',
    //     icon: 'hand',
    //     path: '/register',
    //     method: 'POST',
    //     description: 'Register in order not to lose data in the future',
    //     body: [
    //         { name: 'login', type: 'string', required: true },
    //         { name: 'email', type: 'string', required: true },
    //         { name: 'password', type: 'string', required: true },
    //         { name: 'repeatPassword', type: 'string', required: true },
    //     ],
    //     statuses: [
    //         { code: 200, text: 'OK' },
    //         { code: 400, text: 'You have not filled in all the required fields' },
    //         { code: 401, text: 'Password and repeat password do not match' },
    //         { code: 409, text: 'You already registered' },
    //         { code: 501, text: 'Server error' }
    //     ]
    // })
    register(body: { login: string, email: string, password: string, repeatPassword: string }) {
        return this.$api.post('/auth/register', { body });
    }

    // @docs.route({
    //     label: 'User login',
    //     icon: 'user-circle',
    //     path: '/login',
    //     method: 'POST',
    //     description: 'Register in order not to lose data in the future',
    //     body: [
    //         { name: 'login', type: 'string', required: true },
    //         { name: 'password', type: 'string', required: true }
    //     ],
    //     statuses: [
    //         { code: 200, text: 'OK' },
    //         { code: 400, text: 'You have not filled in all the required fields' },
    //         { code: 401, text: 'Password and repeat password do not match' },
    //         { code: 409, text: 'You already registered' },
    //         { code: 501, text: 'Server error' }
    //     ]
    // })
    login(body: { login: string, password: string }) {
        return this.$api.post('/auth/login', { body: { login: body.login, password: body.password } });
    }

    // @docs.route({
    //     label: 'User sessions',
    //     icon: 'users',
    //     path: '/sessions',
    //     description: 'Find out all active devices connected to the account',
    //     statuses: [
    //         { code: 200, text: 'OK' },
    //         { code: 404, text: 'There is no such user' },
    //         { code: 501, text: 'Server error' }
    //     ]
    // })
    sessions(): [Array<ISession>, number, any] {
        return this.$api.get('/auth/sessions') as any;
    }

    // @docs.route({
    //     label: 'User session',
    //     icon: 'user-circle',
    //     path: '/sessions',
    //     description: 'View the data of a specific session',
    //     params: [
    //         { name: 'sessionId', text: 'SessionId or Token' }
    //     ],
    //     statuses: [
    //         { code: 200, text: 'OK' },
    //         { code: 403, text: 'You don\'t have rights to view the session' },
    //         { code: 404, text: 'There is no such session' },
    //         { code: 501, text: 'Server error' }
    //     ]
    // })
    session(sessionIdOrToken: string): [ISession, number, any] {
        return this.$api.get(`/auth/sessions/${sessionIdOrToken}`) as any;
    }

    // @docs.route({
    //     label: 'Close user session(s)',
    //     icon: 'close',
    //     path: '/sessions',
    //     method: 'DELETE',
    //     description: 'End and period.',
    //     queries: [
    //         { name: 'ids', type: 'array<string>', required: true }
    //     ],
    //     statuses: [
    //         { code: 200, text: 'OK' },
    //         { code: 400, text: 'You did not specify the session ID' },
    //         // { code: 401, text: 'You don\'t have editing rights' },
    //         { code: 404, text: 'No more than one session found that can be deleted' },
    //         { code: 501, text: 'Server error' }
    //     ]
    // })
    closeSessions(ids: Array<string> | string): [ISession, number, any] {
        return this.$api.delete(`/auth/sessions?ids=${(Array.isArray(ids) ? ids : [ids]).join(',')}`) as any;
    }

    // @docs.route({
    //     label: 'Logout user',
    //     icon: 'exit',
    //     path: '/logout',
    //     method: 'POST',
    //     statuses: [
    //         { code: 200, text: 'OK' },
    //         { code: 404, text: 'There is no such user' },
    //         { code: 501, text: 'Server error' }
    //     ]
    // })
    logout() {
        return this.$api.post(`/auth/logout`) as any;
    }
}