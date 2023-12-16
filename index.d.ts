interface HeaderOptions {
    padding?: string;
}

type Flag = 'hide-footer' | 'hide-header';

declare module 'nuxt/dist/pages/runtime/composables' {
    interface PageMeta {
        title?: string;
        header?: HeaderOptions;
        flags?: Array<Flag>;
    }
}

export {}