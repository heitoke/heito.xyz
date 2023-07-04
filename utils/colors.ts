class Color {
    constructor() {}

    createHex(): string {
        return `#${Math.round((0x1000000 + 0xffffff * Math.random())).toString(16).slice(1)}`;
    }

    randomHexList(count: number = 8): string[] {
        return new Array(count).fill(1).map(() => this.createHex());
    }

    rgbToHex(r: number, g: number, b: number): string {
        return '#' + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
    }

    hexToRgb(hex: string): [number, number, number] {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    
        hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : [0, 0, 0];
    }

    altColor(color: string): string {
        if (color[0] === '#') color = color.substring(1);

        const
            rgb = parseInt(color, 16),
            r = (rgb >> 16) & 0xff,
            g = (rgb >>  8) & 0xff,
            b = (rgb >>  0) & 0xff,
            luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;

        return `#${luma < 40 ? 'ffffff' : '000000'}`;
    }

    stringToHexColor(str: string) {
        let hash = 0,
            color = '#';
    
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
    
        for (let i = 0; i < 3; i++) {
            let value = (hash >> (i * 8)) & 0xFF;
            color += ('00' + value.toString(16)).substr(-2);
        }
    
        return color;
    }

    addAlpha(color: string, opacity: number) {
        let _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
    
        return color + _opacity.toString(16).toUpperCase();
    }
}

export const colors = new Color();