<template>
    <div :class="['super vertical', { active: $super.isActive }]">
        <div>
            <slot/>
        </div>

        <Transition name="menu">
            <div class="menu" v-if="$super.isActive">
                Menu
            </div>
        </Transition>
    </div>
</template>

<script lang="ts" setup>

const $super = useSuperStore();

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

.fade-enter-active,
.fade-leave-active {
    transition: .2s;
    opacity: 0;
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

    .menu {
        display: flex;
        margin: 0 0 12px 12px;
        min-width: 256px;
        flex-direction: column;
        transition: all .2s;
    }
}

</style>