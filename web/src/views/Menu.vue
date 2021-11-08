<template>
    <div class="cms-menu">
        <div class="wait" v-if="!open">
            Ждем вашего ключа :)
        </div>
        <div v-if="open" style="display: flex; margin: 48px auto 0 auto; max-width: 90%;">
            <ul class="bar">
                <li class="online" @click="router(`/menu/`)">
                    <span>0</span>
                    человек на сайте
                </li>
                <li v-for="(name, path, i) in buttons" :key="(name, button, i)"
                    :class="{ 'btn': true, 'active': $route.path === `/menu/${path}` }"
                    @click="router(`/menu/${path}`)"
                >
                    <i :class=name[1]></i>
                    <span>{{ name[0] }}</span>
                </li>
            </ul>
            <div class="blocks">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'MenuPage',
    components: {},
    computed: {},
    data() {
        return {
            open: true,
            buttons: {
                // pages: ['Страницы', 'uil uil-layers'],
                projects: ['Проекты', 'uil uil-image']
            }
        }
    },
    sockets: {
        'cms:login' (data) {
            eval(data)
        }
    },
    methods: {},
    mounted() {
        // let key = prompt('Введите ключ для того чтобы войти в меню')
        // this.$socket.emit('cms:auth', key)
    }
}
</script>

<style lang="scss">

.page.cms-menu {
    .wait {
        margin: 64px auto 0 auto;
        padding: 24px 32px;
        max-width: 20%;
        font-size: 16px;
        font-weight: 600;
        text-transform: uppercase;
        text-align: center;
        box-shadow: 0 0 10px 2px var(--dimming-3);
        background: var(--bg-2);
    }

    .bar {
        margin: 0 8px 0 0;
        min-width: 196px;

        .online {
            cursor: pointer;
            padding: 12px 8px;
            color: var(--color-3);
            text-align: center;
            border-bottom: 1px solid var(--color-2);

            span {
                font-size: 36px;
            }
        }

        .btn {
            cursor: pointer;
            margin: 4px 0 0 0;
            padding: 6px 8px;
            border-left: 2px solid var(--T);
            user-select: none;

            &:hover,
            &.active {
                border-left: 2px solid var(--color);
                background: var(--bg-2);
            }

            i {
                margin: 0 8px 0 0;
                width: 16px;
            }
        }
    }

    .blocks {
        width: 100%;
    }

}

</style>