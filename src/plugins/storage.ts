import { App, Plugin, reactive } from "vue";

type TType = object | string | number | boolean | undefined;

interface IParams {
    lang?: string;
    color?: string;
    theme?: string;
    broadcastMain?: number;
    effect?: 'blur' | 'transparent';
    blur?: number;
    transparent?: number;
    super: 'horizontal' | 'vertical';
    [key: string]: TType;
}

interface IStorage {
    get(key: string): TType;
    set(key: string, value: TType): void;
    remove(key: string): void;
    params?: IParams;
}

type TStorage = { [key: string]: any };

let local = {},
    session = {};

const plugin: Plugin = {
    install: (app: App) => {
        try {
            if (process) return;
        } catch (err) {
            
        }

        let getStorage = (storage: TStorage) => {
            let obj: TStorage = {}

            for (let key in storage) {
                try {
                    obj[key] = JSON.parse(storage[key]);
                } catch (err) {
                    obj[key] = storage[key];
                }
            }

            return obj;
        }

        local = reactive(getStorage(localStorage));
        session = reactive(getStorage(sessionStorage));

        let getKey = (key: string) => {
            try {
                return JSON.parse(localStorage.getItem(key) as any);
            } catch (err) {
                return localStorage.getItem(key);
            }
        }

        let getListStorageParams = (storage: object): IParams => {
            let params: any = {}

            for (let key in storage) {
                params[key] = getKey(key);
            }

            return reactive(params);
        }

        let setStorage = (storage: TStorage): IStorage => {
            let params: any = getListStorageParams(storage);

            return {
                get(key: string) {
                    if (!storage[key]) return undefined;
    
                    return getKey(key);
                },
                set(key: string, value: TType) {
                    try {
                        localStorage.setItem(key, JSON.stringify(value));
                        params[key] = value;
                    } catch (err) {
                        
                    }
                },
                remove(key: string) {
                    if (!storage[key]) return;
    
                    localStorage.removeItem(key);
                },
                params
            }
        };

        app.config.globalProperties.$local = setStorage(local);

        app.config.globalProperties.$session = setStorage(session);
    }
}

export default plugin;

declare module "@vue/runtime-core" {
    interface ComponentCustomProperties {
        $local: IStorage;
        $session: IStorage;
    }
}