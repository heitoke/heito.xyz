<template>
    <li class="block-page projects">
        <div class="header">
            <div class="font-5" @click="$emit('openSetting', name)">{{ name }}</div>
            <label class="checkbox">
                <input type="checkbox" v-model="page.on">
                <span></span>
            </label>
        </div>
        <div class="setting" v-if="open">
            <ul class="list">
                <li v-for="block of page.list" :key="block">
                    <span>{{ block.title }}</span>
                    <div class="menu">
                        <label class="on checkbox" :ui-title="block.on ? 'Выключить' : 'Включить'">
                            <input type="checkbox" v-model="block.on">
                            <span></span>
                        </label>
                        <div class="edit" ui-title="Изменить">
                            <i class="uil uil-pen"></i>
                        </div>
                        <div class="remove" ui-title="Удалить">
                            <i class="uil uil-multiply"></i>
                        </div>
                    </div>
                </li>
                <div class="buttons">
                    <div class="add">Добавить</div>
                    <div class="save">Сохранить</div>
                </div>
            </ul>
        </div>
    </li>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
    name: 'PageBlockProjects',
    props: {
        _page: { type: Object },
        name: { type: String },
        open: { type: String }
    },
    computed: mapGetters(['']),
    data() {
        return {
            page: {}
        }
    },
    sockets: {},
    methods: {},
    mounted() {
        this.page = this._page;
    }
}

</script>

<style lang="scss">

.page.cms-menu .blocks .pages .list .block-page.projects .setting {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;

    ul.list {
        
        li {
            display: flex;
            margin: 0 0 8px 0;
            padding: 6px 8px;
            width: 100%;
            align-items: center;
            justify-content: space-between;
            background: var(--dimming);

            span {
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }

            .menu {
                display: flex;
                margin: 0 0 0 8px;
                align-items: center;

                .checkbox span {
                    width: 14px;
                    height: 14px;
                }

                div {
                    cursor: pointer;
                    margin: 0 0 0 8px;

                    &.edit {
                        color: var(--C2);
                    }

                    &.remove {
                        color: var(--C5);
                    }
                }
            }
        }

        .buttons {
            display: flex;
            margin: 4px 0 0 0;
            align-items: center;

            div {
                cursor: pointer;
                margin: 0 0 0 16px;
                padding: 6px 12px;
                width: 100%;
                color: var(--bg);
                text-align: center;
                background: var(--color);
            }
        }
    }
}

</style>
