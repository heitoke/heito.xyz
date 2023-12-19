export type Position = 'top' | 'right' | 'bottom' | 'left' | 'center';

export type Type = 'default';

export interface Notification {
    id: number;
    name?: string;
    title?: string;
    text: string;
    icon?: string;
    image?: string;
    color?: string;
    buttons?: Array<any>;
    type?: Type;
    createdAt: number;
    isHidden: boolean;
}

export interface NotificationPlus extends Notification {
    remove(): void;
    hide(): void;
}