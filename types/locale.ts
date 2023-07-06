export interface ILocale {
    global: {
        settings: string;
        exit: [string, string];
        lang: [string, string];
        notification: [string, string];
        theme: {
            default: string;
            dark: string;
            light: string;
        },
        nickname: string;
        login: string;
        email: string;
        password: string;
        repeatPassword: string;
        sign: {
            in: string;
            out: string;
        }
    },
    page: {
        main: {
            title: string;
            text: string;
        }
    },
    user: {
        auth: {
            title: [string]
        },
        create: {
            title: [string, string];
            text: string;
        }
    }
}