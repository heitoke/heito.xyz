import type { Locale } from '~/types/locale';

const lang: Locale = {
    language: ['Language', 'Languages'],
    languages: {
        en: 'English',
        ru: 'Russian'
    },
    online: 'Online',
    settings: 'Settings',
    darkMode: 'Dark mode',
    session: ['Session', 'Sessions'],
    signIn: 'Sign In',
    exit: 'Exit',
    project: ['Project', 'Projects'],

    pages: {
        home: {
            title: 'Home',
            description: ''
        },
        projects: {
            title: 'Projects',
            description: ''
        },
        repos: {
            title: 'Repositories',
            description: ''
        },
        stats: {
            title: 'Stats',
            description: ''
        }
    },

    footer: {
        thanks: 'Thanks for everything'
    }
};

export default lang;