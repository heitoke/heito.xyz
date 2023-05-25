import { App, Plugin, reactive } from "vue";

type TPosition = 'top' | 'top left' | 'top right' | 'center' | 'center left' | 'center right' | 'bottom' | 'bottom left' | 'bottom right';

type TTypeNotification = 'shadow' | 'old' | 'mini' | 'info' | 'toast';

type TShadowPosition = 'left' | 'right';

export interface INotification {
    id?: number;
    title?: string;
    message?: string;
    color?: string;
    icon?: string;
    shadow?: boolean;
    shadowPosition?: TShadowPosition;
    type?: TTypeNotification;
    createdAt?: number;
    hide?: boolean;
} 

interface INotificationsOptions {
    active: boolean;
    position: TPosition;
}

interface INotifications {
    readonly list: Array<INotification>;
    readonly options: INotificationsOptions;

    setActive(active: boolean): void;
    setPotition(position: TPosition): void;

    push(notification: INotification): void;
    hide(notificationId: number): void;
    remove(notificationId: number): void;
}

export class Notifications implements INotifications {
    public options: INotificationsOptions = reactive({ active: false, position: 'bottom right' });
    public list: Array<INotification> = reactive([]);

    constructor() {}

    setActive(active: boolean) {
        this.options.active = active;
    }

    setPotition(position: TPosition) {
        this.options.position = position;
    }

    push(notification: INotification) {
        this.list.push({
            shadowPosition: 'left',
            shadow: true,
            ...notification,
            id: this.list.length + 1,
            createdAt: Date.now(),
            hide: false
        });
    }

    hide(notificationId: number) {
        const notifIndex = this.list.findIndex(notification => notification.id === notificationId);

        if (notifIndex < 0) return;

        this.list[notifIndex].hide = true;
    }

    remove(notificationId: number) {
        const notificationIndex = this.list.findIndex(notification => notification.id === notificationId);

        if (notificationIndex < 0) return;

        this.list.splice(notificationIndex, 1);
    }
}

const plugin: Plugin = {
    install: (app: App) => {
        const notifications = new Notifications();

        app.config.globalProperties.$notifications = notifications;
    }
}

export default plugin;

declare module "@vue/runtime-core" {
    interface ComponentCustomProperties {
        $notifications: INotifications;
    }
}