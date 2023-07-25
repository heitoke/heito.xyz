<template>
    <div :class="['point', { active, blur: active }]"
        :style="{ transform: getTransform }"
        @click="active = true"
    >
        <header @click="active ? windows.create({ component: 'UserProfile', data: comments[0].user._id }) : null">
            <Image class="user-avatar" :src="getUserAvatar">
                <div v-if="comments.length > 1">+{{ comments.length - 1 }}</div>
            </Image>

            <div :style="`max-width: calc(100% - 48px - ${getButtons.length * 28}px);`" v-if="active">
                <Text :text="getUserNickname"/>
                <Text :text="time.timeago(getListComments[0]?.createdAt || comments[0]?.createdAt)"/>
            </div>

            <div style="margin: 0 0 0 auto;"></div> 

            <Icon v-for="btn of active ? getButtons : []" :key="btn.icon"
                :name="btn?.icon"
                @mouseenter="toolpics.set({ text: btn?.label })"
                @click.prevent.stop="btn?.click ? btn?.click() : null"
            />
        </header>

        <Height :showed="active" :opacity="true" :duration=".2">
            <ScrollBar max-height="376px">
                <div class="comments" v-if="getListComments.length > 0">
                    <Comment v-for="(comment, idx) of getListComments" :key="idx"
                        :show-header="idx > 0 || comment.user._id !== comments[0].user._id"
                        :comment="comment"
                        @comments="commentsComment($event)"
                        @delete="deleteComment($event)"
                    />
                </div>
                
                <Alert type="mini" v-else/>
            </ScrollBar>

            <div class="bar" v-if="reply.history.length > 0">
                <Textbox type="area" label="Content"
                    :value="reply.history[reply.history.length - 1].content"
                    @input="reply.history[reply.history.length - 1].content = $event.target.value"
                />

                <Icon name="quill"
                    @mouseenter="toolpics.set({ text: 'Send' })"
                    @click="createNewComment"
                />
            </div>
        </Height>
    </div>
</template>

<script lang="ts" setup>

import { PropType } from 'nuxt/dist/app/compat/capi';

import ScrollBar from '~/components/content/ScrollBar.vue';

import Comment from './Comment.vue';

import type { IComment } from 'types/api/comments';

interface Button {
    label: string;
    icon: string;
    click(): void;
}

interface Reply {
    active: boolean;
    history: Array<{
        id: string;
        content: string;
        list: Array<IComment>;
    }>;
}


const { $api, $win } = useNuxtApp();

const emit = defineEmits(['delete']);

const
    user = useUserStore(),
    toolpics = useToolpicsStore(),
    windows = useWindowsStore();


const props = defineProps({
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    comments: {
        type: Object as PropType<Array<IComment>>,
        required: true
    }
});

const
    active = ref<boolean>(false),
    reply = ref<Reply>({
        active: false,
        history: []
    });


const getButtons = computed<Array<Button>>(() => {
    return [
        reply.value.history.length > 0 ? {
            label: 'Back',
            icon: 'arrow-left',
            click: back
        } : {} as Button,
        {
            label: 'Close',
            icon: 'close',
            click: close
        }
    ].filter(b => b.icon);
});

const getListComments = computed(() => {
    const history = reply.value.history;

    return history.length > 0 ? history[history.length - 1]?.list || [] : props.comments;
});

const getUserNickname = computed(() => {
    const { nickname, username, _id } = props.comments[0]?.user;

    return nickname || username || _id;
});

const getUserAvatar = computed(() => {
    const { avatar, _id } = props.comments[0]?.user;

    return avatar || getAvatar({ nameId: _id });
});

const getTransform = computed(() => {
    const x = props.x + (100 * 256 / $win.size.width);

    return active.value ? `translateX(calc(${x > 100 ? (x - 100) * -1 : ''}% - 24px))` : ''
});




function close() {
    active.value = false;
}

function back() {
    reply.value.history.splice(reply.value.history.length - 1);
}

async function commentsComment(id: string) {
    reply.value.active = true;

    const [result, status] = await $api.comments.comments(id);

    if (status !== 200) return;

    reply.value.history = [
        ...reply.value.history || [],
        {
            id,
            content: '',
            list: result.results
        }
    ];
}

async function createNewComment() {
    const { history } = reply.value;

    const { id, content } = history[history.length - 1];

    if (!content || content.trim() === '') return;

    const newComment = {
        content,
        reply: id
    };

    const [result, status] = await $api.comments.create(newComment);

    if (status !== 200) return;

    history[history.length - 1].content = '';

    history[history.length - 1].list.push({
        ...result,
        user: user.getUser,
        likes: 0,
        dislikes: 0
    });
}

function deleteComment(commentId: string) {
    const history = reply.value.history;

    if (history.length > 0) {
        const index = getListComments.value.findIndex(comment => comment._id === commentId);

        history[history.length - 1]?.list.splice(index, 1);
    } else {
        emit('delete', commentId);
    }
}


</script>

<style lang="scss" scoped>

.point {
    padding: 4px;
    width: 46px;
    border-radius: 5px 50% 50% 50%;
    border: 1px solid var(--background-secondary-alt);
    background-color: var(--background-secondary);
    transition: all .3s;
    box-sizing: border-box;
    opacity: .4;

    &:hover,
    &.active {
        opacity: 1;
    }

    &:not(.active):active {
        .user-avatar {
            transform: scale(.85);
        }
    }

    &.active {
        padding: 8px;
        width: 256px;
        border-radius: 7px;
        background-color: #00000085;
        // transform: translateX(-50%);
        z-index: 5;

        header {
            margin: 0 0 8px 0;

            .user-avatar {
                margin: 0 8px 0 0;

                div {
                    opacity: 0;
                }
            }
        }
    }

    header {
        cursor: pointer;
        display: flex;
        align-items: center;
        transition: all .2s;

        .user-avatar {
            max-width: 36px;
            min-width: 36px;
            height: 36px;
            border-radius: 50%;

            div {
                width: 16px;
                height: 16px;
                position: absolute;
                right: 0;
                bottom: 0;
                color: var(--main-color);
                font-size: 10px;
                text-align: center;
                line-height: 16px;
                border-radius: 50% 0 50% 0;
                background-color: var(--background-secondary);
                transition: .2s;
            }
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
            padding: 8px;
            
            &.i-close {
                color: var(--red);
            }
        }
    }

    .comments {
        .comment {
            margin: 0 0 12px 0;

            &:last-child {
                margin: 0;
            }
        }
    }

    .bar {
        display: flex;
        margin: 12px 0 0 0;
        align-items: flex-start;

        i {
            cursor: pointer;
            margin: 0 0 0 8px;
            padding: 8px;

        }
    }
}

</style>