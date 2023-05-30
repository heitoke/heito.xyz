import { App, Plugin, reactive, Component } from "vue";

export type TPosition = 'top' | 'top left' | 'top right' | 'center' | 'center left' | 'center right' | 'bottom' | 'bottom left' | 'bottom right';

export interface IButton {
    label?: string;
    text?: string;
    color?: string;
    icon: string;
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

    create(window: IWindow): { windowId: number };
    close(windowId: number): void;
    hide(windowId: number): void;
    update(windowId: number, newWindow: IWindow): void;

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
        const id = this.list.length + 1;

        this.list.push(reactive({
            position: 'center',
            buttons: [],
            close: true,
            ...window,
            id,
            createdAt: Date.now()
        }));

        return {
            windowId: id
        }
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

    update(windowId: number, newWindow: IWindow) {
        const windowIndex = this.getWindowIndex(windowId);

        if (windowIndex < 0) return;

        this.list[windowIndex] = reactive({ ...this.list[windowIndex], ...newWindow });
    }

    addButtons(windowId: number, buttons: Array<IButton>): void {
        const windowIndex = this.getWindowIndex(windowId);

        if (windowIndex < 0) return;

        for (const button of buttons) {
            this.list[windowIndex].buttons?.push(button);
        }
    }

    removeButtons(windowId: number, ids: Array<number> | number): void {
        const windowIndex = this.getWindowIndex(windowId);

        if (windowIndex < 0 && (!ids || (ids as Array<number>).length < 1)) return;

        if (!Array.isArray(ids)) ids = [ids];
        
        for (const id of ids.sort((a, b) => a > b ? 1 : -1).reverse()) {
            this.list[windowIndex].buttons?.splice(id, 1);
        }
    }
}

const plugin: Plugin = {
    install: (app: App) => {
        const windows = new Windows();

        app.config.globalProperties.$windows = windows;

        app.provide('windows', { windows });
    }
}

export default plugin;

declare module "@vue/runtime-core" {
    interface ComponentCustomProperties {
        $windows: IWindows;
    }
}