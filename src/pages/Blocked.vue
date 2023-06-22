<template>
    <div class="blocked">
        <Text class="a i title" :text="text"/>

        <div class="m">{{ text }}</div>

        <Text class="text" text="This page is currently blocked"/>

        <div class="emoji">{{ symbol }}</div>

        <div class="a s1">{{ emoji }}</div>
    </div>
</template>

<script lang="ts">

import { PropType, defineComponent } from 'vue';

import { mapActions } from 'vuex';

import type { IScrollBar } from '../components/content/ScrollBar.vue';

export default defineComponent({
    name: 'Blocked',
    components: {},
    computed: {},
    props: {
        scrollProps: {
            type: Object as PropType<IScrollBar>
        }
    },
    data: () => ({
        text: 'Bl0ck#d',
        symbol: '.',
        emoji: '',
        listEmoji: ['😎', '🤩', '🥰', '🤯', '💩', '🤑', '🤕', '🤡', '🤮']
    }),
    watch: {
        'scrollProps.scroll.top'(newValue) {
            this.setHeaderOptions({
                blur: {
                    enable: newValue >= 250,
                    value: '5px'
                }
            });
        }
    },
    methods: {
        ...mapActions(['setHeaderOptions']),
        parallax(e: MouseEvent, target: HTMLElement, layer: number) {
            const { clientWidth, clientHeight } = this.$el as Element;

            let strength = 20,
                layer_coeff = strength / layer,
                x = (clientWidth - target.offsetWidth) / 2 - (e.pageX - (clientWidth / 2)) / layer_coeff,
                y = (clientHeight - target.offsetHeight) / 2 - (e.pageY - (clientHeight / 2)) / layer_coeff;

            target.style.top = y + 'px';
            target.style.left = x + 'px';

            return [x, y];
        }
    },
    mounted() {
        const title: HTMLElement = this.$el.querySelector('.title');

        let n = 0;

        setInterval(() => {
            if (n === 3) {
                this.symbol = '.i.';
                n++;
            }
            else if (n > 3) n = 0;
            else this.symbol = '.'.repeat(++n);
        }, 500);

        (this.$el as HTMLElement).addEventListener('mousemove', e => {
            this.parallax(e, title, 1);
        });

        this.$el.addEventListener('mouseleave', () => {
            const { clientWidth, clientHeight } = this.$el as Element;

            this.parallax({ pageX: clientWidth / 2, pageY: clientHeight / 2 } as any, title, 1);
        });

        this.emoji = this.listEmoji[Math.floor(Math.random() * this.listEmoji.length)];

        this.setHeaderOptions({ blur: { enable: false } });
    }
});

</script>


<style lang="scss" scoped>

.page.blocked:hover .title {
    transition: 0s !important;
}

.page.blocked {
    display: flex;
    padding: 0 !important;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .a {
        position: absolute;
    }

    .i {
        background-size: cover;
        background-position: center;
        -webkit-text-fill-color: transparent;
        -webkit-background-clip: text;
        user-select: none;
    }

    .title {
        font-weight: 900;
        font-size: calc(var(--font) + 6vmax);
        background-image: url('https://i.pinimg.com/originals/be/46/d8/be46d826032489ebc5effe4f11120c74.gif');
        transition: .5s;
    }

    .m {
        color: var(--T);
        font-weight: 900;
        font-size: calc(var(--font) + 6vmax);
        user-select: none;
    }

    .text {
        color: var(--text-secondary);
        font-weight: 600;
        font-size: 16px;
        background-size: cover;
    }

    .s1 {
        top: 0;
        left: 50%;
        transform: translateX(-50%) rotate(180deg) scale(40);
        animation: S .5s ease-in-out;
        z-index: -1;
    }

    @keyframes S {
        from {
            transform: rotate(0deg) scale(1);
        }
        to {
            transform: rotate(180deg) scale(40);
        }
    }
}

</style>