import type { StoreOptions } from 'vuex';

export type TPosition = 'top' | 'top left' | 'top right' | 'center' | 'center left' | 'center right' | 'bottom' | 'bottom left' | 'bottom right';

export type TTypeNotification = 'shadow' | 'old' | 'mini' | 'info' | 'toast';

export type TShadowPosition = 'left' | 'right';

export interface INotification {
    id: number;
    title: string;
    message?: string;
    color?: string;
    icon?: string;
    shadow?: boolean;
    shadowPosition?: TShadowPosition;
    type?: TTypeNotification;
    createdAt: number;
    hide?: boolean;
}

interface State {
    isActive: boolean;
    position: TPosition;
    list: INotification[];
}

const module: StoreOptions<State> = {
    state: {
        isActive: false,
        position: 'bottom right',
        list: []
    },
    mutations: {
        'notifications:active'(state: State, value: boolean) {
            state.isActive = value;
        },
        'notifications:push'(state: State, notification: INotification) {
            state.list = [...state.list, {
                shadowPosition: 'left',
                shadow: true,
                ...notification,
                id: state.list.length + 1,
                createdAt: Date.now(),
                hide: false
            }];
        },
        'notifications:hide'(state: State, notificationId: number) {
            let notification: INotification | any = state?.list?.find((n: INotification) => n.id === notificationId);
            notification.hide = true;
        },
        'notifications:remove'(state: State, notificationId: number) {
            state.list = state.list.filter(n => n.id !== notificationId);
        }
    },
    actions: {
        setActiveNotifications({ commit }, value: boolean) {
            return commit('notifications:active', value);
        },
        pushNotification({ commit }, notification: INotification) {
            return commit('notifications:push', notification);
        },
        hideNotification({ commit }, notificationId: number) {
            return commit('notifications:hide', notificationId);
        },
        removeNotification({ commit }, notificationId: number) {
            return commit('notifications:remove', notificationId);
        }
    },
    getters: {
        getPositionNotifications(state: State): TPosition {
            return state.position;
        },
        getActiveNotifications(state: State): boolean {
            return state.isActive;
        },
        getListNotifications(state: State): INotification[] {
            return state.list;
        }
    }
}

export default module;