export type TypeAvatar = 'marble' | 'beam' | 'pixel' | 'sunset' | 'bauhaus' | 'ring';

export interface DefaultImageOptions {
    type?: TypeAvatar;
    size?: number;
    square?: boolean;
    colors?: Array<string>;
    color?: string;
}

const defaultColors = {
    dark: ['0b0b0b', '171717'],
    light: ['ffffff', 'd0d0d0'],
    main: 'ffbf34'
};

export function getDefaultImage(name: string, options: DefaultImageOptions = {}): string {
    const isDarkTheme = process.server || !localStorage['theme'] ? true : localStorage.getItem('theme') === 'dark';

    const {
        type = 'beam',
        size = 512,
        square = true,
        color = process.server ? defaultColors.main : (JSON.parse(localStorage['color'] || '""')?.slice(1) || defaultColors.main),
        colors = [...defaultColors[process.server || isDarkTheme ? 'dark' : 'light'], color]
    } = options;

    return `https://source.boringavatars.com/${type}/${size}/${name}?colors=${colors?.join(',')}&square=${square}`;
}