import { App, Plugin, reactive, Component } from "vue";

export type TPosition = 'top' | 'top left' | 'top right' | 'center' | 'center left' | 'center right' | 'bottom' | 'bottom left' | 'bottom right';

export interface IButton {
    id?: number;
    label?: string;
    text?: string;
    color?: string;
    icon?: string;
    click?(e: Event): void;
}

export interface IWindow {
    id?: number;
    title?: string;
    message?: string;
    component: Component | string;
    icon?: string;
    color?: string;
    position?: TPosition;
    hide?: boolean;
    data?: string | number | boolean | object;
    props?: object;
    buttons?: IButton[];
    error?: boolean;
    close?: boolean;
    createdAt?: number;
}

interface IWindowsOptions {}

interface IWindows {
    readonly list: Array<IWindow>;
    readonly options: IWindowsOptions;

    create(window: IWindow): void;
    close(windowId: number): void;
    hide(windowId: number): void;

    addButtons(windowId: number, buttons: Array<IButton>): void;
    removeButtons(windowId: number, ids: Array<number> | number): void;
}

export class Windows implements IWindows {
    public options: IWindowsOptions = reactive({});
    public list: Array<IWindow> = reactive([]);

    constructor() {}

    private getWindowIndex(windowId: number): number {
        return this.list.findIndex(window => window.id === windowId);
    }

    create(window: IWindow) {
        this.list.push({
            position: 'center',
            buttons: [],
            close: true,
            ...window,
            id: this.list.length + 1,
            createdAt: Date.now()
        });
    }

    close(windowId: number) {
        const windowIndex = this.getWindowIndex(windowId);

        if (windowIndex < 0) return;

        this.list.splice(windowIndex, 1);
    }

    hide(windowId: number) {
        const windowIndex = this.getWindowIndex(windowId);

        if (windowIndex < 0) return;

        this.list[windowIndex].hide = true;
    }


    addButtons(windowId: number, buttons: Array<IButton>): void {
        const windowIndex = this.getWindowIndex(windowId);

        if (windowIndex < 0) return;

        for (const button of buttons) {
            this.list[windowIndex].buttons?.push({
                ...button,
                id: (this.list[windowIndex].buttons?.length || 0) + 1
            });
        }
    }

    removeButtons(windowId: number, ids: Array<number> | number): void {
        const windowIndex = this.getWindowIndex(windowId);

        if (windowIndex < 0 && (!ids || (ids as Array<number>).length < 1)) return;

        if (!Array.isArray(ids)) ids = [ids];

        this.list[windowIndex].buttons = this.list[windowIndex].buttons?.filter(button => (ids as Array<number>).find(id => id === button.id));
    }
}

const plugin: Plugin = {
    install: (app: App) => {
        const windows = new Windows();

        app.config.globalProperties.$windows = windows;
    }
}

export default plugin;

declare module "@vue/runtime-core" {
    interface ComponentCustomProperties {
        $windows: IWindows;
    }
}