import { App, Plugin, reactive, Component, ref } from "vue";


// * LANGS
import en from './en';
import ru from './ru';

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

type IListOption = {
    name: string;
    ru: string;
    en: string;
}

interface IListLangs {
    ru: IListOption;
    en: IListOption;
}

export type TLangName = 'ru' | 'en';

interface ILangs {
    readonly name: TLangName;
    readonly params: ILang;
    readonly list: IListLangs;
    readonly lang: IListOption;

    set(lang: TLangName): void;
}

const langs: IListLangs = {
    en: {
        name: 'English',
        ru: 'Английский',
        en: 'English'
    },
    ru: {
        name: 'Русский',
        ru: 'Русский',
        en: 'Russian'
    }
}

const listLangs = {
    ru,
    en
}

export class Langs implements ILangs {
    private _name = ref('en' as TLangName);

    readonly list: IListLangs = langs;

    constructor(lang: TLangName = 'en') {
        this.set(lang);
    }

    get name(): TLangName {
        return this._name.value;
    }

    get params(): ILang {
        return listLangs[this.name];
    }

    get lang(): IListOption {
        return this.list[this.name];
    }

    set(lang: TLangName) {
        this._name.value = lang;
    }
}

const plugin: Plugin = {
    install: (app: App) => {
        let name: TLangName = 'en';

        try {
            name = JSON.parse(localStorage.getItem('lang') as TLangName) || 'en';
        } catch (_) {
            name = 'en';    
        }

        const langs = new Langs(name);

        app.config.globalProperties.$lang = langs;

        app.provide('lang', { langs });
    }
}

export default plugin;

declare module "@vue/runtime-core" {
    interface ComponentCustomProperties {
        $lang: ILangs;
    }
}