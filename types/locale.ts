export interface Locale {
    language: [string, string];

    languages: {
        en: string;
        ru: string;
    };

    online: string;
    settings: string;
    darkMode: string;
    session: [string, string];
    signIn: string;
    exit: string;
    project: [string, string];

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