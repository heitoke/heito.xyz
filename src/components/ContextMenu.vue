<template>
    <div class="context-menus">
        <TransitionGroup name="context-menu" @enter="showContextMenu">
            <div v-for="contextMenu of (getListContextMenus as IContextMenu[])" :key="contextMenu.name" :name="contextMenu.name"
                :class="['context-menu blur', contextMenu.position]"
                :style="{
                    top: `${contextMenu.y}px`,
                    left: `${contextMenu.x}px`,
                    'max-width': contextMenu.autoMaxWidth ? 'auto' : '196px'
                }"
            >
                <ScrollBar>
                    <Menu :menu="contextMenu" v-if="contextMenu?.buttons?.length! > 0"/>
    
                    <div v-if="contextMenu?.components?.length! > 0">
                        <component v-for="component of contextMenu?.components" :is="component.component"
                            v-bind="component.props"
                            v-on="Object.keys(component?.events || {}).length > 0 ? component?.events : null"
                        />
                    </div>
                </ScrollBar>
            </div>
        </TransitionGroup>
    </div>
</template>

<script setup lang="ts">

import Menu from './content/Menu.vue';

import ScrollBar from './content/ScrollBar.vue';

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
        getPosition(position: Array<TPosition>, elPos: DOMRect, el: DOMRect, e: MouseEvent): number[] {
            let has = (val: TPosition): boolean => position.includes(val),
                isFix = has('fixed-target'),
                x = isFix ? elPos.x : e.x,
                y = isFix ? elPos.y : e.y;

            if (!el) return [-1, -1];
            
            if (has('center')) {
                x -= isFix ? (el.width - elPos.width) / 2 : (el.height / 2);
                y -= isFix ? (el.height - elPos.height) / 2 : (el.height / 2);
            }
            

            if (has('top')) y = elPos?.y - (el?.height * 2) - 24;
            if (has('bottom')) y = elPos?.y + elPos?.height + 8;
            
            if (has('left')) x -= (el.width + 4);
            if (has('right')) x += (el.width + 4);


            return [x, y];
        },
        async showContextMenu(e: Element) {
            let contextMenu: IContextMenu = await this.getListContextMenus?.find((c: IContextMenu) => c.name === e.getAttribute('name'));

            if (!contextMenu) return;

            // @ts-ignore
            let elPos: DOMRect = contextMenu.event?.target?.getBoundingClientRect() || contextMenu.event?.getBoundingClientRect(),
                el: DOMRect = e.getBoundingClientRect();

            let [x, y]: number[] = await this.getPosition(contextMenu.position || [], elPos, el, contextMenu.event as MouseEvent);

            contextMenu.x = x;
            contextMenu.y = y;
            
            if ((e.scrollHeight + 32) > window.innerHeight) {
                const
                    scrollBar = e.querySelector('.scrollbar [scrollbar-block]'),
                    maxHeight = window.innerHeight - contextMenu.y - 32;

                if (scrollBar) scrollBar.setAttribute('style', `max-height: ${maxHeight}px; height: ${maxHeight}px;`);
            }
            

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
        // max-width: 196px;
        min-width: 196px;
        position: absolute;
        border-radius: 5px;
        border: 1px solid var(--background-secondary);
        transition: .2s;
        overflow: hidden;
        z-index: 109;

        &-enter-active,
        &-leave-active {
            // transform: scale(.8);
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