<template>
    <Transition name="context-menu" @after-enter="showContextMenu($event as HTMLElement)">
        <div v-if="menu?.name" ref="root"
            :class="['context-menu blur', menu?.position, { show }]"
            :style="{
                top: `${position.y}px`,
                left: `${position.x}px`,
            }"
        >
            <Menu :items="menu.items"
                :events="{
                    click: {
                        button: () => {
                            $menu.close();
                        }
                    }
                }"
            />
        </div>
    </Transition>
</template>

<script lang="ts" setup>

import Menu from '../content/Menu.vue';


const $menu = useContextMenuStore();

const root = ref<HTMLElement | null>(null);

const show = ref<boolean>(false);
const position = ref<{ x: number, y: number }>({
    x: 0,
    y: 0
});


const menu = computed(() => $menu.menu);


watch(() => $menu.count, () => {
    if (!root.value) return;

    showContextMenu(root.value);
});


function getPosition(event: MouseEvent) {
    let x = 0,
        y = 0;

    if (!event) event = window.event as any;

    if (event.pageX || event.pageY) {
        x = event.pageX;
        y = event.pageY;
    } else if (event.clientX || event.clientY) {
        x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

    return { x, y }
}

function listenClick(menuElement: HTMLElement) {
    window.addEventListener('click', (event) => {
        const path = (event as any)?.path || (event.composedPath ? event.composedPath() : undefined);
        
        if (path && (path.includes(menuElement) || path.includes(menu.value?.event))) return listenClick(menuElement);

        $menu.close();

        show.value = false;
    }, {
        once: true,
        capture: true
    });

    window.addEventListener('scroll', () => {
        $menu.close();

        show.value = false;
    }, {
        capture: true,
        once: true
    });
}

function showContextMenu(menuElement: HTMLElement) {
    if (!menu.value) return;

    const { x, y } = getPosition(menu.value.event as MouseEvent);

    let width = menuElement.offsetWidth + 4,
        height = menuElement.offsetHeight + 4;

    let winWidth = window.innerWidth,
        winHeight = window.innerHeight;

    if ((winWidth - x) < width) {
        position.value.x = winWidth - width;
    } else {
        position.value.x = x;
    }

    if ((winHeight - y) < height) {
        position.value.y = winHeight - height;
    } else {
        position.value.y = y;
    }

    setTimeout(() => listenClick(menuElement), 10);

    setTimeout(() => show.value = true, 200);
}

</script>

<style lang="scss" scoped>

.context-menu {
    padding: 8px;
    max-width: 196px;
    min-width: 196px;
    position: absolute;
    border-radius: 5px;
    border: 1px solid var(--background-secondary);
    transition: .2s;
    box-sizing: border-box;
    overflow: hidden;
    z-index: 110;

    &:not(.show) {
        opacity: 0;
    }

    &-enter-active,
    &-leave-active {
        opacity: 0;
    }

    .menu {
        max-height: 50vh;
        overflow-x: hidden;
    }
}

</style>