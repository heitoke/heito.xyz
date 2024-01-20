export default defineNuxtRouteMiddleware(async (to, from) => {
    if (process.server) return;

    const $config = useConfigStore();

    if ($config.config?._id) return;

    await $config.fetchDefaultConfig();
});