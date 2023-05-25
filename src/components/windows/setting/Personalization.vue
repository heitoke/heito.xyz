<template>
    <section class="personalization">
        <div class="block">
            <header>
                <span>Main color</span>
            </header>
            <div>
                <div class="text">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Temporibus esse fugit nulla a, incidunt similique!</div>
            </div>
            <ul class="colors"
                @wheel.prevent.stop="setScroll"
            >
                <TransitionGroup name="width">
                    <li v-for="(color, idx) of getMyColors" :key="color"
                        :class="{ active: $local.params?.color === color }"
                        :style="{ 'background-color': color }"
                        @click="setColor(color)"
                        @mouseenter="setToolpic({ name: `color-${idx}`, title: color })"
                    ></li>
                    <div class="line"></div>
                    <li v-for="(color, idx) of randomColors" :key="color"
                        v-show="$local.params?.color !== color"
                        :style="{ 'background-color': color }"
                        @click="setColor(color)"
                        @mouseenter="setToolpic({ name: `color-${idx}`, title: color })"
                    ></li>
                </TransitionGroup>
            </ul>
            <!-- <Textbox style="margin: 12px 0 0 0;" label="Color (hex)"
                :match="/^#([0-9a-f]{3}){1,2}$/i"
                @update="$event ? setColor($event) : null"
            /> -->
            <ColorPicker style="margin: 12px 0 0 0;" text="Color (hex)"
                :value="$local.params?.color"
                @color="$event ? setColor($event) : null"
            />
        </div>
        <div :class="['hidden', { active: !hide }]">
            <header @click="hide = !hide">
                <div>User avatar</div>
                <Icon name="arrow-left"/>
            </header>
            <Transition name="height">
                <div class="block" v-if="!hide">
                    <header>
                        <span>Change accent color in avatars</span>
                        <span class="c">restart</span>
                    </header>
                    <div>
                        <div class="text">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Temporibus esse fugit nulla a, incidunt similique!</div>
                        <Checkbox :value="$local.params?.accentColorInUserAvatars"
                            @onEvent="$local.set('accentColorInUserAvatars', $event)"
                        />
                    </div>
                </div>
            </Transition>
        </div>
        <div class="block">
            <header>
                <span>Bluray</span>
            </header>
            <div>
                <div class="text">Do you want a blur on the site? If not, it will just be a black blackout instead of a blur.</div>
                
                <div>
                    <Select label="Effect" :value="$local.params?.effect" style="min-width: 128px;"
                        :menu="[
                            { label: 'Blur', icon: 'droplet', value: 'blur' },
                            { label: 'Transparent', icon: 'eye', value: 'transparent' }
                        ]"
                        @select="$local.set('effect', $event.value)"
                    />
                    <Range style="margin: 8px 0;"
                        :value="$local.params![$local.params?.effect as any]"
                        :step="$local.params?.effect === 'blur' ? 1 : 0.01"
                        :min="$local.params?.effect === 'blur' ? 1 : 0"
                        :max="$local.params?.effect === 'blur' ? 10 : 1"
                        @input="setBlur(($event.target as any)?.value, $local.params?.effect)"
                    />
                    <div :class="['effect-filter', $local.params?.effect]"
                        :style="{
                            '--image': `url('${effectFilter.image}')`,
                            '--blur': `${$local.params?.blur}px`,
                            '--transparent': colors.addAlpha('#010101', $local.params?.transparent as number)
                        }">
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>

import { colors } from '../../../libs/utils';

</script>

<script lang="ts">

import { defineComponent } from 'vue';

import { mapActions, mapGetters } from 'vuex';

