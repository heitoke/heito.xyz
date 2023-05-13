import $api from '../';

export interface ISession {
    _id: string;
    user: string;
    token: string;
    updatedAt?: Date;
    createdAt?: Date;
}

export default {
}