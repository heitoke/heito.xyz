import $api, { descriptors } from '../';

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
        return $api.post('/auth/login', { body });
    }
}

export default new Route();