import type { Component } from 'vue';
import type { StoreOptions } from 'vuex';

import { TIcon } from '../../libs/types';

export type TPosition = 'center' | 'top' | 'right' | 'bottom' | 'left' | 'fixed-target';

export interface IContextMenuButton {
    label: string;
    text?: string;
    icon?: string;
    img?: string;
    color?: string;
    component?: string | Component;
    separator?: boolean;
    value?: object | number | string;
    click?(e?: Event): void;
    checkbox?(value?: boolean): void;
    children?: IContextMenu;
}

export interface IComponent {
    component: Component | string;
    name: string;
    props?: {
        [key: string]: any;
    },
    events?: {
        [key: string]: (...args: any) => any;
    }
}

export interface IContextMenu {
    name: string;
    title?: string;
    text?: string;
    event?: Event | MouseEvent;
    position?: Array<TPosition>;
    x?: number;
    y?: number;
    autoMaxWidth?: boolean;
    buttons?: IContextMenuButton[];
    components?: IComponent[];
}

interface State {
    list: IContextMenu[]
}

const module: StoreOptions<State> = {
    state: {
        list: []
    },
    mutations: {
        'contextmenu:create'(state: State, contextMenu: IContextMenu) {
            window.addEventListener('contextmenu', e => {
                e.preventDefault();
            }, { once: true });

            if (state.list.find(c => c.name === contextMenu.name)) return;

            let event = contextMenu.event || window.event;
            
            state.list = [...state.list || [], {
                position: ['bottom', 'right'],
                ...contextMenu,
                event
            }];
        },
        'contextmenu:close'(state: State, contextMenuName: string) {
            state.list = state.list.filter((contextMenu: IContextMenu) => contextMenu.name !== contextMenuName);
        }
    },
    actions: {
        setContextMenu({ commit }, contextMenu: IContextMenu) {
            return commit('contextmenu:create', contextMenu);
        },
        closeContextMenu({ commit }, contextMenuName: string) {
            return commit('contextmenu:close', contextMenuName);
        }
    },
    getters: {
        getListContextMenus(state: State): IContextMenu[] {
            return state.list;
        }
    }
}

export default module;