import { defineStore, acceptHMRUpdate } from 'pinia';

import type { INotification, TPosition, INotificationError } from 'types/stores/notifications';

export const useNotificationsStore = defineStore('notifications', {
    state: () => ({
        list: [] as Array<INotification>,
        position: 'bottom right' as TPosition,
        active: false
    }),
    actions: {
        setActive(active: boolean) {
            this.active = active;
        },
        setPotition(position: TPosition) {
            this.position = position;
        },
        push(notification: INotification): INotification {
            const newNotification: INotification = {
                shadowPosition: 'left',
                shadow: true,
                ...notification,
                id: this.list.length + 1,
                createdAt: Date.now(),
                hide: false
            };

            this.list.push(newNotification);

            return newNotification;
        },
        error({ title, message, icon = 'info-circle', status = 501 }: INotificationError): INotification {
            const newNotification: INotification = {
                title: `Error ${title || ''} (${status || 501})`,
                message: message || 'Server error',
                icon: icon,
                color: 'var(--red)'
            };

            this.list.push(newNotification);
    
            return newNotification;
        },
        hide(notificationId: number) {
            const notifIndex = this.list.findIndex(notification => notification.id === notificationId);

            if (notifIndex < 0) return;

            this.list[notifIndex].hide = true;
        },
        remove(notificationId: number) {
            const notificationIndex = this.list.findIndex(notification => notification.id === notificationId);

            if (notificationIndex < 0) return;

            this.list.splice(notificationIndex, 1);
        },
        addNotifications(notifications: Array<INotification>, hide: boolean = true) {
            this.list.push(...notifications.map(n => ({ ...n, hide })));
        }
    },
    getters: {
        getList(state): Array<INotification> {
            return state.list;
        },
        getPosition(state): TPosition {
            return state.position;
        },
        getActive(state): boolean {
            return state.active;
        }
    }
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useNotificationsStore, import.meta.hot));
}