import $api, { DocumentationAPI } from '../';

import { IUser } from './users';

export interface ICode {
    text: string;
    color?: string;
    icon?: string;
}

export const userCodes = {
    100: { text: 'The period of stay on the site', icon: '', color: '' },
    101: { text: 'Account Registration', icon: '', color: '' },
    102: { text: 'Changes have been made to the profile', icon: '', color: '' },
    103: { text: 'Merge accounts into one', icon: '', color: '' },
    104: { text: 'Logged in to your account', icon: '', color: '' }
}

export const projectCodes = {
    200: { text: 'A new project has been created', icon: '', color: '' },
    201: { text: 'The project has been updated', icon: '', color: '' },
    202: { text: 'Invitation to the project', icon: '', color: '' },
    203: { text: 'Participants are excluded from the project', icon: '', color: '' },
    204: { text: 'The project has been deleted', icon: '', color: '' }
}

export const codes: { [key: number]: ICode } = {
    ...userCodes,
    ...projectCodes
}


export interface ILog {
    _id: string;
    user: IUser;
    code: number;
    props: {
        [key: string]: any;
    };
    type: 'log' | 'notification';
    updatedAt: Date;
    createdAt: Date;
}


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