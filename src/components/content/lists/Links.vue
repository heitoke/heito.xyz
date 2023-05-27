<template>
    <div class="links">
        <div class="filters" v-if="filters?.length > 0">
            <Textbox label="Search" v-show="filters.includes('search')"
                @input="filter.text = ($event.target as any)?.value"
            />
            <Button style="margin: 0 0 0 12px; width: 128px; white-space: nowrap;" v-show="filters.includes('add')"
                color="var(--green)"
                @click="addNewLink()"
            >New link</Button>
        </div>

        <ul>
            <li v-for="(link, idx) of getListLink" :key="idx"
                @click="redirect(link?.url)"
                @contextmenu="setContextMenu({
                    name: `links:${link?.label}`,
                    position: ['fixed-target', 'center', 'bottom'],
                    event: ($el as Element)?.querySelector(`ul li:nth-child(${idx + 1})`),
                    buttons: [
                        {
                            label: 'Change link',
                            icon: 'pencil',
                            click: () => {
                                addNewLink(link, idx);
                            }
                        },
                        { separator: true },
                        {
                            label: 'Delete link',
                            icon: 'link',
                            click: () => {
                                $windows.create({
                                    component: 'Message',
                                    data: {
                                        title: 'Deleting a link',
                                        icon: 'link',
                                        text: 'Do you really want to delete the link?',
                                        buttons: [
                                            {
                                                label: 'Out of sight',
                                                color: 'var(--red)',
                                                click: (e: MouseEvent, data: any, windowId: number) => {
                                                    list = list.filter((_, i) => i !== idx);

                                                    $emit('update', { list });

                                                    $windows.close(windowId);
                                                }
                                            },
                                            {
                                                label: 'Give another chance',
                                                color: 'var(--green)',
                                                click: (e: MouseEvent, data: any, windowId: number) => {
                                                    $windows.close(windowId);
                                                }
                                            }
                                        ]
                                    }
                                })
                            }
                        }
                    ]
                })"
            >
                <Icon :name="link?.icon" :style="{ margin: '0 12px 0 0', color: link?.color }" v-if="link?.icon"/>
                <div :style="`max-width: calc(100% - ${link?.icon ? 32 : 0}px);`">
                    <div class="label">{{ link?.label }}</div>
                    <div class="text" v-show="link?.text">{{ link?.text }}</div>
                </div>
            </li>
        </ul>

        <div v-if="getListLink.length < 1">
            <slot name="void" v-if="isSlotVoid"></slot>
            <Alert type="mini" v-else/>
        </div>
    </div>
</template>

<script lang="ts">

import { defineComponent, PropType, markRaw, defineAsyncComponent } from 'vue';

import { mapActions } from 'vuex';

import type { ILink } from '../../../libs/api/routes/users';

export default defineComponent({
    name: 'ListLinks',
    computed: {
        getListLink() {
            const list = [...this.list];

            const regex = new RegExp(this.filter.text.trim(), 'gi');

            return list.filter(({ label, text, url }) => regex.test(label) || regex.test(text || '') || regex.test(url));
        },
        isSlotVoid() {
            try {
                return (this.$slots as any)?.void();
            } catch (err) {
                return false;
            }
        }
    },
    props: {
        links: {
            type: Object as PropType<Array<ILink>>,
            required: true
        },
        filters: {
            type: Object as PropType<Array<'add' | 'search'>>,
            default: () => {
                return ['add', 'search'];
            }
        }
    },
    data: () => ({
        SelectIcon: markRaw(defineAsyncComponent(() => import('../SelectIcon.vue'))),
        filter: {
            text: ''
        },
        list: [] as Array<ILink>
    }),
    watch: {
        'links'(newValue) {
            this.list = newValue;
        }
    },
    emits: {
        add(a: Function): Function {
            return a;
        },
        update(options: { list: Array<ILink> }): { list: Array<ILink> } {
            return options;
        }
    },
    methods: {
        ...mapActions(['setContextMenu']),
        redirect(url: string) {
            window.open(url, '');
        },
        addNewLink(link?: ILink, id: number = -1) {
            let newLink: ILink = {
                label: '',
                text: '',
                icon: '',
                img: '',
                color: '',
                url: ''
            };

            if (link) newLink = { ...link };
            
            this.$windows.create({
                component: 'Message',
                data: {
                    title: link?.label ? 'Changing the link' : 'Creating a new link',
                    icon: 'link',
                    text: link?.label ? 'Change the old link' : 'Create and share something new',
                    components: [
                        {
                            component: 'Textbox',
                            props: { label: 'Label', value: newLink?.label },
                            events: {
                                input(e: MouseEvent) {
                                    newLink['label'] = (e.target as any)?.value;
                                }
                            }
                        },
                        {
                            component: 'Textbox',
                            props: { label: 'Text', value: newLink?.text },
                            events: {
                                input(e: MouseEvent) {
                                    newLink['text'] = (e.target as any)?.value;
                                }
                            }
                        },
                        {
                            component: 'Textbox',
                            props: { label: 'URL', value: newLink?.url },
                            events: {
                                input(e: MouseEvent) {
                                    newLink['url'] = (e.target as any)?.value;
                                }
                            }
                        },
                        {
                            component: 'ColorPicker',
                            props: { value: newLink?.color },
                            events: {
                                color(color: string) {
                                    newLink['color'] = color;
                                }
                            }
                        },
                        {
                            component: this.SelectIcon,
                            props: { icon: newLink?.icon, color: newLink?.color },
                            events: {
                                select(iconName: string) {
                                    newLink['icon'] = iconName;
                                }
                            }
                        }
                    ],
                    buttons: [
                        {
                            label: link?.label ? 'Update old' : 'To see something new',
                            color: `var(--${link?.label ? 'yellow' : 'green'})`,
                            click: (e: MouseEvent, data: any, windowId: number) => {
                                if (!newLink?.label || !newLink?.url) return;

                                if (id > -1) {
                                    this.list[id] = newLink;
                                } else {
                                    this.list = [...this.list || [], newLink];
                                }

                                this.$windows.close(windowId);

                                this.$emit('update', {
                                    list: this.list
                                });
                            }
                        }
                    ]
                }
            })
        }
    },
    mounted() {
        this.list = this.links;

        this.$emit('add', this.addNewLink);
    }
})

</script>

<style lang="scss" scoped>

.links {
    .filters {
        display: flex;
        margin: 0 0 12px 0;
        align-items: center;
    }

    ul {
        display: grid;
        max-width: 100%;
        position: relative;
        grid-template-columns: repeat(2, 50%);

        li {
            cursor: pointer;
            display: flex;
            padding: 10px 16px;
            max-width: 100%;
            position: relative;
            border-radius: 5px;
            border: 1px solid var(--background-secondary);
            box-sizing: border-box;
            align-items: center;
            transition: .2s;

            &:nth-child(1n) {
                margin: 12px 6px 0 0;
            }
            &:nth-child(2n) {
                margin: 12px 0 0 6px;
            }

            &:nth-child(1) {
                margin: 0 6px 0 0 !important;   
            }

            &:nth-child(2) {
                margin: 0 0 0 6px !important;   
            }

            &:hover {
                box-shadow: 0 0 5px 0 var(--background-secondary);
                transform: scale(1.02);
            }

            &:active {
                transform: scale(.95);
                opacity: .5;
            }

            .hx-icon {
                color: var(--text-secondary);
                transition: .2s;
            }

            .label,
            .text {
                max-width: 100%;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                box-sizing: border-box;
            }

            .text {
                color: var(--text-secondary);
                font-size: 12px;
            }
        }
    }
}

</style>