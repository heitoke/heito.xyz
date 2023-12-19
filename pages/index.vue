<template>
    <div class="home">
        <h1>Hello world</h1>

        {{ $user.user?.displayName }}

        <button @contextmenu.self.prevent="c('test')">Click</button>

        <br>

        <button @contextmenu.self.prevent="c('test2')">Click</button>
    </div>
</template>

<script lang="ts" setup>

const $user = useUserStore();

const $menu = useContextMenuStore();


function c(name: string) {
    $menu.create({
        name,
        items: [
            {
                type: 'button',
                label: 'Tezt'
            },
            {
                type: 'button',
                label: 'dasdas dasd asd asdas dasd asdas dasd asda'
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
                label: 'ddsd',
                text: 'dasasdasdasdsadsa dasd asdas das dasda sd',
                items: []
            },
            {
                type: 'children',
                icon: 'search-alt',
                color: 'red',
                label: 'dasdas dasd asd asdas dasd asdas dasd asda',
                text: 'asd j daskj dkljasdlkajskldjasdklaskdjasjas',
                items: []
            },
            {
                type: 'children',
                label: 'dasdas dasd asd asdas dasd asdas dasd asda',
                items: []
            },
            {
                type: 'checkbox',
                name: 'test',
                image: $user.getAvatar,
                label: 'test'
            }
        ]
    });
}

</script>

<style lang="scss" scoped></style>