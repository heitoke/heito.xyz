interface IWin {
    readonly size: {
        width: number;
        height: number;
    };

    init(): void;

    set(width: number, height: number): void;
}

type TStorage = { [key: string]: any };

let local = {},
    session = {};

export default defineNuxtPlugin({
    name: 'storage',
    parallel: true,
    async setup(nuxtApp) {
        const size = reactive({ width: 0, height: 0 });

        function set(width: number, height: number) {
            if (width >= 0) size.width = width;

            if (height >= 0) size.height = height;
        }

        function init() {
            const s = () => set(window.innerWidth, window.innerHeight);

            s();

            window.addEventListener('resize', s);
        }

        return {
            provide: {
                win: {
                    size,
                    init,
                    set
                }
            }
        }
    }
});

declare module '#app' {
    interface NuxtApp {
        $win: IWin;
    }
}
  
declare module 'vue' {
    interface ComponentCustomProperties {
        $win: IWin;
    }
}