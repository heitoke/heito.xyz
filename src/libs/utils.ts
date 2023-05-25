export type TTypeAvatar = 'marble' | 'beam' | 'pixel' | 'sunset' | 'bauhaus' | 'ring';

export interface IUserAvatar {
    type?: TTypeAvatar;
    size?: number;
    nameId?: string;
    square?: boolean;
    colors?: string[];
}

export function getAvatar(options: IUserAvatar = {}): string {
    try {
        if (process) return '';
    } catch (_) {
        
    }

    const
        color = localStorage['color'],
        defaultValues: IUserAvatar = {
            type: 'beam',
            size: 512,
            nameId: 'guast',
            square: true,
            colors: ['0b0b0b', '171717', color ? JSON.parse(color)?.slice(1) : 'FFBF34'],
        };

    options = { ...defaultValues, ...options }
    
    let { type, size, nameId, square, colors } = options;

    return `https://source.boringavatars.com/${type}/${size}/${nameId}?colors=${colors?.join(',')}&square=${square}`;
}

export function copy(content: string) {
    try {
        const input = document.createElement('textarea');
        input.innerHTML = content;
        document.body.appendChild(input);
        input.select();
        const result = document.execCommand('copy');
        document.body.removeChild(input);
        return result;
    } catch (_) {
        return false;
    }
}

/*
! ------------------------------------------------------------------
* Color
*/

// ? #region Color

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

// #endregion


/*
! ------------------------------------------------------------------
* Time
*/

// ? #region Time

export interface IFormat {
    YYYY: string;
}

class Time {
    readonly monthsName: string[] = ['january', 'february', 'martha', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    readonly miniMonthsName: string[] = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

    constructor() {}

    uts(UT: number, one: string, two: string, five: string): string {
        if (`${UT}`.split('').reverse()[1] === '1') return `${UT}${five}`;
        if (`${UT}`.split('').reverse()[0] === '1') return `${UT}${one}`;
        if (+(`${UT}`.split('').reverse()[0]) >= 2 && +(`${UT}`.split('').reverse()[0]) <= 4) return `${UT}${two}`;
        
        return `${UT}${five}`;
    }

    private getString(input: number): string {
        return input < 10 ? `0${input}` : input.toString();
    }

    unix(unix: number | string = Date.now()) {
        let date = new Date(unix),
            year = date.getFullYear(),
            day = this.getString(date.getDate()),
            month = this.getString(date.getMonth()),
            hours = this.getString(date.getHours()),
            minutes = this.getString(date.getMinutes()),
            seconds = this.getString(date.getSeconds());
    
        return {
            year,
            day,
            month,
            month_name: this.monthsName[Number(month)],
            hours,
            minutes,
            seconds
        }
    }

    format(time: number | string = Date.now(), format: string = 'dd MMM YYYY'): string {
        let { year, day, month, hours, minutes, seconds } = this.unix(time),
            miniMonth = this.miniMonthsName[Number(month)],
            fullMonth = this.monthsName[Number(month)],
            types = {
            // * Year
            YYYY: year,
            YY: year.toString().slice(2),
            // * Month
            MMMM: fullMonth[0].toLocaleUpperCase() + fullMonth.slice(1),
            MMM: miniMonth[0].toLocaleUpperCase() + miniMonth.slice(1),
            // * Day
            dd: day,
            d: Number(day),
            // * Hour
            hh: hours,
            h: Number(hours),
            // * Minute
            mm: minutes,
            m: Number(minutes),
            // * Second
            ss: seconds,
            s: Number(seconds),
        };
    
        // @ts-ignore
        return format.replace(new RegExp(`${Object.keys(types).join('|')}`, 'g'), (s: string) => types[s]);
    }

    timeago(time: number = Date.now()) {
        let msPerMinute = 60 * 1000,
            msPerHour = msPerMinute * 60,
            msPerDay = msPerHour * 24,
            elapsed = Date.now() - (new Date(time) as any);
        
        if (elapsed / 1000 < 3) return 'just now';
        
        if (elapsed < msPerMinute) return `${this.uts(Math.round(elapsed / 1000), ' second', ' seconds', ' seconds')} ago`;
        else if (elapsed < msPerHour) return `${this.uts(Math.round(elapsed / msPerMinute), ' minute', ' minutes', ' minutes')} ago`;
        else if (elapsed < msPerDay) return `${this.uts(Math.round(elapsed / msPerHour), ' hour', ' hours', ' hours')} ago`;
        else {
            let { day, month_name, year } = this.unix(time);
            return `${day} ${month_name} ${year}`;
        }
    }
}

export const time = new Time();

// #endregion


/*
! ------------------------------------------------------------------
* Cookies
*/

// ? #region Cookies

export interface ICookieOptions {
    secure?: boolean;
    'max-age'?: number;
    expires?: Date | string;
    path?: string;
    days?: number;
}

class Cookies {
    constructor() {}

