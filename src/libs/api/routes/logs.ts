import $api, { DocumentationAPI } from '../';

import { IUser } from './users';

const docs = new DocumentationAPI('logs', {
    path: '/logs',
    label: 'Logs',
    icon: 'book',
    version: 'disabled'
});

export interface ILog {
    _id: string;
    user: IUser;
    code: number;
    props: {
        [key: string]: any;
    };
    updatedAt: Date;
    createdAt: Date;
}


class Route {
    constructor() {}
}

export default new Route();