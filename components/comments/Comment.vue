<template>
    <div class="comment">
        <header v-if="showHeader"
            @click="windows.create({ component: 'UserProfile', data: comment.user._id })"
        >
            <div class="user-avatar"
                :style="{ 'background-image': `url('${getUserAvatar}')` }"
            ></div>

            <div style="max-width: calc(100% - 48px);">
                <Text :text="getUserNickname"/>
                <Text :text="time.timeago(comment.createdAt)"/>
            </div>
        </header>

        <div class="content">
            <div class="edit" v-if="edit">
                <Textbox type="area" label="Content"
                    :value="text || comment.content"
                    @input="text = $event.target.value"
                />
            </div>

            <ScrollBar max-height="256px" :inset="true" v-else>
                <span class="text">{{ (text || comment.content).slice(0, 128) }}</span>
                <Text class="text" :text="getCommentText" type="span"/>
            </ScrollBar>
            
            <div class="read" @click="read = !read" v-show="comment.content.length > 128">
                {{ read ? 'Hide' : 'Show' }}
            </div>

            <ul class="buttons">
                <li v-for="btn of getCommentButtons" :key="btn.icon"
                    @mouseenter="toolpics.set({ text: btn.label, position: 'top' })"
                    @click="btn?.click ? btn?.click($event) : null"
                >
                    <Icon :name="btn.icon"/>
                    <span v-show="btn?.text">{{ btn?.text }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts" setup>

import { PropType } from 'nuxt/dist/app/compat/capi';

import ScrollBar from '~/components/content/ScrollBar.vue';

import type { IComment } from 'types/api/comments';

interface Button {
    label: string;
    icon: string;
    text?: string;
    click?(event: MouseEvent): void;
}

interface Like {
    is: boolean;
    count: number;
}

const { $api } = useNuxtApp();

const emit = defineEmits(['comments', 'delete']);

const
    user = useUserStore(),
    toolpics = useToolpicsStore(),
    windows = useWindowsStore(),
    contextMenu = useContextMenuStore();


const props = defineProps({
    comment: {
        type: Object as PropType<IComment>,
        required: true
    },
    showHeader: { type: Boolean, default: true }
});

const
    read = ref<boolean>(false),
    edit = ref<boolean>(false),
    text = ref<string>(''),
    likes = ref<Like>({ is: false, count: 0 }),
    dislikes = ref<Like>({ is: false, count: 0 });


const getCommentText = computed(() => {
    const content = text.value || props.comment?.content;

    return content.length > 128 && !read.value ? '...' : content.slice(128);
});

const getUserNickname = computed(() => {
    const { nickname, username, _id } = props.comment?.user;

    return nickname || username || _id;
});

const getUserAvatar = computed(() => {
    const { avatar, _id } = props.comment?.user;

    return avatar || getAvatar({ nameId: _id });
});

const getCommentButtons = computed<Array<Button>>(() => {
    const
        countLikes = likes.value.count,
        countDislikes = dislikes.value.count;
    
    return [
        {
            label: 'Like' + (countLikes > 0 ? ` (${countLikes})` : ''),
            icon: likes.value.is ? 'like' : 'hand-thumbsup-svgrepo-com',
            click: () => action('like')
        },
        {
            label: 'Dislike' + (countDislikes > 0 ? ` (${countDislikes})` : ''),
            icon: dislikes.value.is ? 'dislike' : 'dislike-alt',
            click: () => action('dislike')
        },
        {
            label: 'Comments',
            icon: 'comments-alt',
            click: () => {
                emit('comments', props.comment._id);
            }
        },
        ...(props.comment.user._id === user.getUser?._id ? [{
            label: 'Options',
            icon: 'ellipsis',
            click: commentContextMenu
        }] : []),
        ...(edit.value ? [{
            label: 'Save',
            icon: 'quill',
            click: updateComment
        },
        {
            label: 'Cancel',
            icon: 'clock-alt',
            click: () => {
                edit.value = false;
            }
        }] : [])
    ].filter(b => b.icon);
});



watch(() => props.comment._id, () => {
    setLikes();
});



function commentContextMenu(event: MouseEvent) {
    contextMenu.create({
        name: `comment:options:${props.comment._id}`,
        position: ['fixed', 'right', 'center'],
        event,
        buttons: [
            {
                label: 'Edit',
                icon: 'pencil',
                click: () => {
                    edit.value = true;
                }
            },
            { separator: true, label: '' },
            {
                label: 'Delete',
                icon: 'trash',
                color: 'var(--red)',
                click: deleteComment
            }
        ]
    });
}

async function action(type: 'like' | 'dislike') {
    if ((type === 'like' && likes.value.is) || (type === 'dislike' && dislikes.value.is)) return;

    const [result, status] = await $api.comments.action(props.comment._id, type);

    if (status !== 200) return;

    if (type === 'like') {
        if (dislikes.value.is) {
            dislikes.value.count--;
            dislikes.value.is = false;
        }

        likes.value.count++;
        likes.value.is = true;
    } else if (type === 'dislike') {
        if (likes.value.is) {
            likes.value.count--;
            likes.value.is = false;
        }

        dislikes.value.count++;
        dislikes.value.is = true;
    }
}

async function updateComment() {
    if (!text.value || text.value.trim() === '') return;

    const [result, status] = await $api.comments.update(props.comment._id, { content: text.value });

    if (status !== 200) return;

    edit.value = false;
}

async function deleteComment() {
    const [result, status] = await $api.comments.delete(props.comment._id);

    if (status !== 200) return;
    
    emit('delete', props.comment._id);
}

function setLikes() {
    likes.value = {
        is: props.comment.isLiked,
        count: props.comment.likes
    }

    dislikes.value = {
        is: props.comment.isDisliked,
        count: props.comment.dislikes
    }
}


onMounted(() => {
    setLikes();
});

</script>

<style lang="scss" scoped>

.comment {
    height: auto;

    header {
        cursor: pointer;
        display: flex;
        margin: 0 0 8px 0;
        align-items: center;
        transition: all .2s;

        .user-avatar {
            margin: 0 8px 0 0;
            max-width: 36px;
            min-width: 36px;
            height: 36px;
            position: relative;
            border-radius: 50%;
            background-size: cover;
            background-position: center;
            background-color: var(--background-primary);
            transition: .2s;
        }

        .user-avatar + div {
            div {
                max-width: 100%;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;

                &:nth-child(2) {
                    color: var(--text-secondary);
                    font-size: 12px;
                }
            }
        }

        i {
            cursor: pointer;
            margin: 0 0 0 auto;
            padding: 8px;
            color: var(--red);
        }
    }

    .content {
        // display: flex;
        padding: 0 0 4px 42px;
        position: relative;
    
        &::before {
            content: " ";
            width: 2px;
            height: calc(100%);
            position: absolute;
            left: 17px;
            bottom: 4px;
            border-radius: 5px;
            background-color: var(--text-primary);
            transition: .2s;
        }

        .edit {
            margin: 8px 0 0 0;
        }

        .text {
            overflow-wrap: break-word;
            word-wrap: break-word;
            line-break: loose, normal, strict;
            word-break: keep-all, break-all;
            hyphens: auto;
            -moz-hyphens: auto;
            -webkit-hyphens: auto;
            -ms-hyphens: auto;
        }

        .read {
            cursor: pointer;
            margin: 4px 0 0 0;
            width: max-content;
            color: var(--text-secondary);
            font-size: 12px;

            &:hover {
                text-decoration: underline;
            }
        }

        ul.buttons {
            display: flex;
            margin: 8px 0 0 0;
            align-items: center;

            li {
                cursor: pointer;
                display: flex;
                margin: 0 8px 0 0;
                align-items: center;
                transition: .2s;

                &:hover {
                    i, span {
                        color: var(--text-primary);
                    }
                }

                &:last-child {
                    margin: 0;
                }

                i, span {
                    color: var(--text-secondary);
                    // font-size: 18px;
                    transition: .2s;
                }

                span {
                    margin: 0 0 0 4px;
                    font-size: 12px;
                }
            }
        }
    }
}

</style>