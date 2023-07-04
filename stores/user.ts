import { defineStore } from 'pinia';

import { IUser } from 'types/user';

export const useTestStore = defineStore('test', {
    state: () => ({
        user: {} as IUser
    }),
    actions: {
        setUser(user: IUser) {
            this.user = user;
        }
    },
    getters: {
        getUser(): IUser {
            return this.user;
        }
    }
});