<template>
    <div class="contact-card" v-if="user">
        <div class="title font-5">{{ name }}</div>
        <ul class="blocks">
            <li class="account">
                <img :src="user.avatar" alt="Avatar">
                <span>{{ user.username }}</span>
            </li>
            <li :class="`activity ${me().data.mode || ''}`" v-if="me() && me().data">
                <div class="action">
                    <div>{{ me().data.action }}</div>
                    <ul v-if="me().data.buttons">
                        <li v-for="button of me().data.buttons" :key="button" :ui-title="button.label"
                            @click="redirect(button.url)"
                        >
                            <i :class="button.icon"></i>
                        </li>
                    </ul>
                </div>
                <div class="info">
                    <div class="images">
                        <div :style="{ 'background-image': `url('${me().data.images.big}')` }"></div>
                        <i v-if="me().data.images.icon" :class="me().data.images.icon"></i>
                    </div>
                    <div class="text">
                        <div>{{ me().data.name }}</div>
                        <div>{{ me().data.state }}</div>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
    name: 'Contact',
    props: {
        name: { type: String },
        user: { type: Object }
    },
    computed: mapGetters(['getActivity']),
    data() {
        return {
            linkContact: {
                spotify: x => x
            }
        }
    },
    methods: {
        me() {
            return this.getActivity.find(f => f.id === this.user.id)
        }
    },
    monted() {
        console.log(1, this.name, this.user);
    }
}

</script>

<style lang="scss">

.contact-card {
    min-width: 215px;
    max-width: 215px;

    .title {
        padding: 4px 8px;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        border-radius: 0 5px 0 0;
        background: var(--bg-2);
    }

    .blocks {
        li:last-child {
            border-radius: 0 0 5px 5px;
        }

        .account {
            display: flex;
            margin: 3px 0 0 0;
            padding: 6px 8px;
            align-items: center;
            background: var(--bg-2);

            img {
                margin: 0 4px 0 0;
                width: 24px;
                height: 24px;
                border-radius: 5px;
            }

            span {
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }

            .menu {
                display: flex;
                margin: 0 0 0 4px;
                align-items: center;

                li {
                    cursor: pointer;
                    margin: 0 0 0 4px;
                    font-size: 12px;
                }
            }
        }

        .activity {
            margin: 2px 0 0 0;
            padding: 4px 8px 6px 8px;
            position: relative;
            background: var(--bg-2);

            .action {
                display: flex;
                margin: 3px 0 4px 0;
                font-size: 10px;
                font-weight: 600;
                text-transform: uppercase;
                align-items: center;

                ul {
                    display: flex;
                    align-items: center;

                    li {
                        cursor: pointer;
                        margin: 0 0 0 4px;
                    }
                }
            }

            .info {
                display: flex;
                align-items: center;

                .images {
                    margin: 0 8px 0 0;
                    height: 48px;
                    position: relative;

                    div:nth-child(1) {
                        width: 48px;
                        height: 48px;
                        border-radius: 7px;
                        background-size: cover;
                        background-position: center;
                    }

                    img:nth-child(2) {
                        width: 16px;
                        height: 16px;
                        position: absolute;
                        right: -6px;
                        bottom: 0;
                        border-radius: 50%;
                        background-size: cover;
                    }

                    i {
                        width: 14px;
                        height: 14px;
                        position: absolute;
                        top: -3px;
                        right: -3px;
                        color: var(--C2);
                        font-size: 12px;
                        text-align: center;
                        border-radius: 3px;
                        background: var(--bg-2);
                    }
                }

                .text {
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    
                    div:nth-child(1) {
                        font-size: 13px;
                        font-weight: 600;
                    }

                    div:nth-child(2),
                    div:nth-child(3) {
                        font-size: 12px;
                    }
                }
            }

            &.mini {

                .images {
                    height: 24px;

                    div:nth-child(1) {
                        width: 24px;
                        height: 24px;
                        border-radius: 5px;
                    }
                }
            }

            &:after,
            &::before {
                content: " ";
                width: 2px;
                height: 8px;
                position: absolute;
                top: -4px;
                background: var(--bg-2);
            }

            &::after {
                left: 4px;
            }

            &::before {
                right: 4px;
            }
        }
    }
}

</style>
