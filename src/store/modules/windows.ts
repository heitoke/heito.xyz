import type { Component } from 'vue';
import type { StoreOptions } from 'vuex';

import { TIcon } from '../../libs/types';

export type TPosition = 'top' | 'top left' | 'top right' | 'center' | 'center left' | 'center right' | 'bottom' | 'bottom left' | 'bottom right';

export interface IButton {
    id: number;
    label?: string;
    text?: string;
    color?: string;
    icon?: TIcon;
    click?(e: Event): void;
}

export interface IWindow {
    id: number;
    title: string;
    message?: string;
    component?: Component;
    icon?: TIcon;
    color?: string;
    position?: TPosition;
    hide?: boolean;
    data?: object;
    props?: object;
    buttons?: IButton[];
    createdAt: number;
}

interface State {
    list: IWindow[];
}

const module: StoreOptions<State> = {
    state: {
        list: []
    },
    mutations: {
        'windows:create'(state: State, window: IWindow) {
            state.list = [...state.list, {
                position: 'center',
                buttons: [],
                ...window,
                id: state.list.length + 1,
                createdAt: Date.now()
            }];
        },
        'windows:hide'(state: State, windowId: number) {
            let window: IWindow | any = state?.list?.find((n: IWindow) => n.id === windowId);
            window.hide = true;
        },
        'windows:remove'(state: State, windowId: number) {
            state.list = state.list.filter(n => n.id !== windowId);
        },
        'windows:buttons:add'(state: State, { windowId, buttons }: { windowId: number, buttons: IButton[] }) {
            let windowIndex: number = state.list.findIndex((window: IWindow) => window.id === windowId);

            state.list[windowIndex].buttons = [
                ...state.list[windowIndex].buttons || [],
                ...buttons
            ]
        },
        'windows:buttons:remove'(state: State, { windowId, buttonIds }: { windowId: number, buttonIds: number[] }) {
            let windowIndex: number = state.list.findIndex((window: IWindow) => window.id === windowId);

            state.list[windowIndex].buttons = state.list[windowIndex].buttons?.filter((btn: IButton) => !buttonIds.find(id => id === btn.id));
        }
    },
    actions: {
        createWindow({ commit }, window: IWindow) {
            return commit('windows:create', window);
        },
        hideWindow({ commit }, windowId: number) {
            return commit('windows:hide', windowId);
        },
        removeWindow({ commit }, windowId: number) {
            return commit('windows:remove', windowId);
        },
        addWindowButtons({ commit }, { windowId, buttons }: { windowId: number, buttons: IButton[] }) {
            return commit('windows:buttons:add', { windowId, buttons });
        },
        removeWindowButtons({ commit }, { windowId, buttonIds }: { windowId: number, buttonIds: number[] }) {
            return commit('windows:buttons:add', { windowId, buttonIds });
        }
    },
    getters: {
        getListWindows(state: State): IWindow[] {
            return state.list;
        }
    }
}

export default module;