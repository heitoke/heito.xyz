import { App, Plugin, reactive } from "vue";

// interface ILog {
//     (...args: any): void;
//     args: any;
//     error: (...args: any) => void;
// }

interface ILog {
    (...args: any): void;
    error: (...args: any) => void;
}

const plugin: Plugin = {
    install: (app: App) => {
        try {
            if (process) return;
        } catch (err) {
            
        }

        function log(): ILog {
            let self = ((...args) => console.log(...args)) as ILog;

            self.error = (...args: any) => console.error(...args);

            return self;
        }

        app.config.globalProperties.$log = log();
    }
}

export default plugin;

declare module "@vue/runtime-core" {
    interface ComponentCustomProperties {
        $log: ILog;
    }
}