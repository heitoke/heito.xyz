export interface CookieOptions {
    secure?: boolean;
    'max-age'?: number;
    expires?: Date | string;
    path?: string;
    days?: number;
}

class Cookies {
    constructor() {}

    list() {
        const cookies = document.cookie.split('; ');

        const result: { [key: string]: string; } = {};

        for (const cookie of cookies) {
            const [key, value] = cookie.split('=').map(cookie => cookie.trim());

            result[key] = value;
        }

        return result;
    }

    searchByName(name: string) {
        const cookies = this.list();

        const regex = new RegExp(name);
        
        return Object.keys(cookies).filter(key => regex.test(key));
    }

    set(name: string, value: string, options: CookieOptions = {}) {
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
        if (!process.client) return undefined;
        
        const matches = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'));
    
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    delete(...names: Array<string>) {
        for (const name of names) {
            this.set(name, '', { 'max-age': -1 });
        }
    }
}

export const cookies = new Cookies();