export default defineComponent({
    name: 'SettingPersonalization',
    components: {},
    computed: {
        ...mapGetters(['getUser']),
        getMyColors() {
            let mainColor = '#FFBF34',
                color = this.$local.params?.color,
                userColor = this.getUser?.color;

            return [
                mainColor,
                ...(color === mainColor ? [] : [color]),
                ...(color === userColor ? [] : [userColor])
            ]
        }
    },
    props: {},
    data: () => ({
        randomColors: colors.randomHexList(30),
        hide: true,
        effectFilter: {
            image: '',
            images: [
                'https://oir.mobi/uploads/posts/2021-03/1616585889_54-p-krutoi-zadnii-fon-64.jpg',
                'https://as2.ftcdn.net/v2/jpg/01/03/26/73/1000_F_103267395_mt8z2f5eLu0Zgc5o1mcD4P9MBZLkfU8H.jpg',
                'https://gamerwall.pro/uploads/posts/2022-03/1646957965_3-gamerwall-pro-p-zadnii-fon-dlya-arta-krasivie-oboi-4.jpg'
            ]
        }
    }),
    watch: {},
    methods: {
        ...mapActions(['setToolpic']),
        setScroll(e: WheelEvent) {
            let el = (this.$el as Element).querySelector('ul.colors');
            
            el?.scroll({
                behavior: 'smooth',
                left: el.scrollLeft + e.deltaY
            });
        },
        setStyles(styles: { [key: string]: any; }) {
            let style = document.documentElement.style;

            for (let key in styles) {
                style.setProperty(key, styles[key]);
            }
        },
        setColor(color: string) {
            this.$local.set('color', color);

            this.setStyles({
                '--main-color': color,
                '--main-color-alt': colors.addAlpha(color, .35)
            });
        },
        setBlur(value: string | number, type: 'blur' | 'transparent' = 'blur') {
            this.$local.set('effect', type);
            this.$local.set(type, value);

            document.querySelector('html')?.classList[type === 'blur' ? 'remove' : 'add']('no-blur');

            this.setStyles({
                [type === 'blur' ? '--blur' : '--transparent']: type === 'blur' ? `${value}px` : colors.addAlpha('#010101', value as number)
            });
        }
    },
    mounted() {
        this.effectFilter.image = this.effectFilter.images[Math.floor(Math.random() * this.effectFilter.images.length)];
    }
});

</script>

<style lang="scss" scoped>

.width-enter-active,
.width-leave-active {
    margin: 0;
    transition: .2s;
    opacity: 0;
}

.height-enter-active,
.height-leave-active {
    transform: translateY(-12px) scale(.9);
    opacity: 0;
}

section.personalization {
    .block {
        transition: .2s;

        &:not(:first-of-type) {
            padding: 12px 0 0 0;
            margin: 12px 0 0 0;
            border-top: 1px solid var(--background-secondary-alt);
        }

        header {
            span {
                font-size: 16px;
                font-weight: 600;
            }

            .c {
                margin: 0 0 0 8px;
                padding: 4px 8px;
                color: var(--text-secondary);
                font-size: 10px;
                font-weight: normal;
                text-transform: uppercase;
                border-radius: 5px;
                background-color: var(--background-secondary-alt);
                user-select: none;
            }
        }

        header + div {
            display: flex;
            max-width: 512px;
            align-items: center;

            .text {
                margin: 0 12px 0 0;
                width: 100%;
                color: var(--text-secondary);
            }
        }
    }

    .hidden {
        margin: 0 0 12px 0;

        &.active {
            header {
                .hx-icon {
                    transform: rotate(-90deg);
                }
            }
        }

        header {
            cursor: pointer;
            display: flex;
            margin: 12px 0 0 0;
            position: relative;
            align-items: center;
            
            div {
                display: flex;
                width: 100%;
                max-width: 100%;
                align-items: center;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;

                &::after {
                    content: " ";
                    margin: 0 8px;
                    width: 100%;
                    border-bottom: 1px solid var(--background-secondary-alt);
                }
            }
        }
    }

    .colors {
        display: flex;
        padding: 12px 0 0 0;
        max-width: 512px;
        align-items: center;
        overflow-x: hidden;

        .line {
            margin: 0 8px 0 0;
            height: 24px;
            border-right: 1px solid var(--background-secondary-alt);
        }

        li {
            cursor: pointer;
            margin: 0 8px 0 0;
            min-width: 32px;
            height: 32px;
            border-radius: 5px;
            transition: .2s;

            &:last-child {
                margin: 0 !important;
            }

            &:active {
                transform: scale(.8);
            }

            &.active {
                transform: rotate(15deg) translateY(-8px);
            }
        }
    }

    .effect-filter {
        width: 100%;
        height: 32px;
        position: relative;
        border-radius: 5px;
        overflow: hidden;
        background-size: cover;
        background-position: center;
        background-image: var(--image);
        background-color: var(--background-secondary-alt);

        &::after {
            content: " ";
            width: 200%;
            height: 200%;
            position: absolute;
            top: -25%;
            left: -25%;
        }

        &.blur::after {
            backdrop-filter: blur(var(--blur));
            -webkit-backdrop-filter: blur(var(--blur));
        }

        &.transparent::after {
            background-color: var(--transparent);
        }
    }
}

</style>