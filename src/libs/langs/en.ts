import { ILang } from './';

const lang: ILang = {
    global: {
        settings: 'Settings',
        exit: ['Exit', 'Exit'],
        lang: ['Languages', 'Language'],
        notification: ['Notifications', 'Notification'],
        theme: {
            default: 'Theme',
            dark: 'Dark theme',
            light: 'Light theme',
        },
        nickname: 'Nickname',
        login: 'Login',
        email: 'EMail',
        password: 'Password',
        repeatPassword: 'Repeat password',
        sign: {
            in: 'Sign in',
            out: 'Sign out'
        }
    },
    page: {
        main: {
            title: 'Welcome my friend',
            text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex odio ad soluta obcaecati magnam sit eius dolor. Numquam dolore exercitationem maxime repellat molestias neque quos.'
        }
    },
    user: {
        auth: {
            title: ['Authorization']
        },
        create: {
            title: ['Create account', 'Create account'],
            text: 'This is necessary so that when you access this site from other browsers or devices, you can log into the same account with the same data. We use your IP to understand if you already have a user.'
        }
    }
}

export default lang;