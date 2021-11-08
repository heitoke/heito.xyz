<template>
    <div class="online">
        <div class="subtitle">Какие пользователи на сайте</div>
        <ul class="users">
            <li class="user" v-for="(user, index) of users" :key="(user, index)">
                <div class="header">
                    <div>{{ user.id }} <span v-if="this.$socket.id === user.id">ВЫ</span></div>
                    <div>{{ user.ip }}</div>
                    <div>Chrome</div>
                    <div>{{ user.platform }}</div>
                    <ul class="menu">
                        <li ui-title="Настройки" @click="open = (open === index) ? false : index">
                            <i class="uil uil-setting"></i>
                        </li>
                        <li class="kick" ui-title="Кикнуть" @click="sendUser(user.id, 'kick', null)">
                            <i class="uil uil-multiply"></i>
                        </li>
                    </ul>
                </div>
                <div class="setting" v-if="open === index">
                    <div class="redirect">
                        <div class="title">Перенести на другую страницу</div>
                        <div class="line">
                            <input type="text" placeholder="Пусть к страницы" v-model="text.path">
                            <div class="button" @click="sendUser(user.id, 'path')"><i class="uil uil-message"></i></div>
                        </div>
                        <div class="title">Редирект на другой сайт</div>
                        <div class="line">
                            <input type="text" placeholder="Ссылка на сайт" v-model="text.redirect">
                            <div class="button" @click="sendUser(user.id, 'redirect')"><i class="uil uil-message"></i></div>
                        </div>
                    </div>
                    <div class="notifications">
                        <div class="title">Отправить уведоление пользовутелю</div>
                        <input type="text" placeholder="Тект" v-model="text.message">
                        <div class="button" @click="sendUser(user.id, 'message')">Отправить</div>
                    </div>
                    <div class="scripts">
                        <div class="title">Отправить script</div>
                        <textarea cols="30" rows="10" v-model="text.script"></textarea>
                        <div class="button" @click="sendUser(user.id, 'script')">Отправить</div>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
    name: 'BlockMenuOnline',
    props: {},
    computed: mapGetters(['']),
    data() {
        return {
            open: false,
            users: [],
            text: {
                redirect: '',
                path: '',
                script: '',
                message: ''
            }
        }
    },
    sockets: {
        'cms:loadUsers' (data) {
            this.users = data
        }
    },
    methods: {
        sendUser(id, type, value) {
            this.$socket.emit('cms:send', { id, data: { type, value: value || this.text[type] } })
        }
    },
    mounted() {
        this.$socket.emit('cms:getUsers')
    }
}

</script>

<style lang="scss">

.page.cms-menu .blocks .online {
    width: 100%;

    .subtitle {
        margin: 4px 8px;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
    }

    .users {
        .user {
            margin: 8px 0 0 0;
            padding: 16px 24px;
            background: var(--bg-2);

            .header + .setting {
                margin: 16px 0 0 0;
            }

            .header {
                display: flex;
                align-items: center;
                justify-content: space-between;

                div:nth-child(1) {
                    span {
                        padding: 2px 4px;
                        color: var(--C7);
                        font-size: 10px;
                    }
                }

                .menu {
                    display: flex;
                    align-items: center;

                    li {
                        cursor: pointer;
                        margin: 0 0 0 4px;

                        &.kick {
                            color: var(--C5);
                        }
                    }
                }
            }

            .setting {
                display: grid;
                padding: 16px 0 0 0;
                grid-template-columns: 1fr 1fr 1fr 1fr;
                border-top: 1px solid var(--color-3);

                .title {
                    margin: 4px 0;
                    font-size: 10px;
                    text-transform: uppercase;
                }

                input[type="text"] {
                    width: 256px;
                    padding: 6px 12px;
                    color: var(--color);
                    font-size: 13px;
                    border: 1px solid var(--color-2);
                    background: var(--T);
                }

                textarea {
                    max-width: 256px;
                    max-height: 256px;
                    height: 96px;
                    min-height: 96px;
                    color: var(--color);
                    background: var(--bg);
                }
            }

            .line {
                display: flex;
                position: relative;
                align-items: center;

                input[type="text"] {
                    width: 212px;
                }

                .button {
                    margin: 0 0 0 4px;
                    width: 16px;
                    height: 18px;
                }
            }

            .button {
                cursor: pointer;
                margin: 8px 0 0 0;
                padding: 6px 12px;
                width: 96px;
                color: var(--bg);
                text-align: center;
                background: var(--color);
                user-select: none;

                &:active {
                    transform: scale(.9);
                }
            }
        }
    }

}

</style>
