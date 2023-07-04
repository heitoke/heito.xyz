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

export default defineNuxtPlugin({
    name: 'my-plugin',
    parallel: true,
    async setup(nuxtApp) {
        function getStorage(storage: TStorage) {
            const obj: TStorage = {}

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

        function getKey(key: string) {
            try {
                return JSON.parse(localStorage.getItem(key) as any);
            } catch (err) {
                return localStorage.getItem(key);
            }
        }

        function getListStorageParams(storage: object): IParams {
            const params: any = {}

            for (let key in storage) {
                params[key] = getKey(key);
            }

            return reactive(params);
        }

        function setStorage(storage: TStorage): IStorage {
            const params: any = getListStorageParams(storage);

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

        return {
            provide: {
                local: setStorage(local),
                session: setStorage(session)
            }
        }
    }
});

declare module '#app' {
    interface NuxtApp {
        $local: IStorage;
        $session: IStorage;
    }
}
  
declare module 'vue' {
    interface ComponentCustomProperties {
        $local: IStorage;
        $session: IStorage;
    }
}