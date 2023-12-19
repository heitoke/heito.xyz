export default defineNuxtRouteMiddleware(async (to, from) => {
    if (process.server) return;

    const { $api } = useNuxtApp();

    const $user = useUserStore();

    const
        accessToken = cookies.get('HX_AT'),
        refreshToken = cookies.get('HX_RT');

    async function authGuast() {
        const { data, status } = await $api.auth.guast();

        if (status.value !== 'success') return;

        const { user, tokens: { access, refresh } } = data;

        cookies.set('HX_AT', access!, { days: 7 });
        cookies.set('HX_RT', refresh!, { days: 365 });
        $api.api.setAccessToken(access!);
        $api.api.setRefreshToken(refresh!);

        $user.set(user);
    }

    if (!accessToken && !refreshToken) return await authGuast();

    if ($user.isAuth) return;

    async function regenerateAccessToken() {
        const { data, status } = await $api.auth.refresh(refreshToken!);

        if (status.value !== 'success') return false;

        await cookies.set('HX_AT', data.access, { days: 7 });
        await $api.api.setAccessToken(data.access);
    
        return true;
    }

    async function authUser() {
        const { data, status } = await $api.users.me();

        if (status.value !== 'success') {
            if (!refreshToken) return;

            const r = await regenerateAccessToken();

            if (!r) return await authGuast();

            return await authUser();
        }

        $user.set(data);
    }

    if (accessToken) {
        await authUser();
    } else if (refreshToken && !accessToken) {
        const result = await regenerateAccessToken();

        if (!result) return await authGuast();

        await authUser();
    }
});