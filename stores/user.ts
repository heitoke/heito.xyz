import { defineStore, acceptHMRUpdate } from 'pinia';

import { type User, type UserPermission, userPermissions } from '~/types/api/user';


export interface Account {
    user: User;
    access: string;
    refresh: string;
    addedAt: Date;
}


export const useUserStore = defineStore('user', () => {
    const
        _user = ref<User>(),
        _accounts = ref<Array<Account>>([]);


    const { $api } = useNuxtApp();


    // * Getters
    const user = computed(() => _user.value);

    const isAuth = computed(() => Boolean(user?.value?._id));

    const getAvatar = computed(() => {
        return getDefaultImage(user.value?._id || 'guast');
    });

    const getBanner = computed(() => {
        return null;
    });


    // * Functions
    function set(user: User) {
        _user.value = user;
    }

    function setTokens(accessToken?: string, refreshToken?: string) {
        if (accessToken) {
            cookies.set('HX_AT', accessToken, { days: 7 });
            $api.api.setAccessToken(accessToken);
        }

        if (refreshToken) {
            cookies.set('HX_RT', refreshToken, { days: 365 });
            $api.api.setRefreshToken(refreshToken);
        }
    }

    async function initAccounts() {
        if (!document?.cookie) return;

        const cookieAccounts = cookies.searchByName('HX__');

        if (!cookieAccounts.length) return;

        const list: Array<Omit<Account, 'user'> & { user: string }> = [];

        for (const key of cookieAccounts) {
            const [addedAt, userId, refresh, access] = [key.split('__').pop(), ...atob(cookies.get(key)!).split(':')];
        
            list.push({
                user: userId,
                refresh,
                access,
                addedAt: new Date(Number(addedAt))
            });
        }


    }

    function addAccount(user: User, tokens: { refresh: string, access: string }, isSet = false) {
        if (!document?.cookie) return;

        const { refresh, access } = tokens;
    
        if (isSet) setTokens(access, refresh);

        const addedAt = Date.now();

        _accounts.value.push({
            user,
            refresh,
            access,
            addedAt: new Date(addedAt)
        });

        const value = `${user._id}:${refresh}:${access}`;

        cookies.set(`HX__${addedAt}`, btoa(value), { days: 365 });

        if (isSet) set(user);
    }

    function switchAccount(userId: string, isSetTokens = false) {
        const account = _accounts.value.find(account => {
            return account.user._id === userId;
        });

        if (!account) return;

        _user.value = account.user;

        if (isSetTokens) setTokens(account.access, account.refresh);
    }

    async function authGuast() {
        const { ok, data } = await $api.auth.guast();

        if (!ok) return;

        const { user, tokens: { access, refresh } } = data;

        await setTokens(access, refresh);

        set(user);
    }

    async function regenerateAccessToken() {
        const { ok, data } = await $api.auth.refresh($api.api.token.refresh);

        if (!ok) return false;

        await setTokens(data.access);
    
        return true;
    }

    async function fetchMe() {
        const { ok, data } = await $api.users.me();

        if (!ok) {
            if (!$api.api.token.refresh) return;

            const refresh = await regenerateAccessToken();

            if (!refresh) return await authGuast();

            return await fetchMe();
        }

        set(data);
    }

    // * Permissions
    function has(permissions: Array<UserPermission>, options: { all?: boolean } = {}) {
        if (!user.value) return false;

        const { all = true } = options;

        for (const permission of permissions) {
            const index = userPermissions.indexOf(permission);

            if ((user.value?.permissions & (1 << index)) !== 1 << index) {
                if (all) return false;
                else continue;
            }
        }

        return true;
    }


    return {
        // * Getters
        user,
        isAuth,
        getAvatar,
        getBanner,

        // * Actions
        set,
        fetchMe,
        regenerateAccessToken,
        authGuast,
        initAccounts,
        addAccount,
        switchAccount,

        has
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}