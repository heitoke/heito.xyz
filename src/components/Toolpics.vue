<template>
    <div class="toolpics">
        <TransitionGroup name="toolpic" @enter="showToolpic">
            <div v-for="toolpic of (getListToolpics as IToolpic[])" :key="toolpic.id" :id="`${toolpic.id}`"
                class="toolpic"
                :style="{ top: `${toolpic.y || 0}px`, left: `${toolpic.x || 0}px` }"
            >
                <div class="title" v-show="toolpic?.title">{{ toolpic?.title }}</div>
                <div class="text" v-show="toolpic?.text">{{ toolpic?.text }}</div>
            </div>
        </TransitionGroup>
    </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';

import { mapActions, mapGetters } from 'vuex';

import type { IToolpic } from '../store/modules/toolpics';

export default defineComponent({
    name: 'MainToolpics',
    computed: {
        ...mapGetters(['getListToolpics'])
    },
    data() {
        return {
            positions: {}
        }
    },
    watch: {},
    methods: {
        ...mapActions(['closeToolpic']),
        getPosition(position: string | any, elPos: DOMRect, el: DOMRect): number[] {
            let  has = (val: string): boolean => position.split(' ').includes(val),
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
        },
        async showToolpic(e: Element) {
            let toolpic: IToolpic = await this.getListToolpics?.filter((toolpic: IToolpic) => toolpic.id === Number(e.id))[0];

            if (!toolpic) return;

            // @ts-ignore
            let elPos: DOMRect = toolpic.event.target?.getBoundingClientRect(),
                el: DOMRect = e.getBoundingClientRect();

            let [x, y]: number[] = await this.getPosition(toolpic.position, elPos, el);

            setTimeout(() => {
                for (let name of ['mouseleave', 'mouseout', 'mousedown', 'click']) {
                    toolpic?.event.target?.addEventListener(name, () => {
                        this.closeToolpic(toolpic.id);
                    });
                }

                toolpic.x = x;
                toolpic.y = y;
            }, 10);
        }
    },
    mounted() {}
})

</script>

<style lang="scss" scoped>

.toolpics {
    .toolpic {
        padding: 4px 8px;
        position: absolute;
        border-radius: 5px;
        background-color: var(--background-secondary);
        transition: .2s;
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