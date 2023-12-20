import { defineStore, acceptHMRUpdate } from 'pinia';

import type { Notification, NotificationTemplate, Position } from '~/types/stores/notifications';

export const useNotificationsStore = defineStore('notifications', () => {
    const
        _list = ref<Array<Notification>>([]),
        _position = ref<Array<Position>>(['bottom', 'right']),
        _active = ref<boolean>(false);

    
    // * Getters
    const list = computed(() => _list.value);

    const position = computed(() => _position.value);

    const isActive = computed(() => _active.value);


    // * Functions
    function getNotificationIndex(id: number) {
        return _list.value.findIndex(notfication => notfication.id === id);
    }

    function push(notification: NotificationTemplate, isHidden = false): Notification {
        const newNotification: Notification = {
            ...notification,
            id: _list.value.length,
            createdAt: Date.now(),
            isHidden,

            remove: () => remove(newNotification.id),
            hide: () => hide(newNotification.id)
        }

        _list.value.push(newNotification);

        return newNotification;
    }

    function remove(id: number) {
        const index = getNotificationIndex(id);

        if (index < 0) return;

        _list.value.splice(index, 1);
    }

    function hide(id: number) {
        const index = getNotificationIndex(id);

        if (index < 0) return;

        _list.value[index].isHidden = true;
    }

    function searchByName(name: string): Notification {
        const index = _list.value.findIndex(notification => notification.name === name);

        if (index < 0) throw null;

        return _list.value[index];
    }

    
    return {
        list: list.value.sort((a, b) => a.createdAt < b.createdAt ? 1 : -1),
        position,
        isActive,

        setActive(active: boolean) {
            _active.value = active;
        },
        setPosition(position: Array<Position>) {
            _position.value = position;
        },
        hide,
        remove,
        searchByName,
        addNotifications(notifications: Array<Notification>, isHidden: boolean = true) {
            for (const notification of notifications) {
                push(notification, isHidden);
            }
        },

        push
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useNotificationsStore, import.meta.hot));
}