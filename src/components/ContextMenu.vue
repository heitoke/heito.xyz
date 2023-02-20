<template>
    <div class="context-menus">
        <TransitionGroup name="context-menu" @enter="showContextMenu">
            <div v-for="contextMenu of (getListContextMenus as IContextMenu[])" :key="contextMenu.name" :name="contextMenu.name"
                :class="['context-menu', contextMenu.position]"
                :style="{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }"
            >
                <Menu :menu="contextMenu"/>
            </div>
        </TransitionGroup>
    </div>
</template>

<script setup lang="ts">

import Menu from './content/Menu.vue';

</script>

<script lang="ts">

import { defineComponent } from 'vue';

import { mapActions, mapGetters } from 'vuex';

import type { IContextMenu, IContextMenuButton, TPosition } from '../store/modules/contextMenu';

export default defineComponent({
    name: 'ContextMenus',
    computed: {
        ...mapGetters(['getListContextMenus'])
    },
    data: () => ({}),
    watch: {},
    methods: {
        ...mapActions(['closeContextMenu']),
        getPosition(position: string | any, elPos: DOMRect, el: DOMRect, e: MouseEvent): number[] {
            let has = (val: string): boolean => position.split(' ').includes(val),
                x = e.x,
                y = e.y;

            if (!el) return [-1, -1];
            
            if (has('top')) y -= el.height - 4;
            

            if (has('left')) x -= (el.width + 42);
            if (has('right')) x += 4;

            if (has('center')) y -= (el.height / 2);

            return [x, y];
        },
        async showContextMenu(e: Element) {
            let contextMenu: IContextMenu = await this.getListContextMenus?.find((c: IContextMenu) => c.name === e.getAttribute('name'));

            if (!contextMenu) return;

            // @ts-ignore
            let elPos: DOMRect = contextMenu.event.target?.getBoundingClientRect(),
                el: DOMRect = e.getBoundingClientRect();

            let [x, y]: number[] = await this.getPosition(contextMenu.position, elPos, el, contextMenu.event as MouseEvent);

            contextMenu.x = x;
            contextMenu.y = y;

            let close = () => {
                setTimeout(() => {
                    window.addEventListener('click', (clickEvent: Event) => {
                        if (e.contains(clickEvent.target as Node)) return close();
                        
                        this.closeContextMenu(contextMenu.name);
                    }, { once: true });
                }, 10);
            }
            
            close();
        }
    },
    mounted() {}
})

</script>

<style lang="scss" scoped>

.context-menus {
    .context-menu {
        padding: 8px;
        max-width: 196px;
        min-width: 196px;
        position: absolute;
        border-radius: 5px;
        border: 1px solid var(--background-secondary);
        backdrop-filter: blur(5px);
        transition: .2s;
        z-index: 109;

        &-enter-active,
        &-leave-active {
            transform: scale(.8);
            opacity: 0;
        }

        &.left {
            &.top { transform-origin: bottom right; }

            &.center { transform-origin: center right; }

            &.bottom { transform-origin: top right; }
        }
        &.right {
            &.top { transform-origin: bottom left; }

            &.center { transform-origin: center left; }

            &.bottom { transform-origin: top left; }
        }
    }
}

</style>