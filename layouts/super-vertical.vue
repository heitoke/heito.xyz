<template>
    <div :class="['super vertical', { active: $super.isActive }]">
        <div ref="container">
            <slot :scroll="scroll"/>
        </div>

        <Transition name="menu">
            <div class="menu" v-if="$super.isActive">
                <div class="subtitle">Pages</div>

                <NavBar style="width: 100%;"
                    :orientation="'vertical'"
                    :reverse="true"
                    :value="$route.meta?.pageOptions?.name"

                    :items="routes.map(r => ({
                        label: r.title,
                        icon: r.icon,
                        value: r.name,
                        color: 'var(--main-color)'
                    }))"

                    @select="onSelectPage($event.value)"
                />

                <!-- <ul class="pages">
                    <li v-for="route of routes" :key="route.path"
                        :class="{}"

                        @click="$router.push(route.path)"
                    >
                        <span>{{ route.title }}</span>

                        <Icon :name="route.icon"/>
                    </li>
                </ul> -->
            </div>
        </Transition>
    </div>
</template>

<script lang="ts" setup>

import NavBar from '~/components/models/content/NavBar.vue';

import type { RoutePage } from '~/types/page';


const { $router } = useNuxtApp();


const $super = useSuperStore();


const container = ref<HTMLElement | null>(null);


const props = defineProps<{
    routes: Array<RoutePage>;
}>();


const scroll = ref({
    value: 0,
    max: 0
});


function onSelectPage(name: string) {
    const route = props.routes.find(r => r.name === name);
    
    if (!route) return;

    $router.push(route.path);
}


onMounted(() => {
    if (process.server) return;

    if (!container.value) return;

    container.value.addEventListener('scroll', event => {
        const target = event.target as HTMLElement;

        scroll.value = {
            value: target.scrollTop,
            max: target.scrollHeight - target.clientHeight
        }
    });
});

</script>

<style lang="scss" scoped>

@keyframes MenuWidth {
    from {
        margin: 0;
        max-width: 0px;
        min-width: 0px;
        opacity: 0;
    }
    to {
        max-width: 256px;
        min-width: 256px;
    }
}

.menu-enter-active {
    animation: MenuWidth .2s linear;
}
.menu-leave-active {
    animation: MenuWidth .2s linear reverse;
}

.layout.super.vertical {
    // max-height: calc(100dvh - 64px);
    // overflow-x: hidden;
    display: flex;
    position: relative;
    max-width: 100vw;
    min-width: 100vw;
    max-height: 100vh;
    min-height: 100vh;
    box-sizing: border-box;
    transition: all .2s;

    &.active {
        & > div:nth-child(1) {
            margin: 12px;
            padding: 12px;
            border-radius: 15px;
            box-shadow: 0 0 0 3px var(--background-secondary);
        }
    }

    & > div:nth-child(1) {
        width: 100%;
        box-sizing: border-box;
        transition: .2s;
        overflow-x: hidden;
    }

    :deep(.page) {
        padding-top: 12px !important;
        min-height: calc(100dvh - 64px);
    }

    .menu {
        display: flex;
        padding: 0 12px 12px 0;
        max-width: 256px;
        min-width: 256px;
        align-items: flex-end;
        flex-direction: column;
        box-sizing: border-box;
        transition: all .2s;

        .subtitle {
            margin: 8px 0;
            color: var(--text-secondary);
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            white-space: nowrap;
        }

        :deep(.nav-bar) {
            ul {
                li {
                    padding: 8px 16px;
                }
            }
        }
    }
}


@media (max-width: 640px) {
    .layout.super.vertical {
        :deep(.page) {
            padding: 12px 16px 0 16px !important;
        }
    }
}

</style>