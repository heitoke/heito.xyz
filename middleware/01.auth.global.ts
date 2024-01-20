export default defineNuxtRouteMiddleware(async (to, from) => {
    if (process.server) return;

    const $user = useUserStore();

    const
        accessToken = cookies.get('HX_AT'),
        refreshToken = cookies.get('HX_RT');

    if (!accessToken && !refreshToken) return await $user.authGuast();

    if ($user.isAuth) return;

    if (accessToken) {
        await $user.fetchMe();
    } else if (refreshToken && !accessToken) {
        const result = await $user.regenerateAccessToken();

        if (!result) return await $user.authGuast();

        await $user.fetchMe();
    }
});