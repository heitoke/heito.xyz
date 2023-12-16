export default defineNuxtRouteMiddleware(async (to, from) => {
    if (process.server) return;

    const { $api } = useNuxtApp();

    const $user = useUserStore();

    const
        accessToken = cookies.get('HX_AT'),
        refreshToken = cookies.get('HX_RT');

    async function authGuast() {
        const { result, status } = await $api.auth.guast();

        if (status !== 200) return;

        const { user, tokens: { access, refresh } } = result;

        cookies.set('HX_AT', access!, { days: 7 });
        cookies.set('HX_RT', refresh!, { days: 365 });
        $api.api.setAccessToken(access!);
        $api.api.setRefreshToken(refresh!);

        $user.set(user);
    }

    if (!accessToken && !refreshToken) return await authGuast();

    if ($user.isAuth) return;

    async function regenerateAccessToken() {
        const { result, status } = await $api.auth.refresh(refreshToken!);

        if (status !== 200) return false;

        await cookies.set('HX_AT', result.access, { days: 7 });
        await $api.api.setAccessToken(result.access);
    
        return true;
    }

    async function authUser() {
        const { result, status } = await $api.users.me();

        if (status !== 200) {
            if (!refreshToken) return;

            const r = await regenerateAccessToken();

            if (!r) return await authGuast();

            return await authUser();
        }

        $user.set(result);
    }

    if (accessToken) {
        await authUser();
    } else if (refreshToken && !accessToken) {
        const result = await regenerateAccessToken();

        if (!result) return await authGuast();

        await authUser();
    }
});