import type { Item } from "~/components/models/content/NavBar.vue";

export type Position = 'top' | 'right' | 'bottom' | 'left' | 'center';

export type Type = 'default';

export interface NotificationTemplate {
    name?: string;
    title?: string;
    text: string;
    icon?: string;
    image?: string;
    color?: string;
    buttons?: Array<Item>;
    type?: Type;
}

export interface Notification extends NotificationTemplate {
    id: number;
    isHidden: boolean;
    createdAt: number;

    remove(): void;
    hide(): void;
}