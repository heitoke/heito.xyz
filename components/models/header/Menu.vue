<template>
    <div class="menu">
        <ul>
            <li v-for="btn of getButtons" :key="btn.icon">
                <Icon :name="btn.icon"/>
            </li>
        </ul>
    </div>
</template>

<script lang="ts" setup>

interface ButtonIcon {
    label: string;
    icon: string;
    click(event: MouseEvent): void;
}


const getButtons = computed<Array<ButtonIcon>>(() => {
    return [
        {
            label: 'Search',
            icon: 'search-alt',
            click: () => {}
        },
        {
            label: 'Comments',
            icon: 'comments-alt',
            click: () => {}
        },
        {
            label: 'Notifications',
            icon: 'notification',
            click: () => {}
        }
    ];
});

</script>

<style lang="scss" scoped>

.menu {
    ul {
        display: flex;
        align-items: center;

        li {
            cursor: pointer;
            user-select: none;
            
            &:not(:last-child) {
                margin-right: 8px;
            }

            .ui-icon:not(:hover) {
                color: var(--text-secondary);
            }
        }
    }
}

</style>