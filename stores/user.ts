import { defineStore } from 'pinia';

import { IUser } from 'types/api/user';

export const useUserStore = defineStore('user', {
    state: () => ({
        user: {} as IUser
    }),
    actions: {
        set(user: IUser) {
            this.user = user;
        }
    },
    getters: {
        getUser(state): IUser {
            return state.user;
        }
    }
});