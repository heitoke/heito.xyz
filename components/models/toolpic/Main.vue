<template>
    <Transition name="toolpic" @enter="onEnterToolpic($event as HTMLElement)">
        <div v-if="$toolpic.toolpic" ref="root"
            :class="['toolpic', toolpicPosition.type, ...toolpicPosition.flags]"

            :style="{ top: `${position.y}px`, left: `${position.x}px` }"
        >
            <div>{{ $toolpic?.toolpic?.text || '' }}</div>
        </div>
    </Transition>
</template>

<script lang="ts" setup>

import type { Position, PositionType } from '~/types/stores/toolpic';


const root = ref<HTMLElement | null>(null);

const $toolpic = useToolpicStore();


const show = ref<boolean>(false);
const position = ref<{ x: number, y: number }>({
    x: 0,
    y: 0
});


const toolpicPosition = computed(() => {
    if (!$toolpic.toolpic) return {
        type: 'center' as PositionType,
        flags: ['top'] as Array<Position>
    }

    const { position } = $toolpic.toolpic;
    
    const isArray = Array.isArray(position);

    return {
        type: (isArray ? false : position?.type) || 'center',
        flags: (isArray ? position : position?.flags) || ['top']
    }
});


watch(() => $toolpic.name, () => {
    if (!root.value) return;

    onEnterToolpic(root.value);
});


function getPosition(toolpicElement: HTMLElement, event: MouseEvent) {
    const { type, flags } = toolpicPosition.value;

    if (!event) event = window.event as any;
    
    const target = event.target as HTMLElement;

    const
        targetWidth2 = target.clientWidth / 2,
        targetHeight2 = target.clientHeight / 2,
        toolpicWidth2 = toolpicElement.clientWidth / 2,
        toolpicHeight2 = toolpicElement.clientHeight / 2;

    const rect = target.getBoundingClientRect();
    
    let x = 0,
        y = 0;

    if (type === 'center') {
        x = (rect.left + targetWidth2) - toolpicWidth2;
        y = (rect.top + targetHeight2) - toolpicHeight2;

        if (flags.includes('top') || flags.includes('bottom')) {
            const gap = targetHeight2 + toolpicHeight2 + 8;

            y = flags.includes('bottom') ? y + gap : y - gap;
        }

        if (flags.includes('right') || flags.includes('left')) {
            const gap = targetWidth2 + toolpicWidth2 + 8;

            x = flags.includes('right') ? x + gap : x - gap;
        }
    }

    return { x, y }
}

function listen(event: MouseEvent) {
    if (!event) return;

    const closeToolpic = () => $toolpic.close();

    event?.target?.addEventListener('pointerleave', closeToolpic, { once: true });
    event?.target?.addEventListener('mouseleave', closeToolpic, { once: true });
    event?.target?.addEventListener('pointerdown', closeToolpic, { once: true });
    window?.addEventListener('click', closeToolpic, { capture: true, once: true });
}

function onEnterToolpic(toolpicElement: HTMLElement) {
    if (!$toolpic.toolpic?.event) return;

    const { x, y } = getPosition(toolpicElement, $toolpic.toolpic?.event as MouseEvent);

    position.value = { x, y };



    setTimeout(() => listen($toolpic.toolpic?.event as MouseEvent), 1);
}

</script>

<style lang="scss" scoped>

.toolpic {
    padding: 4px 8px;
    max-width: 256px;
    position: fixed;
    border-radius: 5px;
    background-color: var(--background-secondary);
    transition: opacity .2s;
    z-index: 111;

    &-enter-active,
    &-leave-active {
        opacity: 0;
    }

    div:nth-child(1) {
        max-width: 100%;
        color: var(--text-secondary);
        font-size: 12px;
        font-weight: 600;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
}

</style>