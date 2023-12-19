interface HeaderOptions {}

interface PageOptions {
    padding?: string;
}

type Flag = 'hide-footer' | 'hide-header';

declare module 'nuxt/dist/pages/runtime/composables' {
    interface PageMeta {
        title?: string;
        header?: HeaderOptions;
        pageOptions?: PageOptions;
        flags?: Array<Flag>;
    }
}

export {}