<template>
    <div class="home">
        <h1>Hello world</h1>

        {{ u }}
        <br>
        <br>
        <NavBar
            :value="u"
            :items="[
                { value: '1' },
                { value: '2', icon: 'comments-alt', disabled: true },
                { value: '3', icon: 'search-alt' },
                { value: '4' },
                { value: '5', icon: 'pacman', color: 'var(--green)' },
                { value: '6', icon: 'brush', clear: true },
                { value: '7', icon: 'notification', color: 'var(--red)' },
                { value: '8' }
            ]"

            @select="u = $event.value"
        />

        <NavBar
            :value="u2"
            :multi="true"
            :items="[
                { value: '1' },
                { value: '2', icon: 'comments-alt', disabled: true },
                { value: '3', icon: 'search-alt' },
                { value: '4' },
                { value: '5', icon: 'pacman', color: 'var(--green)' },
                { value: '6', icon: 'brush', clear: true },
                { value: '7', icon: 'notification', color: 'var(--red)' },
                { value: '8' }
            ]"

            @select-multi="u2 = $event.map(i => i.value)"
        />

        <NavBar style="width: 169px; margin: 12px 0;"
            :value="u2"
            :multi="true"
            :orientation="'vertical'"
            :items="[
                { value: '1', onlyClick: true },
                { value: '2' },
                { value: '3' },
                { value: '4', icon: 'logo', disabled: true },
                { value: '5', icon: 'pacman', color: 'var(--green)' },
                { label: 'Comments', value: '6', icon: 'comments-alt', color: 'var(--blue)' },
                { value: '7', icon: 'notification', color: 'var(--red)' },
                { value: '8', label: 'jsa djsakl djsalk d jsalkdjsa kljask' }
            ]"

            @select-multi="u2 = $event.map(i => i.value)"
        />

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

import NavBar from '~/components/models/content/NavBar.vue';

const
    $user = useUserStore(),
    $menu = useContextMenuStore(),
    $notifications = useNotificationsStore(),
    $windows = useWindowsStore();

const t = ref(false);
const y = ref('')
const a = ref('r1');

const u = ref('0');
const u2 = ref<Array<string>>([]);


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
                        text: `salkdjsalkdjaslkjdaslkjdalksdjaskljdklasjdklasjdklasjdklasjdaskljdaskljdsalkdjsakldajsdlkasjdklasjdlkasjdaskldjsalkdjaskldjsakldjas`,
                        buttons: [
                            {
                                value: 'das'
                            }
                        ]
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

    .te {
        margin: 12px 0;
        padding: 12px;
        max-width: 315px;
        border-radius: 5px;
        border: 1px solid var(--background-secondary);
    }
}

</style>