type HideName = 'page' | 'footer' | 'go-top';

declare module '#app' {
    interface PageMeta {
        title?: string;
        description?: string;
        icon?: string;
        hide?: Array<HideName>;
        index?: number;
        mainPage?: string;
    }
}

export {}