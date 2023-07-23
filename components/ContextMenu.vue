<template>
    <Transition name="context-menu" @after-enter="showContextMenu">
        <div v-if="contextMenu.getMenu?.name" ref="root"
            :class="['context-menu blur', contextMenu.getMenu?.position]"
            :style="{
                top: `${y}px`,
                left: `${x}px`,
                'max-width': contextMenu.getMenu?.autoMaxWidth ? 'auto' : '196px'
            }"
        >
            <ScrollBar max-height="80vh">
                <Menu v-if="contextMenu.getMenu?.buttons?.length! > 0"
                    :menu="contextMenu.getMenu"
                    @children="setPositionContextMenu($refs['root'] as Element, 300)"
                />

                <div class="components" v-if="contextMenu.getMenu?.components?.length! > 0">
                    <component v-for="component of contextMenu.getMenu?.components" :is="component.component"
                        :style="component?.style || ''"
                        v-bind="component.props"
                        v-on="Object.keys(component?.events || {}).length > 0 ? component?.events : null"
                    >
                        <div v-html="component?.slot || ''"></div>
                    </component>
                </div>
            </ScrollBar>
        </div>
    </Transition>
</template>

<script lang="ts" setup>

import ScrollBar from '~/components/content/ScrollBar.vue';
import Menu from '~/components/content/Menu.vue';

import type { TPosition } from '~/types/stores/contextMenu';

const { $win } = useNuxtApp();

const root = ref<HTMLElement | null>(null);

const contextMenu = useContextMenuStore();


const
    show = ref<boolean>(false),
    x = ref<number>(-1),
    y = ref<number>(-1);


watch(() => contextMenu.getMenu?.name, (newValue, oldValue) => {
    if (oldValue && newValue && root.value) {
        return showContextMenu(root.value);
    }
    
    if (root.value !== null && newValue) setPositionContextMenu(root.value, 10);
});

function getIsPositions() {
    const has = (val: TPosition): boolean => contextMenu.getMenu?.position!?.includes(val);

    return {
        fixed: has('fixed'),
        center: has('center'),
        corner: has('corner'),
        top: has('top'),
        right: has('right'),
        bottom: has('bottom'),
        left: has('left')
    }
}

function getPosition(targetElement: DOMRect, menuElement: DOMRect, event: MouseEvent): number[] {
    const { fixed, center, corner, top, right, bottom, left } = getIsPositions();

    const [xGap, yGap] = contextMenu.getMenu?.gap || [8, 8];

    const save = {
        x: fixed ? (targetElement.x + (targetElement.width / 2)) : event.x,
        y: fixed ? (targetElement.y + (targetElement.height / 2)) : event.y
    }

    let x = save.x,
        y = save.y;

    const
        targetWidth2 = (fixed ? (targetElement.width / 2) : 0) + xGap,
        targetHeight2 = (fixed ? (targetElement.height / 2) : 0) + yGap;


    if (left) {
        x -= menuElement.width + targetWidth2;
    } else if (right) {
        x += targetWidth2;
    }

    if (top) {
        y -= menuElement.height + targetHeight2;
    } else if (bottom) {
        y += targetHeight2;
    }

    if (center) {
        if (top || bottom) {
            x = save.x - (menuElement.width / 2);
        } else if (right || left) {
            y = save.y - (menuElement.height / 2);
        }
    }

    if (corner) {
        if (top) y = targetElement.top;

        if (bottom) y = (save.y + targetElement.height / 2) - menuElement.height;
    }

    if (x < xGap) x = xGap;
    if (y < yGap) y = yGap;

    if ((x + menuElement.width) > $win.size.width) {
        x = $win.size.width - menuElement.width - xGap;
    }
    if ((y + menuElement.height) > $win.size.height) {
        y = $win.size.height - menuElement.height - yGap;
    }

    return [x, y];
}

function getTargetContextMenu(): DOMRect {
    return ((contextMenu?.getMenu.event as MouseEvent)?.target as Element)?.getBoundingClientRect() || (contextMenu?.getMenu.event as Element)?.getBoundingClientRect();
}

async function setPositionContextMenu(menuElement: Element, timeout: number = 10) {
    show.value = false;

    await new Promise(r => setTimeout(() => r(true), timeout));

    const elMenu: DOMRect = menuElement?.getBoundingClientRect();

    const [_x, _y]: number[] = await getPosition(getTargetContextMenu(), elMenu, contextMenu.getMenu?.event as MouseEvent);

    x.value = _x;
    y.value = _y;

    setTimeout(() => {
        show.value = true;

        close(menuElement);
    }, 10);
}

async function close(menuElement: Element) {
    window.addEventListener('click', (event: Event) => {
        const path = (event as any)?.path || (event.composedPath ? event.composedPath() : undefined);

        if (path && (path.includes(menuElement) || path.includes(contextMenu.getMenu?.event))) return close(menuElement);

        show.value = false;
        
        contextMenu.close();
    }, { once: true });
}

async function showContextMenu(menuElement: Element) {
    if (!contextMenu.getMenu?.name) return;

    await setPositionContextMenu(menuElement);
    
    // if ((menuElement.scrollHeight + 32) > window.innerHeight) {
    //     const
    //         scrollBar = menuElement.querySelector('.scrollbar [scrollbar-body]'),
    //         maxHeight = window.innerHeight - y.value - 32;

    //     if (scrollBar) scrollBar.setAttribute('style', `max-height: ${maxHeight}px; height: ${maxHeight}px;`);
    // }
}

</script>

<style lang="scss" scoped>

.context-menu {
    // max-width: 196px;
    min-width: 196px;
    position: absolute;
    border-radius: 5px;
    border: 1px solid var(--background-secondary);
    transition: all .2s;
    overflow: hidden;
    z-index: 110;

    .menu,
    .components {
        padding: 8px;
    }

    &-enter-active,
    &-leave-active {
        opacity: 0;

        &.left {
            &.top { transform: translate(-12px, -12px); }

            &.center { transform: translateX(-12px); }

            &.bottom { transform: translate(-12px, 12px); }
        }
        
        &.right {
            &.top { transform: translate(12px, -12px); }

            &.center { transform: translateX(12px); }

            &.bottom { transform: translate(-12px, -12px); }
        }
    }
}

</style>