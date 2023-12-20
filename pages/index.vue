<template>
    <div class="home">
        <h1>Hello world</h1>

        {{ $user.user?.displayName }}

        <button @contextmenu.self.prevent="c('test')">Click</button>

        <br>
        {{ a }}

        <button @contextmenu.self.prevent="c('test2')">Click</button>
    </div>
</template>

<script lang="ts" setup>

const $user = useUserStore();

const $menu = useContextMenuStore();

const $notifications = useNotificationsStore();


const t = ref(false);

const a = ref('r1');


function c(name: string) {
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

<style lang="scss" scoped></style>