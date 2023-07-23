type HideName = 'page' | 'footer' | 'go-top';

interface CommentsOptions {
    aliasUrls?: Array<string>;
}

declare module '#app' {
    interface PageMeta {
        title?: string;
        description?: string;
        icon?: string;
        hide?: Array<HideName>;
        index?: number;
        mainPage?: string;
        // comments?: CommentsOptions;
    }
}

export {}