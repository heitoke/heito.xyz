<template>
    <transition-group>
        <div class="main-menu" v-for="(menu, idx) of getMenu" :key="(menu, idx)" :name="menu.name">
            <div class="bg" @click="closeMenu(idx)"></div>
            <component class="block" @close="closeMenu(idx)" :data="menu.data" :pos="idx" :is="menu.name"></component>
        </div>
    </transition-group>
</template>

<script>

export default {
    name: 'MainMenu',
    components: {},
    computed: { },
    data() {
        return {}
    },
    methods: {},
    mounted() {
    }
}
</script>

<style lang="scss">

.main-menu .block {
    .title {
        margin: 0 0 12px 0;
        font-size: 14px;
        font-weight: 600;
        text-align: center;
        text-transform: uppercase;
    }

    .subtitle {
        margin: 0 0 4px 8px;
        color: var(--color-2);
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
    }
}

.page, .main-menu {
    .nav-bar {
        display: flex;
        margin: 4px 8px 0 8px;
        // flex-wrap: wrap;
        user-select: none;
        overflow: hidden;

        li {
            cursor: pointer;
            padding: 8px 14px;
            color: var(--color-2);
            font-size: 14px;
            border-bottom: 1px solid var(--T);

            &:hover {
                border-bottom: 1px solid var(--main-color-alt);
            }

            &.active {
                color: var(--color);
                border-bottom: 1px solid var(--main-color);
            }
        }
    }
}
</style>

<style lang="scss" scoped>

.main-menu {
    display: flex;
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    align-items: center;
    justify-content: center;
    animation: ShowMainMenu .2s linear;
    transition: .2s;
    z-index: 10000000;

    .bg {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: #00000075;
        z-index: 1;
    }

    .block {
        max-width: 90% !important;
        max-height: 90% !important;
        position: relative;
        border-radius: 5px;
        background: var(--bg-2);
        animation: ShowMainMenuBlock .2s linear;
        z-index: 2;
    }
}

@keyframes ShowMainMenu {
    from { opacity: 0; }
    to { opacity: 1; }
}
@keyframes ShowMainMenuBlock {
    from { transform: scale(.5); }
    to { transform: scale(1); }
}

</style>