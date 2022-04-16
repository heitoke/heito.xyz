<template>
    <div class="service-activity">
        <div :class="`info ${data.type || ''}`" v-if="data.largeImage || data.largeImage || data.name || data.state || data.details">
            <div class="image" v-if="data.largeImage">
                <img v-if="data.largeImage" :src="data.largeImage.value">
                <img v-if="data.smallImage" :src="data.smallImage.value">
            </div>
            <div>
                <div class="name" v-if="data.name" v-html="data.name"></div>
                <div class="state" v-if="data.state" v-html="data.state"></div>
                <div class="details" v-if="data.details" v-html="data.details"></div>
            </div>
        </div>
        <div class="bar" v-if="data.bar">
            <div class="line"><div :style="{ width: `${data.bar?.value}%`, background: data.bar?.color || 'var(--C1)' }"></div></div>
            <div class="text">
                <span>{{ data.bar?.minText || data.bar.min }}</span>
                <span>{{ data.bar?.valueText }}</span>
                <span>{{ data.bar?.maxText || data.bar.max }}</span>
            </div>
        </div>
        <ul class="buttons" v-if="data.buttons && data.buttons.length > 0">
            <li v-for="(button, idx) of data.buttons.slice(0, 3)" :key="(button, idx)"
                @mouseenter="openContextMenu([$event, `toolpic:${idx}`, 'top center-x fixed hover'])"
                @mouseleave="closeContextMenu()"
                @click="redirect(button.url, true, true)"
            >
                <icon :data="button.icon"/>

                <ContextMenu :name="`toolpic:${idx}`" class="toolpic">
                    <p>{{ button.label }}</p>
                </ContextMenu>
            </li>
            <li v-if="data.buttons.length > 3"
                @mouseenter="openContextMenu([$event, `service:activity:buttons:${id}`, 'top center-x fixed'])"
            >
                <i class="uil uil-angle-up"></i>
            </li>
        </ul>
        <ContextMenu :name="`service:activity:buttons:${id}`">
            <ul>
                <li v-for="(button, idx) of data.buttons.slice(3)" :key="(button, idx)"
                    @click="redirect(button.url)"
                >
                    <icon :data="button.icon"/>
                    <span>{{ button.label }}</span>
                </li>
            </ul>
        </ContextMenu>
    </div>
</template>

<script>
export default {
    name: 'ServicesActivity',
    components: {},
    computed: {},
    props: {
        data: { type: Object }
    },
    data() {
        return {
            id: Math.random()
        }
    },
    methods: {},
    mounted() {}
}
</script>

<style lang="scss" scoped>

.service-activity {

    img {
        border-radius: 5px;
        object-fit: cover;
        object-position: 50% 50%;
    }

    .info, .buttons, .bar {
        padding: 8px;
        border-radius: 5px;
        background: var(--bg-2);
    }

    .info {
        display: flex;
        margin: 4px 0 0 0;
        align-items: center;

        &.mini {
            .image {
                margin: 0 8px 0 0;

                img:nth-child(1) {
                    width: 32px;
                    height: 32px;
                }
            }

            .image + div {
                div:nth-child(1) {
                    font-size: 12px;
                }
            }
        }

        .image {
            margin: 0 8px 0 0;
            width: 48px;
            position: relative;

            img:nth-child(1) {
                width: 48px;
                height: 48px;
            }

            img:nth-child(2) {
                width: 16px;
                height: 16px;
                position: absolute;
                right: -15px;
                bottom: -8px;
                border: 5px solid var(--bg-2);
                border-radius: 50%;
            }
        }

        div {
            color: var(--color-2);
            font-size: 14px;
            overflow: hidden;

            div {
                max-width: 100%;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }

            .name {
                color: var(--color);
                font-weight: 700;
            }

            .state, .details {
                font-size: 12px;
            }
        }
    }

    .bar {
        margin: 4px 0 0 0;
        .line {
            width: 100%;
            height: 4px;
            position: relative;
            border-radius: 5px;
            background: var(--dimming);
            overflow: hidden;

            div {
                height: 4px;
                position: absolute;
                top: 0;
                left: 0;
                transition: .2s;
            }
        }

        .text {
            display: flex;
            color: var(--color-2);
            font-size: 10px;
            align-items: center;
            justify-content: space-between;
        }
    }

    .buttons {
        display: flex;
        padding: 4px;
        margin: 4px 0 0 0;
        align-items: center;
        justify-content: center;

        li {
            cursor: pointer;
            padding: 4px;
            width: 100%;
            border-radius: 5px;
            transition: .2s;
            text-align: center;

            &:hover {
                background: var(--dimming);
            }
        }
    }
}

</style>