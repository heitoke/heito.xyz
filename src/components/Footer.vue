<template>
    <footer>
        <div class="mini-logo">
            <Icon name="logo"/>
        </div>
        
        <div class="content">
            <div class="left">
                <div>
                    <Icon name="logo"/>
                    <span>heito.xyz</span>
                </div>
                <Select label="Language" position="top" :value="$lang.name"
                    :menu="getListLangs"
                    @select="$lang.set($event.value)"
                />
            </div>

            <div style="margin: 0 0 0 auto;"></div>

            <div class="group" v-for="(group, idx) of groups" :key="idx">
                <div class="title">{{ group.title }}</div>
                <ul>
                    <li v-for="(children, id) of group.childrens" :key="id"
                        @click="redirect(children.url)"
                    >
                        <span>{{ children.label }}</span>
                    </li>
                </ul>
            </div>
        </div>

        <Text class="text" :text="'Thanks for everything'"/>
    </footer>
</template>

<script lang="ts">

import { defineComponent } from 'vue';

import type { TLangName } from '../plugins/langs';

export default defineComponent({
    name: 'Footer',
    components: {},
    computed: {
        getListLangs() {
            return Object.keys(this.$lang.list).map(key => ({
                label: this.$lang.list[key as TLangName].name,
                text:  this.$lang.name === key ? 'Used' : this.$lang.list[key as TLangName][this.$lang.name],
                icon: 'translate',
                value: key,
                click: () => {
                    this.setLang(key as TLangName);
                }
            }));
        }
    },
    data: () => ({
        groups: [
            {
                title: 'Community',
                childrens: [
                    {
                        label: 'GitHub',
                        url: 'https://github.com/heito-xyz'
                    }
                ]
            },
            {
                title: 'Products',
                childrens: [
                    {
                        label: 'Hoshi',
                        url: 'https://hoshi.heito.xyz'
                    },
                    {
                        label: 'Uptime',
                        url: 'https://status.heito.xyz'
                    }
                ]
            }
        ]
    }),
    watch: {},
    methods: {
        setLang(name: TLangName) {
            this.$lang.set(name);
            
            this.$local.set('lang', name);
            document.querySelector('html')?.setAttribute('lang', name);
        },
        redirect(url: string) {
            window.open(url);
        }
    },
    mounted() {}
});

</script>

<style lang="scss" scoped>

footer {
    margin: 64px 0 0 0;
    width: 100%;

    .mini-logo {
        display: flex;
        align-items: center;
        box-sizing: border-box;

        @keyframes Icon {
            from {
                transform: rotate(0);
            }
            to {
                transform: rotate(360deg);
            }
        }

        i {
            margin: 0 12px;
            color: var(--main-color);
            font-size: 20px;
            animation: Icon 1.5s ease-in-out infinite;
        }

        &::after, &::before {
            content: " ";
            width: 100%;
            border-bottom: 1px solid var(--background-secondary);
            box-sizing: border-box;
        }
    }

    .content {
        display: flex;
        padding: 5% 10%;
        border-bottom: 1px solid var(--background-secondary);
    }

    .left {
        & > div {
            display: flex;
            margin: 0 0 16px 0;
            align-items: center;

            i {
                margin: 0 12px 0 0;
                color: var(--main-color);
                font-size: 48px;
            }

            span {
                font-size: 20px;
            }
        }
    }

    .group {
        margin: 0 5% 0 0;

        &:last-child {
            margin: 0;
        }

        .title {
            color: var(--main-color);
            font-size: 18px;
            text-align: right;
            user-select: none;
        }

        ul {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            justify-content: flex-start;
            
            li {
                cursor: pointer;
                margin: 4px 0 0 0;
                position: relative;

                &:last-child {
                    margin: 0;
                }

                &:hover {
                    &::after {
                        width: 100%;
                    }

                    span {
                        color: var(--text-primary);
                    }
                }
                
                &::after {
                    content: " ";
                    width: 0px;
                    height: 1px;
                    position: absolute;
                    right: 0;
                    bottom: 1px;
                    background-color: var(--main-color);
                    transition: .2s;
                    z-index: -1;
                }

                span {
                    color: var(--text-secondary);
                    transition: .2s;
                }
            }
        }
    }

    .text {
        padding: 24px;
        color: var(--text-secondary);
        font-size: 12px;
        text-align: center;
    }
}

@media (max-width: 540px) {
    footer {
        .content {
            flex-direction: column;
            align-items: center;

            .left {
                display: flex;
                align-items: center;
                flex-direction: column;
            }
        }

        .group {
            margin: 0 0 12px 0;

            ul {
                align-items: center;
            }
        }
    }
}

</style>