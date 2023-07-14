<template>
    <Transition name="waiting">
        <div class="waiting" v-if="show">
            <div class="content">
                <h1>{{ title }}</h1>
                
                <Text class="text" :text="stages[stage]"/>

                <div style="display: flex; margin: 12px 0 0 0; align-items: center;">
                    <Skeleton style="margin: 0 12px 0 0; border-radius: 50%;" :show="Boolean(user.getUser?._id)">
                        <template #default>
                            <div class="user-avatar" :style="{ 'background-image': `url('${getUserAvatar}')` }"
                                @mouseenter="toolpics.set({ text: user.getUser?.nickname || user.getUser?.username || user?.getUser?._id || 'Guast' })"
                            ></div>
                        </template>
                        <template #before>
                            <Loading :size="'20px'" :type="'circle'" style="padding: 4px 4px 0 4px;"/>
                        </template>
                    </Skeleton>

                    <div class="bar">
                        <div :style="{ width: `${100 * (stage + 1) / stages.length}%` }"></div>
                    </div>
                </div>
            </div>

            <div class="footer">Preparations are underway, thanks for waiting</div>
        </div>
    </Transition>
</template>

<script lang="ts" setup>

const
    user = useUserStore(),
    toolpics = useToolpicsStore();

const props = defineProps({
    show: { type: Boolean, default: true },
    stage: { type: Number, default: 0 }
});

/* Stages

0 - Init
1 - Connecting user
2 - Connected user
3 - Loading config
4 - Scan config
5 - Install config
6 - Finish

*/

const title = ref<string>('');

const stages = [
    'Initialization of this nightspot',
    'The user is trying to sit down',
    'The user asks for something in his mouth',
    'Initialization of products',
    'Checking products in stock',
    'Gently placed in the user\'s mouth',
    'The end of the meal'
];

const titles = [
    'You\'re almost there',
    'It\'s not far away',
    'A little more',
    'Wait don\'t rush',
    'Can you sit down here?'
];


const getUserAvatar = computed(() => {
    return user.getUser?.avatar || getAvatar({ nameId: user.getUser?._id });
});


onMounted(() => {
    title.value = titles[Math.floor(Math.random() * titles.length)];
});


</script>

<style lang="scss">

.waiting {
    display: flex;
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    align-items: center;
    justify-content: center;
    background-color: var(--background-primary);
    transition: .4s;
    z-index: 109;

    &-enter-active,
    &-leave-active {
        opacity: 0;
    }

    .content {
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;

        h1 {
            margin: 0 0 24px 0;
            font-size: calc(var(--font) - 1.5vmin);
        }

        .text {
            height: 16px;
            color: var(--text-secondary);
        }

        .bar {
            width: 196px;
            height: 4px;
            position: relative;
            border-radius: 5px;
            background-color: var(--background-secondary);
            overflow: hidden;

            div {
                height: 100%;
                background: var(--main-color);
                transition: all .2s;
            }
        }

        .user-avatar {
            margin: 0 12px 0 0;
            min-width: 20px;
            height: 20px;
            border-radius: 50%;
            background-size: cover;
            background-position: center;
            background-color: var(--background-secondary);
        }
    }

    .footer {
        position: absolute;
        font-size: 12px;
        bottom: 16px;
        opacity: .5;
        user-select: none;
    }
}

</style>