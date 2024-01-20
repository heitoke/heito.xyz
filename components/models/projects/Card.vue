<template>
    <div class="project-card">
        <div class="header">
            <div>{{ project.displayName }}</div>

            <div>{{ project?.description || '' }}</div>
        </div>

        <div>
            <ul>
                <li v-for="({ member }, idx) of project.members.list" :key="idx"
                    @mouseenter="$toolpic.show(member?.displayName || member?.username || member?._id)"
                >
                    <img :src="getDefaultImage(member._id)" alt="Member Avatar">
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts" setup>

import type { Project } from '~/types/api/project';


const $toolpic = useToolpicStore();


const props = defineProps<{
    project: Project;
}>();

</script>

<style lang="scss" scoped>

.project-card {
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

    .header {
        div {
            display: -webkit-box;
            text-overflow: ellipsis;
            line-clamp: 2;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        div:nth-child(1) {
            font-size: 32px;
            font-weight: bold;
        }

        div:nth-child(2) {
            margin: 8px 0 24px 0;
            color: var(--text-secondary);
        }
    }

    .header + div {
        ul:nth-child(1) {
            display: inline-flex;
            align-items: center;

            &:hover {
                li {
                    opacity: .5;
                }
            }

            li {
                max-width: 24px;
                min-width: 24px;
                height: 24px;
                border-radius: 50%;
                background-color: var(--background-secondary);
                transition: .2s;
                overflow: hidden;

                &:hover {
                    opacity: 1;
                    z-index: 2;
                }
                
                &:not(:first-child) {
                    margin-left: -4px;
                }

                &:not(:hover):not(:last-child) {
                    mask-image: radial-gradient(circle 12px at center, transparent 100%, green 0%);
                    mask-size: 60px 24px, 100%;
                    -webkit-mask-image: radial-gradient(circle 12px at center, transparent 100%, green 0%);
                    -webkit-mask-size: 60px 24px, 100%;
                }
                
                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    object-position: center;
                }
            }
        }
    }
}

</style>