    set(name: string, value: string, options: ICookieOptions = {}) {
        options = { path: '/', ...options };
      
        if (options.expires instanceof Date) {
            options['expires'] = options.expires.toUTCString();
        }
    
        if (options.days) {
            const date = new Date();
    
            date.setTime(date.getTime() + (options.days * 24 * 60 * 60 * 1000));
            options['expires'] = date.toUTCString();
        }
      
        let updatedCookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
      
        for (let optionKey in options) {
            updatedCookie += "; " + optionKey;
    
            // @ts-ignore
            const optionValue = options[optionKey];
    
            if (optionValue !== true) {
                updatedCookie += "=" + optionValue;
            }
        }
      
        document.cookie = updatedCookie;
    }

    get(name: string) {
        const matches = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'));
    
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    delete(names: Array<string>) {
        for (const name of names) {
            this.set(name, '', { 'max-age': -1 });
        }
    }
}

export const cookies = new Cookies();

//#endregion


/*
! ------------------------------------------------------------------
* Device
*/

// ? #region Device

export interface INameIcon {
    name: string,
    icon: string
}

export interface INameIconRegex extends INameIcon {
    regex: RegExp;
}

class Device {
    private userAgent: string = '';

    private readonly listOS: Array<INameIconRegex> = [
        { name: 'Android', icon: 'android', regex: /Android/i },
        { name: 'iPhone', icon: 'appleinc', regex: /iPhone/i },
        { name: 'iPad', icon: '', regex: /iPad/i },
        { name: 'iPod', icon: '', regex: /iPod/i },
        { name: 'Symbian', icon: '', regex: /Symbian/i },
        { name: 'Windows Phone', icon: 'windows8', regex: /Windows Phone/i },
        { name: 'Tablet OS', icon: '', regex: /Tablet OS/i },
        { name: 'Linux', icon: 'linux', regex: /Linux/i },
        { name: 'Windows', icon: 'windows', regex: /Windows NTi/ },
        { name: 'Macintosh', icon: '', regex: /Macintosh/i },
        { name: 'cURL', icon: '', regex: /curl/i },
        { name: 'Postman', icon: '', regex: /Postman/i },
        { name: 'WebOS', icon: '', regex: /webOS/i }
    ];

    private readonly listBrowsers: Array<INameIconRegex> = [
        { name: 'Chrome', icon: '', regex: /Chrome/i },
        { name: 'Internet Explorer', icon: '', regex: /MSIE/i },
        { name: 'Firefox', icon: 'firefox', regex: /Firefox/i },
        { name: 'Safari', icon: 'safari', regex: /Safari/i },
        { name: 'Opera', icon: 'opera', regex: /OP/i },
    ];

    public os: INameIcon = { name: '', icon: '' };
    public browser: INameIcon = { name: '', icon: '' };

    constructor() {}

    setUserAgent(userAgent: string) {
        this.userAgent = userAgent;

        this.setOS();
        this.setBrowser();

        return this;
    }

    private setOS() {
        const os = this.listOS.find(os => os.regex.test(this.userAgent));

        this.os = {
            name: os?.name || '',
            icon: os?.icon || ''
        }
    }

    private setBrowser() {
        const browser = this.listBrowsers.find(os => os.regex.test(this.userAgent));

        this.browser = {
            name: browser?.name || '',
            icon: browser?.icon || ''
        }
    }
}

export const device = new Device();

// #endregion