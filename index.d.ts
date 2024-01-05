interface HeaderOptions {}

interface PageOptions {
    name?: string;
    icon?: string;
    
    padding?: string;

    index?: number;
}

type Flag = 'hide-footer' | 'hide-header';

declare module 'nuxt/dist/pages/runtime/composables' {
    interface PageMeta {
        header?: HeaderOptions;
        pageOptions?: PageOptions;
        flags?: Array<Flag>;
    }
}

export {}