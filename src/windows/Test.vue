<template>
    <div class="test">
        Test Window
        <div class="test-cm" @contextmenu="setContextMenu(contextMenu)">ContextMenu</div>
    </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';

import { mapActions } from 'vuex';

export default defineComponent({
    name: 'WindowTest',
    components: {},
    computed: {},
    props: {
        windowId: { type: Number },
        data: { type: String }
    },
    data: () => ({
        contextMenu: {
            name: 'test',
            title: 'asd',
            buttons: [
                {
                    label: 'Notifications',
                    text: 'Description',
                    icon: 'notification',
                    color: '#7579ff'
                },
                {
                    label: 'Settings Settings Settings Settings Settings',
                    text: 'Description Description Description Description Description',
                    icon: 'close',
                    color: '#857234',
                    children: {
                        name: 'test-2',
                        title: 'Settings Settings Settings Settings Settings',
                        buttons: [
                            {
                                label: 'Hello world',
                                text: 'Text',
                                icon: 'notification',
                                color: '#f85434',
                                children: {
                                    name: 'test-3',
                                    title: 'Hello world',
                                    buttons: [
                                        {
                                            label: 'End'
                                        }
                                    ]
                                }
                            },
                            {
                                separator: true
                            },
                            {
                                label: 'Bye Bye',
                                text: ':('
                            }
                        ]
                    }
                }
            ]
        }
    }),
    watch: {},
    methods: {
        ...mapActions(['setContextMenu', 'addWindowButtons'])
    },
    mounted() {
        this.addWindowButtons({
            windowId: this.windowId,
            buttons: [
                {
                    label: 'Context Menu',
                    text: 'Description',
                    color: 'var(--C1)',
                    icon: 'arrow-left',
                    click: (e: Event) => {
                        this.setContextMenu({ position: 'bottom left', ...this.contextMenu });
                    }
                }
            ]
        })
    }
});

</script>

<style lang="scss" scoped>

.block.test {
    // width: 512px;
    // height: 512px;
    font-size: 16px;

    .test-cm {
        margin: 12px 0 0 0;
        padding: 24px 64px;
        border-radius: 5px;
        border: 1px solid var(--C1);
    }
}

</style>