import { App, Plugin, reactive, Component } from "vue";

import { EPageStatus, IPage, IConfigDefault } from '../libs/api/routes/configs';

interface IConfig extends IConfigDefault {
    set(config: IConfigDefault): void;
}

export class Config implements IConfig {
    private _fields: IConfigDefault = reactive({ _id: '', name: '', pages: [], status: EPageStatus.Beta });

    get _id() {
        return this._fields._id;
    }

    get name() {
        return this._fields.name;
    }

    get pages() {
        return this._fields.pages;
    }

    get status() {
        return this._fields.status;
    }

    set(config: IConfigDefault) {
        this._fields._id = config._id;
        this._fields.name = config.name;
        this._fields.pages = config.pages;
        this._fields.status = config.status;
    }
}

const plugin: Plugin = {
    install: (app: App) => {
        const config = new Config();

        app.config.globalProperties.$config = config;

        app.provide('config', { config });
    }
}

export default plugin;

declare module "@vue/runtime-core" {
    interface ComponentCustomProperties {
        $config: IConfig;
    }
}