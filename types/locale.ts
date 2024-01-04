export interface Locale {
    language: string;

    languages: {
        en: string;
        ru: string;
    };

    online: string;
    settings: string;
    darkMode: string;
    session: string;
    sessions: string;
    signIn: string;
    exit: string;

    pages: {
        [key: string]: {
            title: string;
            description: string;
        }
    }

    footer: {
        thanks: string;
    }
}