<template>
    <div class="field-select">
        <div @click="open()">
            <icon :data="getItem?.icon" :style="`color: ${getItem?.color};`"/>
            <span>{{ select ? getItem?.label : text }}</span>
        </div>
        <transition enter-active-class="show" leave-active-class="hide">
            <ul v-if="list && opened">
                <li v-for="item of list" :key="item" @click="setItem(item)" :class="{ selected: item.value === select }">
                    <icon :data="item?.icon" :style="`color: ${item?.color};`"/>
                    <span>{{ item.label }}</span>
                </li>
            </ul>
        </transition>
    </div>
</template>

<script>

export default {
    name: 'FieldSelect',
    components: {},
    computed: {
        getItem() {
            return this.list ? this.list.find(item => item.value === this.select) : null;
        }
    },
    props: {
        items: { type: Array },
        value: { type: String },
        icon: { type: String, default: 'old' },
        text: { type: String, default: 'Selected' }
    },
    data() {
        return {
            select: null,
            opened: false,
            list: null
        }
    },
    methods: {
        open() {
            this.opened = !this.opened;
            if (this.opened) setTimeout(() => window.addEventListener('click', () => this.opened = false, { once: true }), 10);
        },
        setItem(item) {
            if (this.select === item.value) return;
            this.select = item.value;
            this.opened = false;
            this.$emit('onEvent', this.getItem)
        }
    },
    async mounted() {
        this.list = await this.items;
        this.select = this.value;
    }
}
</script>

<style lang="scss" scoped>

.show {
    transform: translateY(-16px) scale(.9);
    opacity: 0;
}

.hide {
    opacity: 0;
    transform: translateY(16px) scale(.9);
}

.field-select {
    min-width: 128px;
    position: relative;
    font-size: 14px;
    user-select: none;

    i, svg, img {
        margin: 0 4px 0 0;
        max-width: 16px;
        font-size: 16px;
    }

    div {
        cursor: pointer;
        display: flex;
        width: 100%;
        padding: 12px 24px;
        position: relative;
        border-radius: 5px;
        border: 1px solid var(--dimming);
        align-items: center !important;
        justify-content: flex-start !important;
        box-sizing: border-box;
        transition: .2s;
        overflow: hidden;

        &:active {
            transform: scale(.95);
        }

        span {
            text-overflow: ellipsis;
            overflow: hidden;
        }
    }

    ul {
        width: 100%;
        max-height: calc(34.75px * 5);
        position: absolute;
        top: calc(100% + 8px);
        left: 0px;
        border-radius: 5px;
        background: var(--bg-2);
        box-sizing: border-box;
        transition: .2s;
        overflow-x: hidden;
        z-index: 1000;

        li {
            display: flex;
            margin: 0 !important;
            padding: 8px 12px !important;
            position: relative;
            color: var(--color-2);
            align-items: center !important;
            justify-content: flex-start !important;
            transition: .2s;
            overflow: hidden;

            &:not(.selected):hover {
                cursor: pointer;
                color: var(--color);
                background: var(--dimming);
            }

            &.selected {
                opacity: .5;
            }

            span {
                text-overflow: ellipsis;
                overflow: hidden;
            }
        }
    }
}

</style>