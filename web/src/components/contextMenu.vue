<template>
    <transition enter-active-class="context-menu-show" leave-active-class="context-menu-hide">
        <div :class="`context-menu ${getContextMenu.type}`" v-if="getContextMenu.isActive && getContextMenu.name === name"
            :style="{ top: `${getContextMenu.y}px`, left: `${getContextMenu.x}px` }"
        >
            <slot></slot>
        </div>
    </transition>
</template>

<script>

export default {
    name: 'ContextMenu',
    computed: {},
    props: {
        name: { type: String }
    },
    data() {
        return {}
    },
    methods: {},
    mounted() {}
}
</script>

<style lang="scss">

.context-menu {
    position: fixed;
    min-width: 196px;
    max-height: 50%;
    border-radius: 5px;
    border: 1px solid var(--bg-3);
    background: var(--bg-2);
    transform: scale(1);
    transition: .2s;
    overflow-x: hidden;
    outline: none;
    z-index: 999;

    &.right { transform-origin: top left; }
    &.left {
        transform-origin: top right;
    }
    &.right.center-y {
        transform-origin: center left;
    }
    &.left.center-y {
        transform-origin: center right;
    }

    &.context-menu-show {
        transform: scale(.5);
        opacity: 0;
    }
    &.context-menu-hide {
        transform: scale(.5);
        opacity: 0;
    }

    .line {
        margin: 4px auto;
        width: 100%;
        min-height: 1px;
        background: var(--bg-3);
    }

    ul {
        margin: 0 !important;
        padding: 4px !important;

        .image {
            width: 100%;
            height: 156px;
            background-size: cover;
            background-color: var(--dimming);
            background-position: 50% 50%;
        }

        li {
            cursor: pointer;
            display: flex !important;
            margin: 0 !important;
            padding: 8px 14px !important;
            position: relative;
            color: var(--color);
            font-size: 14px;
            align-items: center !important;
            justify-content: flex-start !important;
            transition: .2s;
            overflow: hidden;

            &:hover {
                &::after {
                    border-radius: 5px;
                    transform: translate(-50%, -50%) scale(10);
                }
            }

            &::after {
                content: " ";
                width: 32px;
                height: 32px;
                position: absolute;
                top: 50%;
                left: 50%;
                border-radius: 50%;
                background: var(--dimming);
                transform: translate(-50%, -50%) scale(0);
                transition: .4s;
                z-index: -1;
            }

            i {
                margin: 0 8px 0 0 !important;
                padding: 0 !important;
                width: 16px !important;
                font-size: 16px !important;
                transition: .2s;
            }

            span {
                max-width: 100%;
            }
        }
    }

    &.toolpic {
        padding: 4px 8px;
        min-width: auto !important;
        font-size: 14px;
        text-align: center;
        border: 1px solid var(--T);
        background: var(--bg-4);
    }
}

</style>