<template>
    <div class="project" :style="{ '--image': `url('${p?.banner}')` }"
        @click="clicked ? open() : null"
    >
        <header>
            <div class="title">{{ p?.displayName || p?.name || p?._id }}</div>
            <div class="description">{{ p?.description }}</div>
        </header>

        <div>
            <ul class="members" v-if="p?.members?.length! > 0">
                <li v-for="({ member }, idx) of p?.members?.slice(0, 5)" :key="idx"
                    :style="{
                        '--avatar': `url('${member?.avatar || getAvatar({ nameId: member._id })}')`
                    }"
                    @mouseenter="toolpics.set({ title: member.nickname || member.username || member._id })"
                    @click.prevent.stop="windows.create({ component: 'UserProfile', data: member._id })"
                ></li>

                <li v-show="p?.members?.length! > 5">
                    +{{ p?.members?.length! - 5 }}
                </li>
            </ul>

            <div style="margin: 0 0 0 auto;"></div>

            <div class="date">{{ time.format(Date.now(), 'dd MMM YYYY') }}</div>

            <ul class="tags" v-if="p?.tags?.length! > 0">
                <li v-for="(tag, idx) of p?.tags" :key="idx">{{ tag }}</li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts" setup>

import { PropType } from 'nuxt/dist/app/compat/capi';

import type { IProject } from '~/types/api/project';

const
    toolpics = useToolpicsStore(),
    windows = useWindowsStore();

const props = defineProps({
    project: { type: Object as PropType<IProject> },
    clicked: { type: Boolean, default: true }
});

const changes = ref<IProject>({} as any);

const p = computed(() => {
    return { ...props.project, ...changes.value };
});


function open() {
    windows.create({
        component: 'ProjectProfile',
        data: p.value?._id,
        props: {
            update: (newProject: IProject) => {
                changes.value = newProject;
            }
        }
    });
}

</script>

<style lang="scss" scoped>

.project {
    cursor: pointer;
    display: flex;
    padding: 16px 24px;
    width: 100%;
    min-height: 196px;
    position: relative;
    border-radius: 5px;
    border: 1px solid var(--background-secondary);
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    transition: .2s;
    overflow: hidden;
    
    &::after {
        content: " ";
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-size: cover;
        background-position: center;
        background-image: var(--image);
        transition: .2s;
        transform: scale(1.3);
        filter: blur(5px) grayscale(.5);
        z-index: -1;
    }

    &:hover {
        &::after {
            transform: scale(1.1);
            filter: blur(5px) grayscale(0);
        }
    }

    header {
        .title, .description {
            display: -webkit-box;
            text-overflow: ellipsis;
            line-clamp: 2;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .title {
            font-size: 32px;
            font-weight: bold;
        }

        .description {
            margin: 8px 0 24px 0;
            color: var(--text-secondary);
        }
    }

    header + div {
        display: flex;
        align-items: center;

        ul.members {
            display: flex;
            margin: 0 12px 0 0;

            &:hover {
                li {
                    opacity: .5;
                }
            }

            li {
                margin: 0 0 0 -6px;
                width: 24px;
                height: 24px;
                color: var(--text-secondary);
                font-size: 12px;
                font-weight: bold;
                text-align: center;
                line-height: 24px;
                border-radius: 50%;
                background-size: cover;
                background-position: center;
                background-image: var(--avatar);
                background-color: var(--background-secondary);
                transition: .2s;

                &:first-child {
                    margin: 0;
                }

                &:hover {
                    opacity: 1;
                }
            }
        }

        .date {
            color: var(--text-secondary);
            font-size: 12px;
            white-space: nowrap;
            // mix-blend-mode: difference;
        }

        ul.tags {
            display: flex;
            margin: 0 0 0 12px !important;
            margin-left: auto;
            align-items: center;
            justify-content: flex-end;
            overflow: hidden;

            li {
                margin: 0 8px 0 0;
                padding: 4px 8px;
                font-size: 12px;
                white-space: nowrap;
                border-radius: 5px;
                background-color: #00000055;
                backdrop-filter: blur(5px);
                transition: .2s;

                &:last-child {
                    margin: 0;
                }
            }
        }
    }
}

</style>