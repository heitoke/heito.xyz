export type TPosition = 'top' | 'top left' | 'top right' | 'center' | 'center left' | 'center right' | 'bottom' | 'bottom left' | 'bottom right';

export type TTypeNotification = 'shadow' | 'old' | 'mini' | 'info' | 'toast';

export type TShadowPosition = 'left' | 'right';

export interface INotificationButton {
    label: string;
    icon?: string;
    img?: string;
    color?: string;
    click?(): void;
}

export interface INotification {
    id?: number;
    title?: string;
    message?: string;
    color?: string;
    icon?: string;
    buttons?: Array<INotificationButton>;
    shadow?: boolean;
    shadowPosition?: TShadowPosition;
    type?: TTypeNotification;
    createdAt?: number;
    hide?: boolean;
}

export interface INotificationError {
    title?: string;
    message?: string;
    icon?: string;
    status?: number;
}