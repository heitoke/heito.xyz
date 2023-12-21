<template>
    <div class="home">
        <h1>Hello world</h1>

        <Button label="ClickClickClickClickClickClickClickClickClickClickClickClickClickClickClickClick"
            text="Testdj kl"
            @contextmenu.prevent="c('test2')"
            style="max-width: 256px;"
            icon="pacman"
        />

        <Textbox style="margin-top: 12px;"
            label="Test"
            icon="pacman"

            @update="y = $event"
        />

        <Select style="margin-top: 12px;"
            label="d"

            :options="[
                { value: 'das' },
                { value: 'asd' }
            ]"
        />
    </div>
</template>

<script lang="ts" setup>

const
    $user = useUserStore(),
    $menu = useContextMenuStore(),
    $notifications = useNotificationsStore(),
    $windows = useWindowsStore();

const t = ref(false);
const y = ref('')
const a = ref('r1');

function e() {
    $windows.create('Message', {
        title: 'asd'
    });
}

function c(name: string) {
    console.log(123);
    
    $menu.create({
        name,
        items: [
            {
                type: 'button',
                label: 'Tezt',
                click() {
                    $notifications.push({
                        color: '#754954',
                        icon: 'exit',
                        title: 'asdsadsad asdsa dsa dsad sad sada sdas das dasd asd sadas dasd asd asd',
                        text: `Notification: ${$notifications.list.length + 1}`
                    })

                    $notifications.push({
                        color: '#754954',
                        image: $user.getAvatar,
                        title: 'asdsadsad asdsa dsa dsad sad sada sdas das dasd asd sadas dasd asd asd',
                        text: `Notification: ${$notifications.list.length + 1}`
                    })

                    $notifications.push({
                        color: '#754954',
                        icon: 'notification',
                        image: $user.getAvatar,
                        title: 'asdsadsad asdsa dsa dsad sad sada sdas das dasd asd sadas dasd asd asd',
                        text: `salkdjsalkdjaslkjdaslkjdalksdjaskljdklasjdklasjdklasjdklasjdaskljdaskljdsalkdjsakldajsdlkasjdklasjdlkasjdaskldjsalkdjaskldjsakldjas`
                    })
                }
            },
            {
                type: 'button',
                label: 'dasdas dasd asd asdas dasd asdas dasd asda',
                click() {
                    $notifications.push({
                        color: '#754954',
                        image: $user.getAvatar,
                        title: 'asdsadsad asdsa dsa dsad sad sada sdas das dasd asd sadas dasd asd asd',
                        text: `dkjsa ;ldsajkl djsa lkd jaslkd jaskldjsalkd jsakldas lkdjas lkdjasl jdaslkdjaslkjdasl jdlkasjdsalkjd askl djalkjdkla sjdlkasjdlaksjd lkasjd lkasjdkla sjdsakl jdklas jdlsakjd aslkjdalsk jdalsk jaslkjdalksjdalksd`
                    })
                }
            },
            {
                type: 'separator'
            },
            {
                type: 'button',
                icon: 'pacman',
                label: 'das kdjask jdask jdaksjdaksjdlkasj d'
            },
            {
                type: 'children',
                icon: 'search-alt',
                color: 'red',
                label: 'dasdas dasd asd asdas dasd asdas dasd asda',
                text: 'asd j daskj dkljasdlkajskldjasdklaskdjasjas',
                items: [
                    {
                        type: 'button',
                        icon: 'notification',
                        color: 'var(--main-color)',
                        label: 'Notifications'
                    }
                ]
            },
            {
                type: 'radio',
                label: 'Radio 1',
                name: 'test2',
                value: 'r1',
                ref: a,
                click(value, event) {
                    a.value = 'r1';
                }
            },
            {
                type: 'radio',
                label: 'Radio 2',
                name: 'test2',
                value: 'r2',
                ref: a,
                click(value, event) {
                    a.value = 'r2';
                }
            },
            {
                type: 'checkbox',
                name: 'test',
                image: $user.getAvatar,
                value: t,
                label: 'test',
                click(value, event) {
                    t.value = value;

                    console.log(value);
                    
                }
            }
        ]
    });
}

</script>

<style lang="scss" scoped>

.page.home {
    height: 10000px;
}

</style>