import $api, { descriptors, categories } from '../';

import { IUser } from './users';

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

@descriptors.addCategory({ label: 'Logs', name: 'logs', icon: 'book', path: '/logs' })
class Route {
    constructor() {}
}

export default new Route();