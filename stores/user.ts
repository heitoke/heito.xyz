import { defineStore, acceptHMRUpdate } from 'pinia';

import { EPermissions, IUser } from 'types/api/user';

export const useUserStore = defineStore('user', {
    state: () => ({
        user: {} as IUser
    }),
    actions: {
        set(user: IUser) {
            this.user = user;
        },
        getPer(permission: EPermissions) {
            return this.user?.permissions?.includes(permission) || false;
        }
    },
    getters: {
        getUser(state): IUser {
            return state.user;
        }
    }
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}