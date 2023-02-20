import en from './en';
import ru from './ru';

export default {
    en: {
        name: 'English',
        ru: 'Английский',
        params: en
    },
    ru: {
        name: 'Русский',
        en: 'Russian',
        params: ru
    }
}

export interface ILang {
    global: {
        settings: string;
        exit: [string, string];
        lang: [string, string];
        notification: [string, string];
        theme: {
            default: string;
            dark: string;
            light: string;
        }
    },
    page: {
        main: {
            title: string;
            text: string;
        }
    }
}