import { defineStore, acceptHMRUpdate } from 'pinia';

import type { User } from '~/types/api/user';

export const useUserStore = defineStore('user', () => {
    const _user = ref<User>();

    const user = computed(() => _user.value);

    const isAuth = computed(() => Boolean(user?.value?._id));

    return {
        // * Getters
        user,
        isAuth,

        // * Actions
        set(user: User) {
            _user.value = user;
        }
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}