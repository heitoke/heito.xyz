export type Position = 'top' | 'right' | 'bottom' | 'left';

export type PositionType = 'center' | 'corner';


export interface Toolpic {
    title?: string;
    text?: string;
    event?: Event | MouseEvent | Element | HTMLElement;
    position?: Array<Position> | {
        type: PositionType;
        flags: Array<Position>;
    };
}