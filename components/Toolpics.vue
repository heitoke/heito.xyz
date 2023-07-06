<template>
    <div class="toolpics">
        <TransitionGroup name="toolpic" @enter="showToolpic">
            <div v-for="toolpic of toolpics.getList" :key="toolpic.id" :id="`${toolpic.id}`"
                class="toolpic"
                :style="{ top: `${toolpic.y || 0}px`, left: `${toolpic.x || 0}px` }"
            >
                <div class="title" v-show="toolpic?.title">{{ toolpic?.title }}</div>
                <div class="text" v-show="toolpic?.text">{{ toolpic?.text }}</div>
            </div>
        </TransitionGroup>
    </div>
</template>

<script lang="ts" setup>

const toolpics = useToolpicsStore();

function getPosition(position: string | any, elPos: DOMRect, el: DOMRect): number[] {
    let has = (val: string): boolean => position.split(' ').includes(val),
        x = elPos.x,
        y = elPos.y;

    if (!el) return [-1, -1];
    
    if (has('top')) y = y - 6 - el.height;
    if (has('bottom')) y = y + 14 + (el.height / 2);
    if (has('top') || has('bottom')) x = x - (el.width / 2) + (elPos.width / 2);

    if (has('left')) x = x - 8 - el.width;
    if (has('right')) x = x + 8 + elPos.width;
    if (has('left') || has('right')) y = y - (el.height / 2) + (elPos.height / 2);

    return [x, y];
}

async function showToolpic(el: Element, done: Function) {
    const toolpic = await toolpics.getList?.filter(toolpic => toolpic.id === Number(el.id))[0];

    if (!toolpic) return;

    const
        target = (toolpic.event!.target as HTMLElement),
        targetPosition: DOMRect = target.getBoundingClientRect(),
        elementPosition: DOMRect = el.getBoundingClientRect();

    const [x, y]: number[] = await getPosition(toolpic.position, targetPosition, elementPosition);

    toolpic.x = x;
    toolpic.y = y;

    function closeToolpic() {
        toolpics.close(toolpic.id!);
    }

    target.addEventListener('pointerleave', closeToolpic, { once: true });
    target.addEventListener('mouseleave', closeToolpic, { once: true });
    target.addEventListener('pointerdown', closeToolpic, { once: true });
    target.addEventListener('click', closeToolpic, { once: true });

    done();
}

</script>

<style lang="scss" scoped>

.toolpics {
    .toolpic {
        padding: 4px 8px;
        position: absolute;
        border-radius: 5px;
        background-color: var(--background-secondary);
        transition: opacity .2s;
        z-index: 110;

        &-enter-active,
        &-leave-active {
            opacity: 0;
        }

        .text {
            color: var(--text-secondary);
            font-size: 12px;
        }
    }
}

</style>